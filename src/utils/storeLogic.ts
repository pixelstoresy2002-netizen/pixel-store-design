import {
  FilterState,
  Language,
  Offer,
  Product,
} from '../types/store';

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
 * Determines whether an offer is currently active at a given reference timestamp.
 * Expired offers (now >= endTime) or not-yet-started offers (now < startTime) return false.
 */
export function isOfferActive(offer: Offer, nowMs: number): boolean {
  const startMs = new Date(offer.startTime).getTime();
  const endMs = new Date(offer.endTime).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return false;
  return nowMs >= startMs && nowMs < endMs;
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
    ? Math.round(((originalUsd - effectiveUsd) / originalUsd) * 100)
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

export const DEFAULT_THEME_ID = 'hybrid' as const;
export const DEFAULT_ARABIC_FONT_ID = 'tajawal' as const;

export const ARABIC_FONT_OPTIONS = [
  {
    id: 'tajawal' as const,
    name: 'Tajawal',
    labelAr: 'تجوال (الافتراضي)',
    labelEn: 'Tajawal (Default)',
    cssFamily: "'Tajawal', sans-serif",
    previewClass: 'font-preview-tajawal',
  },
  {
    id: 'readex' as const,
    name: 'Readex Pro',
    labelAr: 'ريدكس برو (Readex Pro)',
    labelEn: 'Readex Pro',
    cssFamily: "'Readex Pro', sans-serif",
    previewClass: 'font-preview-readex',
  },
  {
    id: 'ibm' as const,
    name: 'IBM Plex Sans Arabic',
    labelAr: 'آي بي إم بليكس (IBM Plex)',
    labelEn: 'IBM Plex Sans Arabic',
    cssFamily: "'IBM Plex Sans Arabic', sans-serif",
    previewClass: 'font-preview-ibm',
  },
  {
    id: 'alexandria' as const,
    name: 'Alexandria',
    labelAr: 'الإسكندرية (Alexandria)',
    labelEn: 'Alexandria',
    cssFamily: "'Alexandria', sans-serif",
    previewClass: 'font-preview-alexandria',
  },
  {
    id: 'almarai' as const,
    name: 'Almarai',
    labelAr: 'المراعي (Almarai)',
    labelEn: 'Almarai',
    cssFamily: "'Almarai', sans-serif",
    previewClass: 'font-preview-almarai',
  },
  {
    id: 'cairo' as const,
    name: 'Cairo',
    labelAr: 'كايرو (Cairo)',
    labelEn: 'Cairo',
    cssFamily: "'Cairo', sans-serif",
    previewClass: 'font-preview-cairo',
  },
];

export const DESIGN_THEME_OPTIONS = [
  {
    id: 'hybrid' as const,
    nameEn: 'Original Hybrid',
    nameAr: 'الهجين الأصلي (Original Hybrid)',
    descAr: 'واجهة فاتحة متوازنة مع أقسام عروض داكنة وهوية بنفسجية واضحة',
    descEn: 'Balanced light storefront with dark exclusive-offers contrast and purple identity',
  },
  {
    id: 'contrast' as const,
    nameEn: 'Pixel Contrast',
    nameAr: 'تباين بيكسل (Pixel Contrast)',
    descAr: 'ترويسة ومنطقة عروض داكنة بلمسات Pixel تقنية وتباين بصري أقوى',
    descEn: 'Dark ink header & hero region, asymmetric promo layouts, and crisp pixel-tech accents',
  },
  {
    id: 'retail' as const,
    nameEn: 'Retail Focus',
    nameAr: 'التركيز التجاري (Retail Focus)',
    descAr: 'تخطيط تجاري عالي الكثافة يركز على سرعة استكشاف المنتجات والعروض',
    descEn: 'High-efficiency commercial catalog layout with Coral promo highlights and dense discovery',
  },
];

export function formatDesignSelectionSummary(
  themeId: 'hybrid' | 'contrast' | 'retail',
  fontId: 'tajawal' | 'readex' | 'ibm' | 'alexandria' | 'almarai' | 'cairo'
): string {
  const theme =
    DESIGN_THEME_OPTIONS.find((t) => t.id === themeId) ??
    DESIGN_THEME_OPTIONS[0];
  const font =
    ARABIC_FONT_OPTIONS.find((f) => f.id === fontId) ?? ARABIC_FONT_OPTIONS[0];
  return `Theme: ${theme.nameEn} | Font: ${font.name}`;
}

