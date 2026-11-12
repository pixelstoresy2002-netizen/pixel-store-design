import type {
  FilterState,
  Language,
  Offer,
  OfferTemporalStatus,
  Product,
  StoreService,
} from '../types/store.ts';

/**
 * Converts a USD price to Syrian Pounds (SYP) using the global Admin exchange rate.
 */
export function convertUsdToSyp(priceUsd: number, rate: number): number {
  if (priceUsd < 0 || rate <= 0) return 0;
  return Math.round(priceUsd * rate);
}

/**
 * Formats USD price cleanly (e.g., "$1,249" or "$49.50").
 */
export function formatUsd(priceUsd: number): string {
  const isWhole = Number.isInteger(priceUsd);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(priceUsd);
}

/**
 * Formats SYP price cleanly with thousands separators and localized unit label.
 */
export function formatSyp(priceSyp: number, lang: Language): string {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(priceSyp);
  return lang === 'ar' ? `${formattedNumber} ل.س` : `${formattedNumber} SYP`;
}

/**
 * Determines the temporal lifecycle state of an offer (ACTIVE, SCHEDULED, or EXPIRED).
 */
export function getOfferTemporalStatus(
  offer: Offer,
  nowMs: number
): OfferTemporalStatus {
  if (offer.isActive === false) return 'EXPIRED';
  const startMs = new Date(offer.startTime).getTime();
  const endMs = new Date(offer.endTime).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 'EXPIRED';
  if (nowMs < startMs) return 'SCHEDULED';
  if (nowMs >= endMs) return 'EXPIRED';
  return 'ACTIVE';
}

/**
 * Determines whether an offer is currently active at a given reference timestamp.
 * Expired offers (now >= endTime), disabled offers, or not-yet-started offers (now < startTime) return false.
 */
export function isOfferActive(offer: Offer, nowMs: number): boolean {
  return getOfferTemporalStatus(offer, nowMs) === 'ACTIVE';
}

/**
 * Returns the active offer for a product if one exists and has not expired.
 */
export function getActiveOfferForProduct(
  productId: string,
  offers: Offer[],
  nowMs: number
): Offer | undefined {
  return offers.find(
    (offer) => offer.productId === productId && isOfferActive(offer, nowMs)
  );
}

/**
 * Calculates integer discount percentage between original USD price and discounted offer USD price.
 */
export function calculateDiscountPercent(
  originalUsd: number,
  offerUsd: number
): number {
  if (originalUsd <= 0 || offerUsd >= originalUsd || offerUsd <= 0) return 0;
  return Math.round(((originalUsd - offerUsd) / originalUsd) * 100);
}

/**
 * Resolves the effective pricing for a product (accounting for active vs expired offers).
 * When an offer expires, the product automatically reverts to its regular USD base price.
 */
export function resolveProductPricing(
  product: Product,
  offers: Offer[],
  usdToSypRate: number,
  nowMs: number
): {
  effectiveUsd: number;
  originalUsd: number;
  effectiveSyp: number;
  originalSyp: number;
  hasActiveOffer: boolean;
  discountPercent: number;
  activeOffer?: Offer;
} {
  const activeOffer = getActiveOfferForProduct(product.id, offers, nowMs);
  const originalUsd = product.priceUsd;
  const effectiveUsd =
    activeOffer && activeOffer.offerPriceUsd < originalUsd
      ? activeOffer.offerPriceUsd
      : originalUsd;

  const hasActiveOffer = Boolean(
    activeOffer && activeOffer.offerPriceUsd < originalUsd
  );

  const discountPercent = hasActiveOffer
    ? calculateDiscountPercent(originalUsd, effectiveUsd)
    : 0;

  return {
    effectiveUsd,
    originalUsd,
    effectiveSyp: convertUsdToSyp(effectiveUsd, usdToSypRate),
    originalSyp: convertUsdToSyp(originalUsd, usdToSypRate),
    hasActiveOffer,
    discountPercent,
    activeOffer: hasActiveOffer ? activeOffer : undefined,
  };
}

/**
 * Calculates remaining time breakdown for a countdown timer.
 */
export function getRemainingTimeParts(endTimeIso: string, nowMs: number): {
  expired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const endMs = new Date(endTimeIso).getTime();
  const diff = endMs - nowMs;
  if (Number.isNaN(endMs) || diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { expired: false, days, hours, minutes, seconds };
}

/**
 * Validates Customer Product Request form inputs.
 */
export function validateCustomerRequest(input: {
  customerName: string;
  phoneNumber: string;
}): { valid: boolean; errorAr?: string; errorEn?: string } {
  const trimmedName = input.customerName.trim();
  const trimmedPhone = input.phoneNumber.trim();
  if (trimmedName.length < 2) {
    return {
      valid: false,
      errorAr: 'يرجى إدخال الاسم الكامل (حرفين على الأقل).',
      errorEn: 'Please enter your full name (at least 2 characters).',
    };
  }
  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    return {
      valid: false,
      errorAr: 'يرجى إدخال رقم هاتف صحيح للتواصل عبر واتساب.',
      errorEn: 'Please enter a valid phone number for WhatsApp follow-up.',
    };
  }
  return { valid: true };
}

/**
 * Filters and sorts catalog products according to active FilterState and current timestamp.
 */
export function filterAndSortProducts(
  products: Product[],
  offers: Offer[],
  usdToSypRate: number,
  filters: FilterState,
  nowMs: number
): Product[] {
  const q = filters.searchQuery.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (p.isActive === false) return false;
    // Search query match across Arabic name, English name, SKU, and descriptions
    if (q) {
      const hay = [
        p.name.ar,
        p.name.en,
        p.sku,
        p.description.ar,
        p.description.en,
        p.laptopSpecs?.processor ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (filters.categoryId !== 'ALL' && p.categoryId !== filters.categoryId) {
      return false;
    }

    if (
      filters.subcategoryId !== 'ALL' &&
      p.subcategoryId !== filters.subcategoryId
    ) {
      return false;
    }

    if (
      filters.useCaseId !== 'ALL' &&
      !p.useCaseIds.includes(filters.useCaseId)
    ) {
      return false;
    }

    if (
      filters.brandIds.length > 0 &&
      !filters.brandIds.includes(p.brandId)
    ) {
      return false;
    }

    if (
      filters.conditions.length > 0 &&
      !filters.conditions.includes(p.condition)
    ) {
      return false;
    }

    if (
      filters.availabilities.length > 0 &&
      !filters.availabilities.includes(p.availability)
    ) {
      return false;
    }

    const pricing = resolveProductPricing(p, offers, usdToSypRate, nowMs);

    if (
      pricing.effectiveUsd < filters.minPriceUsd ||
      pricing.effectiveUsd > filters.maxPriceUsd
    ) {
      return false;
    }

    if (filters.onlyOffers && !pricing.hasActiveOffer) {
      return false;
    }

    if (filters.onlyBestSellers && !p.isBestSeller) {
      return false;
    }

    if (filters.onlyNewArrivals && !p.isNewArrival) {
      return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    const priceA = resolveProductPricing(a, offers, usdToSypRate, nowMs).effectiveUsd;
    const priceB = resolveProductPricing(b, offers, usdToSypRate, nowMs).effectiveUsd;

    switch (filters.sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default: {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        if (a.isBestSeller !== b.isBestSeller) return a.isBestSeller ? -1 : 1;
        return 0;
      }
    }
  });
}

export const DEFAULT_THEME_ID = 'contrast' as const;
export const DEFAULT_ARABIC_FONT_ID = 'cairo' as const;
export const HERO_AUTOPLAY_INTERVAL_MS = 5500;
export const GALLERY_HOVER_INTERVAL_MS = 1000;
export const MAX_PRODUCT_GALLERY_IMAGES = 5;

export const OFFICIAL_PRIMARY_PHONE_DISPLAY = '+963 933 811 106';
export const OFFICIAL_PRIMARY_PHONE_TEL = 'tel:+963933811106';

export const VISUAL_KEY_PRESETS: {
  group: string;
  keys: string[];
}[] = [
  {
    group: 'Laptops (ROG / LOQ / ThinkPad / VivoBook)',
    keys: [
      'laptop-rog-front',
      'laptop-rog-side',
      'laptop-rog-ports',
      'laptop-rog-cooling',
      'laptop-rog-kit',
      'laptop-loq-front',
      'laptop-loq-angled',
      'laptop-loq-ports',
      'laptop-loq-cooling',
      'laptop-loq-kit',
      'laptop-thinkpad-front',
      'laptop-thinkpad-top',
      'laptop-thinkpad-ports',
      'laptop-thinkpad-cooling',
      'laptop-thinkpad-kit',
      'laptop-vivobook-front',
      'laptop-vivobook-side',
      'laptop-vivobook-ports',
      'laptop-vivobook-cooling',
      'laptop-vivobook-kit',
    ],
  },
  {
    group: 'Keyboards & Mice (Gaming & Office)',
    keys: [
      'kb-fizz-front',
      'kb-fizz-switches',
      'kb-fizz-keycaps',
      'kb-fizz-profile',
      'kb-fizz-kit',
      'kb-huntsman-front',
      'kb-huntsman-dial',
      'kb-huntsman-keycaps',
      'kb-huntsman-profile',
      'kb-huntsman-kit',
      'kb-mxkeys-front',
      'kb-mxkeys-side',
      'kb-mxkeys-keycaps',
      'kb-mxkeys-profile',
      'kb-mxkeys-kit',
      'mouse-superlight-front',
      'mouse-superlight-side',
      'mouse-superlight-sensor',
      'mouse-superlight-grip',
      'mouse-superlight-kit',
      'mouse-mxmaster-front',
      'mouse-mxmaster-wheel',
      'mouse-mxmaster-sensor',
      'mouse-mxmaster-grip',
      'mouse-mxmaster-kit',
    ],
  },
  {
    group: 'Audio (Headsets / IEM / Earbuds)',
    keys: [
      'audio-cloud3-front',
      'audio-cloud3-mic',
      'audio-cloud3-driver',
      'audio-cloud3-acoustic',
      'audio-cloud3-kit',
      'audio-iem-front',
      'audio-iem-cable',
      'audio-iem-driver',
      'audio-iem-acoustic',
      'audio-iem-kit',
      'audio-earbuds-front',
      'audio-earbuds-case',
      'audio-earbuds-driver',
      'audio-earbuds-acoustic',
      'audio-earbuds-kit',
    ],
  },
  {
    group: 'PC Components & Custom Rigs',
    keys: [
      'comp-gpu-front',
      'comp-gpu-backplate',
      'comp-gpu-cooling',
      'comp-gpu-pcb',
      'comp-gpu-kit',
      'comp-cpu-front',
      'comp-cpu-chip',
      'comp-cpu-cooling',
      'comp-cpu-pcb',
      'comp-cpu-kit',
      'comp-mobo-front',
      'comp-mobo-io',
      'comp-ram-front',
      'comp-ram-rgb',
      'comp-ssd-front',
      'comp-ssd-installed',
      'comp-psu-front',
      'comp-case-front',
      'build-nebula-front',
      'build-nebula-angle',
      'build-nebula-cooling',
      'build-nebula-pcb',
      'build-nebula-kit',
      'acc-charger-front',
      'acc-charger-ports',
    ],
  },
  {
    group: 'Services & Technical Workshop (Local Asset Galleries)',
    keys: [
      '/assets/services/cooling-1.svg',
      '/assets/services/cooling-2.svg',
      '/assets/services/cooling-3.svg',
      '/assets/services/cooling-4.svg',
      '/assets/services/cooling-5.svg',
      '/assets/services/maintenance-1.svg',
      '/assets/services/maintenance-2.svg',
      '/assets/services/maintenance-3.svg',
      '/assets/services/maintenance-4.svg',
      '/assets/services/maintenance-5.svg',
      '/assets/services/cameras-1.svg',
      '/assets/services/cameras-2.svg',
      '/assets/services/cameras-3.svg',
      '/assets/services/cameras-4.svg',
      '/assets/services/cameras-5.svg',
    ],
  },
];

/**
 * Formats a display phone string into a clean tel: URI (e.g., "+963 933 811 106" -> "tel:+963933811106").
 */
export function formatPhoneTelHref(rawPhone: string): string {
  const cleaned = (rawPhone || '').replace(/[^+\d]/g, '');
  return `tel:${cleaned}`;
}

/**
 * Returns up to 5 unique, non-empty gallery visual keys for a product.
 * Always preserves primaryImage as index 0 and never duplicates identical visual keys.
 */
export function getProductGalleryImages(
  product: Pick<Product, 'primaryImage' | 'secondaryImage' | 'galleryImages'>
): string[] {
  const candidates = [
    product.primaryImage,
    ...(product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.secondaryImage]),
    product.secondaryImage,
  ];
  const unique: string[] = [];
  for (const item of candidates) {
    const trimmed = (item || '').trim();
    if (trimmed && !unique.includes(trimmed)) {
      unique.push(trimmed);
      if (unique.length >= MAX_PRODUCT_GALLERY_IMAGES) {
        break;
      }
    }
  }
  return unique;
}

/**
 * Returns up to 5 unique gallery image paths/keys for a service.
 * Respects explicit galleryImages configured by Admin (including fewer than 5 when images are removed),
 * and falls back to the 5 local /assets/services/*.svg files when unconfigured.
 */
export function getServiceGalleryImages(
  service: Pick<StoreService, 'iconKey' | 'primaryImage' | 'galleryImages'>
): string[] {
  const baseFamily =
    service.iconKey === 'cooling'
      ? 'cooling'
      : service.iconKey === 'cameras'
      ? 'cameras'
      : 'maintenance';

  const defaultFallbacks = [
    `/assets/services/${baseFamily}-1.svg`,
    `/assets/services/${baseFamily}-2.svg`,
    `/assets/services/${baseFamily}-3.svg`,
    `/assets/services/${baseFamily}-4.svg`,
    `/assets/services/${baseFamily}-5.svg`,
  ];

  const hasExplicitGallery =
    Array.isArray(service.galleryImages) &&
    service.galleryImages.some((img) => Boolean((img || '').trim()));

  const candidates = hasExplicitGallery
    ? [service.primaryImage ?? '', ...(service.galleryImages ?? [])]
    : [service.primaryImage ?? '', ...defaultFallbacks];

  const unique: string[] = [];
  for (const item of candidates) {
    const trimmed = (item || '').trim();
    if (trimmed && !unique.includes(trimmed)) {
      unique.push(trimmed);
      if (unique.length >= MAX_PRODUCT_GALLERY_IMAGES) {
        break;
      }
    }
  }
  return unique.length > 0 ? unique : defaultFallbacks;
}

/**
 * Calculates the next cyclic gallery image index during pointer hover.
 * Cycles 0 -> 1 -> 2 -> 3 -> 4 -> 0 when 5 images are available.
 */
export function getNextGalleryImageIndex(
  currentIndex: number,
  totalImages: number
): number {
  if (totalImages <= 1) return 0;
  return (currentIndex + 1) % totalImages;
}

/**
 * Calculates the next cyclic slide index for the 5-slide hero carousel.
 */
export function getNextHeroSlideIndex(
  currentIndex: number,
  totalSlides: number,
  direction: 'next' | 'prev' = 'next'
): number {
  if (totalSlides <= 0) return 0;
  if (direction === 'prev') {
    return (currentIndex - 1 + totalSlides) % totalSlides;
  }
  return (currentIndex + 1) % totalSlides;
}

/**
 * Checks whether a configured phone number is a real, verified number rather than a demo placeholder.
 */
export function isPhoneLinkVerified(rawPhone?: string): boolean {
  if (!rawPhone) return false;
  const trimmed = rawPhone.trim();
  if (!trimmed || /x/i.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 8) return false;
  if (
    digits.endsWith('000000') ||
    digits === '963944000111' ||
    digits === '963955000222'
  ) {
    return false;
  }
  return true;
}

/**
 * Checks whether a configured WhatsApp number is a real, verified number rather than a demo placeholder.
 */
export function isWhatsappLinkVerified(rawWhatsapp?: string): boolean {
  return isPhoneLinkVerified(rawWhatsapp);
}

/**
 * Normalizes a social handle or URL into an full https URL.
 */
export function normalizeChannelUrl(raw: string, prefixUrl: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return prefixUrl;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanHandle = trimmed
    .replace(/^@/, '')
    .replace(/^(t\.me\/|fb\.com\/|facebook\.com\/|instagram\.com\/)/i, '');
  return `${prefixUrl}${cleanHandle}`;
}

/**
 * Checks whether a social/map URL or handle points to a specific configured destination
 * rather than a bare generic homepage or placeholder.
 */
export function isExternalChannelVerified(rawValue?: string): boolean {
  if (!rawValue) return false;
  const trimmed = rawValue.trim();
  if (!trimmed || trimmed === '#' || /xxx|placeholder|example/i.test(trimmed)) {
    return false;
  }

  // If it's a full URL, reject bare generic domains or unverified Damascus placeholder
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const pathClean = parsed.pathname.replace(/\/+$/g, '');
      const searchClean = parsed.search.trim();
      if (!pathClean && !searchClean) {
        return false;
      }
      if (/q=damascus/i.test(searchClean)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Otherwise it's a handle (e.g., "@pixelstore" or "pixelstore")
  const cleanHandle = trimmed
    .replace(/^@/, '')
    .replace(/^(t\.me\/|fb\.com\/|facebook\.com\/|instagram\.com\/)/i, '')
    .replace(/\/+$/g, '')
    .trim();

  return cleanHandle.length >= 2;
}



