export type Language = 'ar' | 'en';

export type DesignThemeId = 'contrast' | 'hybrid' | 'retail';

export type ArabicFontId =
  | 'cairo'
  | 'tajawal'
  | 'readex'
  | 'ibm'
  | 'alexandria'
  | 'almarai';

export type ProductCondition = 'NEW' | 'USED';

export type AvailabilityStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface LaptopSpecs {
  processor: string;
  memory: string;
  storage: string;
  display: string;
}

export interface GenericSpec {
  label: BilingualText;
  value: BilingualText;
}

export interface Product {
  id: string;
  sku: string;
  slug?: string;
  name: BilingualText;
  description: BilingualText;
  categoryId: string;
  subcategoryId?: string;
  brandId: string;
  useCaseIds: string[];
  priceUsd: number;
  condition: ProductCondition;
  availability: AvailabilityStatus;
  primaryImage: string;
  secondaryImage: string;
  galleryImages?: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive?: boolean;
  laptopSpecs?: LaptopSpecs;
  specs: GenericSpec[];
  createdAt: string;
  updatedAt?: string;
}

export type OfferTemporalStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';

export interface Offer {
  id: string;
  productId: string;
  title: BilingualText;
  badgeText: BilingualText;
  offerPriceUsd: number;
  startTime: string;
  endTime: string;
  isExclusive: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  slug?: string;
  name: BilingualText;
  description: BilingualText;
  iconKey: string;
  parentId?: string;
  useCaseIds: string[];
  visualKey: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UseCaseTag {
  id: string;
  slug?: string;
  name: BilingualText;
  subtitle: BilingualText;
  applicableCategories: string[];
  accentColor: 'purple' | 'pink' | 'coral';
  visualKey: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Brand {
  id: string;
  slug?: string;
  name: string;
  country: BilingualText;
  featured: boolean;
  isActive?: boolean;
}

export type BannerDestinationView =
  | 'home'
  | 'shop'
  | 'category'
  | 'offers'
  | 'services'
  | 'contact';

export interface HeroSlide {
  id: string;
  kicker: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  ctaLabel: BilingualText;
  visualKey: string;
  targetView: BannerDestinationView;
  targetCategory?: string;
  targetSubcategory?: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PromoBanner {
  id: string;
  kicker: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  ctaLabel: BilingualText;
  visualKey: string;
  targetView: BannerDestinationView;
  targetCategory?: string;
  targetSubcategory?: string;
  themeVariant: 'dark' | 'contrast';
  sortOrder: number;
  isActive: boolean;
}

export interface CustomerRequest {
  id: string;
  productId: string;
  productName: BilingualText;
  productSku: string;
  priceUsdAtRequest: number;
  priceSypAtRequest: number;
  customerName: string;
  phoneNumber: string;
  note: string;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
  status: 'NEW' | 'CONTACTED' | 'COMPLETED';
}

export interface StoreService {
  id: string;
  slug: string;
  title: BilingualText;
  badge: BilingualText;
  subtitle: BilingualText;
  summary?: BilingualText;
  description: BilingualText;
  primaryImage?: string;
  galleryImages?: string[];
  highlights: {
    title: BilingualText;
    description: BilingualText;
  }[];
  checklist: BilingualText[];
  turnaroundNote: BilingualText;
  startingPriceNote?: BilingualText;
  iconKey: 'cooling' | 'maintenance' | 'cameras' | 'custom' | string;
  isActive: boolean;
  isFeatured: boolean;
  showInNavbarShortcut?: boolean;
  sortOrder?: number;
  thermalBenchmark?: {
    deviceModel: BilingualText;
    beforeTempC: number;
    afterTempC: number;
    sustainedClockBefore: string;
    sustainedClockAfter: string;
    fanNoiseBefore: BilingualText;
    fanNoiseAfter: BilingualText;
  };
}

export interface StoreSettings {
  storeName: BilingualText;
  tagline: BilingualText;
  usdToSypRate: number;
  phone: string;
  secondaryPhone?: string;
  whatsappNumber: string;
  mapLocationUrl?: string;
  address: BilingualText;
  workingHours: BilingualText;
  instagramHandle: string;
  facebookPage: string;
  telegramChannel: string;
  topPromoBanner: BilingualText;
  topPromoActive: boolean;
}

export interface FilterState {
  searchQuery: string;
  categoryId: string | 'ALL';
  subcategoryId: string | 'ALL';
  useCaseId: string | 'ALL';
  brandIds: string[];
  minPriceUsd: number;
  maxPriceUsd: number;
  conditions: ProductCondition[];
  availabilities: AvailabilityStatus[];
  onlyOffers?: boolean;
  onlyBestSellers?: boolean;
  onlyNewArrivals?: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}
