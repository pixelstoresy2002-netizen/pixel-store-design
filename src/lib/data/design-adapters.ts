import type {
  BilingualText,
  Brand,
  Category,
  GenericSpec,
  HeroSlide,
  Offer,
  Product,
  PromoBanner,
  StoreService,
  StoreSettings,
  UseCaseTag,
} from '@/types/store';

export type ProductImageRecord = { url: string; sortOrder: number };
export type ServiceImageRecord = { url: string; sortOrder: number };

export interface ProductRecord {
  id: string;
  slug: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceUsdCents: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST';
  condition: 'NEW' | 'USED';
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  extraSpecs: unknown;
  category: { slug: string; parent: { slug: string } | null };
  brand: { slug: string };
  useCaseTags: Array<{ slug: string }>;
  laptopSpecs: { processor: string | null; memory: string | null; storage: string | null; display: string | null } | null;
  images: ProductImageRecord[];
}

export interface CategoryRecord {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  isActive: boolean;
  parent: { slug: string } | null;
  useCaseTags: Array<{ slug: string }>;
}

export interface BrandRecord {
  slug: string;
  name: string;
  isActive: boolean;
}

export interface UseCaseTagRecord {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  isActive: boolean;
  categories: Array<{ slug: string }>;
}

export interface OfferRecord {
  id: string;
  productId: string;
  titleAr: string;
  titleEn: string;
  priceUsdCents: number;
  startsAt: Date;
  endsAt: Date;
  isEnabled: boolean;
  isExclusive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomepageBannerRecord {
  id: string;
  kind: 'HERO' | 'PROMO';
  titleAr: string;
  titleEn: string;
  subtitleAr: string | null;
  subtitleEn: string | null;
  imageUrl: string;
  destinationUrl: string | null;
  destinationLabelAr: string | null;
  destinationLabelEn: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface StoreServiceRecord {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string | null;
  shortDescriptionEn: string | null;
  descriptionAr: string;
  descriptionEn: string;
  highlights: unknown;
  workflowSteps: unknown;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  images: ServiceImageRecord[];
}

export interface SiteSettingsRecord {
  storeNameAr: string;
  storeNameEn: string;
  storeDescriptionAr: string | null;
  storeDescriptionEn: string | null;
  usdToSypRate: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  addressAr: string | null;
  addressEn: string | null;
  facebook: string | null;
  instagram: string | null;
}

export type OfferTemporalState = 'ACTIVE' | 'SCHEDULED' | 'DISABLED' | 'EXPIRED';

const emptyBilingual: BilingualText = { ar: '', en: '' };

function bilingual(ar: string | null | undefined, en: string | null | undefined): BilingualText {
  return { ar: ar ?? '', en: en ?? '' };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function orderedUrls(images: Array<{ url: string; sortOrder: number }>, maximum?: number) {
  const urls = [...images]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((image) => image.url)
    .filter((url) => url.length > 0);
  return maximum === undefined ? urls : urls.slice(0, maximum);
}

function mapSpecifications(value: unknown): GenericSpec[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isObject(item)) return [];
    const labelAr = stringValue(item.labelAr);
    const labelEn = stringValue(item.labelEn);
    const valueAr = stringValue(item.valueAr);
    const valueEn = stringValue(item.valueEn);
    return labelAr && labelEn && valueAr && valueEn
      ? [{ label: bilingual(labelAr, labelEn), value: bilingual(valueAr, valueEn) }]
      : [];
  });
}

function mapHighlights(value: unknown): StoreService['highlights'] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isObject(item)) return [];
    const title = bilingual(stringValue(item.titleAr), stringValue(item.titleEn));
    if (!title.ar || !title.en) return [];
    return [{ title, description: bilingual(stringValue(item.descriptionAr), stringValue(item.descriptionEn)) }];
  });
}

function mapWorkflowTitles(value: unknown): BilingualText[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isObject(item)) return [];
    const title = bilingual(stringValue(item.titleAr), stringValue(item.titleEn));
    return title.ar && title.en ? [title] : [];
  });
}

/** Database cents stay authoritative; this converts only for the existing display contract. */
export function usdCentsToDisplay(cents: number) {
  return cents / 100;
}

export function mapProduct(record: ProductRecord): Product {
  const galleryImages = orderedUrls(record.images);
  const primaryImage = galleryImages[0] ?? '';

  return {
    id: record.id,
    slug: record.slug,
    sku: record.sku,
    name: bilingual(record.nameAr, record.nameEn),
    description: bilingual(record.descriptionAr, record.descriptionEn),
    categoryId: record.category.parent?.slug ?? record.category.slug,
    ...(record.category.parent ? { subcategoryId: record.category.slug } : {}),
    brandId: record.brand.slug,
    useCaseIds: record.useCaseTags.map((tag) => tag.slug),
    priceUsd: usdCentsToDisplay(record.priceUsdCents),
    condition: record.condition,
    availability: record.stockStatus,
    primaryImage,
    secondaryImage: galleryImages[1] ?? primaryImage,
    galleryImages,
    isBestSeller: record.isBestSeller,
    isNewArrival: record.isNewArrival,
    isFeatured: record.isFeatured,
    isActive: record.isActive,
    ...(record.laptopSpecs
      ? { laptopSpecs: { processor: record.laptopSpecs.processor ?? '', memory: record.laptopSpecs.memory ?? '', storage: record.laptopSpecs.storage ?? '', display: record.laptopSpecs.display ?? '' } }
      : {}),
    specs: mapSpecifications(record.extraSpecs),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapCategory(record: CategoryRecord): Category {
  return {
    id: record.slug,
    slug: record.slug,
    name: bilingual(record.nameAr, record.nameEn),
    description: bilingual(record.descriptionAr, record.descriptionEn),
    iconKey: '',
    ...(record.parent ? { parentId: record.parent.slug } : {}),
    useCaseIds: record.useCaseTags.map((tag) => tag.slug),
    visualKey: '',
    sortOrder: record.sortOrder,
    isActive: record.isActive,
  };
}

export function mapBrand(record: BrandRecord): Brand {
  return { id: record.slug, slug: record.slug, name: record.name, country: emptyBilingual, featured: false, isActive: record.isActive };
}

export function mapUseCaseTag(record: UseCaseTagRecord): UseCaseTag {
  return {
    id: record.slug,
    slug: record.slug,
    name: bilingual(record.nameAr, record.nameEn),
    subtitle: bilingual(record.descriptionAr, record.descriptionEn),
    applicableCategories: record.categories.map((category) => category.slug),
    accentColor: 'purple',
    visualKey: '',
    sortOrder: record.sortOrder,
    isActive: record.isActive,
  };
}

export function getOfferTemporalState(record: Pick<OfferRecord, 'isEnabled' | 'startsAt' | 'endsAt'>, now: Date): OfferTemporalState {
  if (!record.isEnabled) return 'DISABLED';
  if (record.startsAt.getTime() > now.getTime()) return 'SCHEDULED';
  if (record.endsAt.getTime() <= now.getTime()) return 'EXPIRED';
  return 'ACTIVE';
}

export function mapOffer(record: OfferRecord, now: Date): Offer {
  return {
    id: record.id,
    productId: record.productId,
    title: bilingual(record.titleAr, record.titleEn),
    // The schema has no separate badge field; title is the only verified promotional label.
    badgeText: bilingual(record.titleAr, record.titleEn),
    offerPriceUsd: usdCentsToDisplay(record.priceUsdCents),
    startTime: record.startsAt.toISOString(),
    endTime: record.endsAt.toISOString(),
    isExclusive: record.isExclusive,
    isActive: getOfferTemporalState(record, now) === 'ACTIVE',
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function bannerDestination(destinationUrl: string | null): Pick<HeroSlide, 'targetView' | 'targetCategory' | 'targetSubcategory'> {
  const path = destinationUrl?.trim().replace(/^https?:\/\/[^/]+/u, '') ?? '';
  if (path === '/catalog' || path.startsWith('/catalog?')) return { targetView: 'shop' };
  if (path === '/offers') return { targetView: 'offers' };
  if (path === '/services') return { targetView: 'services' };
  if (path === '/contact') return { targetView: 'contact' };
  const categoryMatch = /^\/category\/([^/]+)(?:\/([^/?#]+))?/u.exec(path);
  if (categoryMatch) return { targetView: 'category', targetCategory: categoryMatch[1], ...(categoryMatch[2] ? { targetSubcategory: categoryMatch[2] } : {}) };
  return { targetView: 'home' };
}

export function mapHomepageBanners(records: HomepageBannerRecord[]) {
  const heroSlides: HeroSlide[] = [];
  const promoBanners: PromoBanner[] = [];
  for (const record of [...records].sort((left, right) => left.sortOrder - right.sortOrder)) {
    const shared = {
      id: record.id,
      kicker: emptyBilingual,
      title: bilingual(record.titleAr, record.titleEn),
      subtitle: bilingual(record.subtitleAr, record.subtitleEn),
      ctaLabel: bilingual(record.destinationLabelAr, record.destinationLabelEn),
      visualKey: record.imageUrl,
      ...bannerDestination(record.destinationUrl),
      sortOrder: record.sortOrder,
      isActive: record.isActive,
    };
    if (record.kind === 'HERO') heroSlides.push({ ...shared, accent: '' });
    else promoBanners.push({ ...shared, themeVariant: 'dark' });
  }
  return { heroSlides, promoBanners };
}

export function mapStoreService(record: StoreServiceRecord): StoreService {
  const galleryImages = orderedUrls(record.images, 5);
  const subtitle = bilingual(record.shortDescriptionAr, record.shortDescriptionEn);
  return {
    id: record.id,
    slug: record.slug,
    title: bilingual(record.nameAr, record.nameEn),
    badge: emptyBilingual,
    subtitle,
    ...(subtitle.ar || subtitle.en ? { summary: subtitle } : {}),
    description: bilingual(record.descriptionAr, record.descriptionEn),
    ...(galleryImages[0] ? { primaryImage: galleryImages[0] } : {}),
    galleryImages,
    highlights: mapHighlights(record.highlights),
    checklist: mapWorkflowTitles(record.workflowSteps),
    turnaroundNote: emptyBilingual,
    iconKey: '',
    isActive: record.isActive,
    isFeatured: record.isFeatured,
    sortOrder: record.sortOrder,
  };
}

export function mapStoreSettings(record: SiteSettingsRecord | null): StoreSettings | null {
  if (!record) return null;
  return {
    storeName: bilingual(record.storeNameAr, record.storeNameEn),
    tagline: bilingual(record.storeDescriptionAr, record.storeDescriptionEn),
    usdToSypRate: record.usdToSypRate,
    phone: record.phone ?? '',
    whatsappNumber: record.whatsapp ?? '',
    address: bilingual(record.addressAr, record.addressEn),
    workingHours: emptyBilingual,
    instagramHandle: record.instagram ?? '',
    facebookPage: record.facebook ?? '',
    telegramChannel: '',
    topPromoBanner: emptyBilingual,
    topPromoActive: false,
  };
}

/** Converts database BigInt values before any future server-to-client boundary. */
export function serializeBigIntForClient<T>(value: T): T {
  if (typeof value === 'bigint') return value.toString() as T;
  if (Array.isArray(value)) return value.map((item) => serializeBigIntForClient(item)) as T;
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeBigIntForClient(item)])) as T;
  }
  return value;
}
