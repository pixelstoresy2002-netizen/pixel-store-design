import 'server-only';

import type {
  Brand,
  Category,
  HeroSlide,
  Offer,
  Product,
  PromoBanner,
  StoreService,
  StoreSettings,
  UseCaseTag,
} from '@/types/store';

import {
  mapBrand,
  mapCategory,
  mapHomepageBanners,
  mapOffer,
  mapProduct,
  mapStoreService,
  mapStoreSettings,
  mapUseCaseTag,
} from './design-adapters';

export type StorefrontDataMode = 'neon' | 'mock';
export type StorefrontDataStatus = 'ready' | 'unavailable';

export interface StorefrontInitialData {
  mode: StorefrontDataMode;
  status: StorefrontDataStatus;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  heroSlides: HeroSlide[];
  promoBanners: PromoBanner[];
  services: StoreService[];
  settings: StoreSettings | null;
}

const emptyNeonData = (): StorefrontInitialData => ({
  mode: 'neon',
  status: 'unavailable',
  products: [],
  categories: [],
  brands: [],
  useCaseTags: [],
  offers: [],
  heroSlides: [],
  promoBanners: [],
  services: [],
  settings: null,
});

/**
 * Mock data is a deliberate local-only opt-in. The deployed/default path is
 * the Neon-backed catalog, and an unavailable database stays visibly empty.
 */
export async function getStorefrontInitialData(): Promise<StorefrontInitialData | undefined> {
  if (process.env.PIXEL_STORE_DATA_MODE === 'mock') return undefined;

  try {
    // Lazy imports avoid creating a database client for explicit mock mode.
    const [catalog, content] = await Promise.all([
      import('./catalog-queries'),
      import('./content-queries'),
    ]);
    const now = new Date();
    // PrismaPg currently uses a single client here. Keep reads sequential so
    // Neon requests remain deterministic and do not overlap on that client.
    const products = await catalog.getProducts({ limit: 100 });
    const categories = await catalog.getCategoryHierarchy({ limit: 100 });
    const brands = await catalog.getBrands({ limit: 100 });
    const useCaseTags = await catalog.getUseCaseTags({ limit: 100 });
    const offers = await content.getOffers({ limit: 100 }, now);
    const banners = await content.getHomepageBanners({ limit: 100, activeOnly: true });
    const services = await content.getServices({ limit: 100 });
    const settings = await content.getStoreSettings();
    const mappedBanners = mapHomepageBanners(banners);

    return {
      mode: 'neon',
      status: 'ready',
      products: products.items.map(mapProduct),
      categories: categories.map(mapCategory),
      brands: brands.map(mapBrand),
      useCaseTags: useCaseTags.map(mapUseCaseTag),
      offers: offers.items.map((offer) => mapOffer(offer, offers.now)),
      heroSlides: mappedBanners.heroSlides,
      promoBanners: mappedBanners.promoBanners,
      services: services.map(mapStoreService),
      settings: mapStoreSettings(settings),
    };
  } catch {
    return emptyNeonData();
  }
}
