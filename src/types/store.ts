export type Language = 'ar' | 'en';

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
  laptopSpecs?: LaptopSpecs;
  specs: GenericSpec[];
  createdAt: string;
}

export interface Offer {
  id: string;
  productId: string;
  title: BilingualText;
  badgeText: BilingualText;
  offerPriceUsd: number;
  startTime: string;
  endTime: string;
  isExclusive: boolean;
}

export interface Category {
  id: string;
  name: BilingualText;
  description: BilingualText;
  iconKey: string;
  parentId?: string;
  useCaseIds: string[];
  visualKey: string;
}

export interface UseCaseTag {
  id: string;
  name: BilingualText;
  subtitle: BilingualText;
  applicableCategories: string[];
  accentColor: 'purple' | 'pink' | 'coral';
  visualKey: string;
}

export interface Brand {
  id: string;
  name: string;
  country: BilingualText;
  featured: boolean;
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
  createdAt: string;
  status: 'NEW' | 'CONTACTED' | 'COMPLETED';
}

export interface StoreSettings {
  storeName: BilingualText;
  tagline: BilingualText;
  usdToSypRate: number;
  phone: string;
  whatsappNumber: string;
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
