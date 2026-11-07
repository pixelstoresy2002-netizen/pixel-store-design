'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { StorefrontView } from '../components/storefront/StoreHeader';
import {
  createInitialOffers,
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMER_REQUESTS,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_STORE_SETTINGS,
  INITIAL_USE_CASE_TAGS,
} from '../data/mockStoreData';
import {
  ArabicFontId,
  Brand,
  Category,
  CustomerRequest,
  DesignThemeId,
  FilterState,
  Language,
  Offer,
  Product,
  StoreService,
  StoreSettings,
  UseCaseTag,
} from '../types/store';
import {
  DEFAULT_ARABIC_FONT_ID,
  DEFAULT_THEME_ID,
  isOfferActive,
  isPhoneLinkVerified,
} from '../utils/storeLogic';

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  categoryId: 'ALL',
  subcategoryId: 'ALL',
  useCaseId: 'ALL',
  brandIds: [],
  minPriceUsd: 0,
  maxPriceUsd: 5000,
  conditions: [],
  availabilities: [],
  onlyOffers: false,
  onlyBestSellers: false,
  onlyNewArrivals: false,
  sortBy: 'featured',
};

const STORAGE_KEY_SERVICES = 'pixel_store_services_v2';
const STORAGE_KEY_SETTINGS = 'pixel_store_settings_v2';
const STORAGE_KEY_PRODUCTS = 'pixel_store_products_v2';
const STORAGE_KEY_REQUESTS = 'pixel_store_requests_v2';
const STORAGE_KEY_OFFERS = 'pixel_store_offers_v2';
const STORAGE_KEY_CATEGORIES = 'pixel_store_categories_v2';
const STORAGE_KEY_BRANDS = 'pixel_store_brands_v2';
const STORAGE_KEY_USECASES = 'pixel_store_usecases_v2';
const STORAGE_KEY_LANG = 'pixel_store_lang_v2';

// Deterministic anchor timestamp so SSR and initial client hydration match to the millisecond
const SSR_ANCHOR_NOW_MS = 1793793600000;

interface StoreContextValue {
  lang: Language;
  themeId: DesignThemeId;
  fontId: ArabicFontId;
  settings: StoreSettings;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  customerRequests: CustomerRequest[];
  services: StoreService[];
  selectedServiceId: string | 'ALL';
  filters: FilterState;
  selectedProductId: string;
  requestModalProduct: Product | null;
  effectiveNowMs: number;
  activeOffersCount: number;
  pendingRequestsCount: number;
  simulateExpiredOffers: boolean;
  setSelectedServiceId: (id: string | 'ALL') => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilters: (next: Partial<FilterState>) => void;
  resetFilters: () => void;
  setSelectedProductId: (id: string) => void;
  setRequestModalProduct: (product: Product | null) => void;
  setSimulateExpiredOffers: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleLanguage: () => void;
  handleNavigate: (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string,
    useCaseId?: string
  ) => void;
  handleSearchSubmit: (query: string) => void;
  handleSelectProduct: (productId: string) => void;
  handleSubmitCustomerRequest: (payload: {
    product: Product;
    customerName: string;
    phoneNumber: string;
    note: string;
    priceUsd: number;
    priceSyp: number;
  }) => void;
  handleSaveProduct: (prod: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  handleToggleBestSeller: (productId: string) => void;
  handleSaveCategory: (cat: Category) => void;
  handleSaveBrand: (brand: Brand) => void;
  handleSaveUseCaseTag: (tag: UseCaseTag) => void;
  handleSaveOffer: (offer: Offer) => void;
  handleDeleteOffer: (offerId: string) => void;
  handleSaveService: (srv: StoreService) => void;
  handleDeleteService: (serviceId: string) => void;
  handleUpdateRequestStatus: (
    requestId: string,
    status: CustomerRequest['status']
  ) => void;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [lang, setLang] = useState<Language>('ar');
  const themeId: DesignThemeId = DEFAULT_THEME_ID;
  const fontId: ArabicFontId = DEFAULT_ARABIC_FONT_ID;

  const [settings, setSettings] = useState<StoreSettings>(
    INITIAL_STORE_SETTINGS
  );
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [useCaseTags, setUseCaseTags] = useState<UseCaseTag[]>(
    INITIAL_USE_CASE_TAGS
  );
  const [offers, setOffers] = useState<Offer[]>(() =>
    createInitialOffers(SSR_ANCHOR_NOW_MS)
  );
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>(
    INITIAL_CUSTOMER_REQUESTS
  );
  const [services, setServices] = useState<StoreService[]>(INITIAL_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string | 'ALL'>(
    'ALL'
  );

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    INITIAL_PRODUCTS[0].id
  );
  const [requestModalProduct, setRequestModalProduct] =
    useState<Product | null>(null);

  const [realNowMs, setRealNowMs] = useState<number>(SSR_ANCHOR_NOW_MS);
  const [simulateExpiredOffers, setSimulateExpiredOffers] =
    useState<boolean>(false);
  const [hydratedFromStorage, setHydratedFromStorage] = useState(false);

  // Hydrate persisted state from localStorage after mount (zero SSR hydration mismatch)
  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'ar' || savedLang === 'en') {
        setLang(savedLang);
      }
      const savedServices = window.localStorage.getItem(STORAGE_KEY_SERVICES);
      if (savedServices) {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServices(parsed);
        }
      }
      const savedSettings = window.localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && typeof parsed.usdToSypRate === 'number') {
          setSettings({
            ...INITIAL_STORE_SETTINGS,
            ...parsed,
            phone: isPhoneLinkVerified(parsed.phone)
              ? parsed.phone
              : INITIAL_STORE_SETTINGS.phone,
          });
        }
      }
      const savedProducts = window.localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(
            INITIAL_PRODUCTS.map((item) => [item.id, item])
          );
          const mergedProducts = parsed.map((item: Product) => {
            const seed = initialMap.get(item.id);
            if (
              seed?.galleryImages &&
              (!item.galleryImages || item.galleryImages.length < 3)
            ) {
              return {
                ...item,
                galleryImages: seed.galleryImages,
              };
            }
            return item;
          });
          setProducts(mergedProducts);
        }
      }
      const savedRequests = window.localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests);
        if (Array.isArray(parsed)) {
          setCustomerRequests(parsed);
        }
      }
      const savedOffers = window.localStorage.getItem(STORAGE_KEY_OFFERS);
      if (savedOffers) {
        const parsed = JSON.parse(savedOffers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOffers(parsed);
        }
      }
      const savedCategories =
        window.localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
      const savedBrands = window.localStorage.getItem(STORAGE_KEY_BRANDS);
      if (savedBrands) {
        const parsed = JSON.parse(savedBrands);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBrands(parsed);
        }
      }
      const savedUseCases = window.localStorage.getItem(STORAGE_KEY_USECASES);
      if (savedUseCases) {
        const parsed = JSON.parse(savedUseCases);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUseCaseTags(parsed);
        }
      }
    } catch {
      // Ignore storage read errors
    } finally {
      setHydratedFromStorage(true);
    }
  }, []);

  // Tick countdown clock every 1s on client
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRealNowMs((prev) => prev + 1000);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Sync HTML dir and lang attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (hydratedFromStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY_LANG, lang);
      } catch {
        // Ignore storage write errors
      }
    }
  }, [lang, hydratedFromStorage]);

  // Apply locked Theme ("contrast") and Arabic Font ("Cairo") on documentElement
  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.arabicFont = 'Cairo';
  }, [themeId]);

  // Persist services, settings, products, and requests after initial hydration
  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_SERVICES,
        JSON.stringify(services)
      );
    } catch {
      // Ignore
    }
  }, [services, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify(settings)
      );
    } catch {
      // Ignore
    }
  }, [settings, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_PRODUCTS,
        JSON.stringify(products)
      );
    } catch {
      // Ignore
    }
  }, [products, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_REQUESTS,
        JSON.stringify(customerRequests)
      );
    } catch {
      // Ignore
    }
  }, [customerRequests, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(offers));
    } catch {
      // Ignore
    }
  }, [offers, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_CATEGORIES,
        JSON.stringify(categories)
      );
    } catch {
      // Ignore
    }
  }, [categories, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_BRANDS, JSON.stringify(brands));
    } catch {
      // Ignore
    }
  }, [brands, hydratedFromStorage]);

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_USECASES,
        JSON.stringify(useCaseTags)
      );
    } catch {
      // Ignore
    }
  }, [useCaseTags, hydratedFromStorage]);

  const effectiveNowMs = simulateExpiredOffers
    ? realNowMs + 6 * 24 * 60 * 60 * 1000
    : realNowMs;

  const activeOffersCount = useMemo(
    () => offers.filter((o) => isOfferActive(o, effectiveNowMs)).length,
    [offers, effectiveNowMs]
  );

  const pendingRequestsCount = useMemo(
    () => customerRequests.filter((r) => r.status === 'NEW').length,
    [customerRequests]
  );

  const handleToggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const updateFilters = useCallback((next: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleNavigate = useCallback(
    (
      view: StorefrontView,
      categoryId?: string,
      subcategoryId?: string,
      useCaseId?: string
    ) => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (view === 'home') {
        setFilters((prev) =>
          prev.searchQuery ? { ...prev, searchQuery: '' } : prev
        );
        router.push('/');
        return;
      }

      if (view === 'services') {
        setFilters((prev) =>
          prev.searchQuery ? { ...prev, searchQuery: '' } : prev
        );
        const targetService = categoryId ?? 'ALL';
        setSelectedServiceId(targetService);
        if (targetService !== 'ALL') {
          router.push(`/services?service=${encodeURIComponent(targetService)}`);
        } else {
          router.push('/services');
        }
        return;
      }

      if (view === 'shop') {
        const isBestSellersShortcut = subcategoryId === 'BEST_SELLERS';
        const isNewArrivalsShortcut = subcategoryId === 'NEW_ARRIVALS';
        setFilters({
          ...DEFAULT_FILTERS,
          categoryId: categoryId ?? 'ALL',
          onlyBestSellers: isBestSellersShortcut,
          onlyNewArrivals: isNewArrivalsShortcut,
        });
        if (isBestSellersShortcut) {
          router.push('/catalog?bestSellers=1');
        } else if (isNewArrivalsShortcut) {
          router.push('/catalog?newArrivals=1');
        } else if (categoryId && categoryId !== 'ALL') {
          router.push(`/category/${encodeURIComponent(categoryId)}`);
        } else {
          router.push('/catalog');
        }
        return;
      }

      if (view === 'category') {
        const targetCat = categoryId ?? 'ALL';
        const targetSub = subcategoryId ?? 'ALL';
        const targetUseCase = useCaseId ?? 'ALL';
        setFilters({
          ...DEFAULT_FILTERS,
          categoryId: targetCat,
          subcategoryId: targetSub,
          useCaseId: targetUseCase,
        });
        if (targetCat === 'ALL') {
          router.push('/catalog');
        } else if (targetSub !== 'ALL') {
          const qs =
            targetUseCase !== 'ALL'
              ? `?useCase=${encodeURIComponent(targetUseCase)}`
              : '';
          router.push(
            `/category/${encodeURIComponent(targetCat)}/${encodeURIComponent(targetSub)}${qs}`
          );
        } else {
          const qs =
            targetUseCase !== 'ALL'
              ? `?useCase=${encodeURIComponent(targetUseCase)}`
              : '';
          router.push(`/category/${encodeURIComponent(targetCat)}${qs}`);
        }
        return;
      }

      if (view === 'offers') {
        setFilters((prev) =>
          prev.searchQuery ? { ...prev, searchQuery: '' } : prev
        );
        router.push('/offers');
        return;
      }

      if (view === 'contact') {
        setFilters((prev) =>
          prev.searchQuery ? { ...prev, searchQuery: '' } : prev
        );
        router.push('/contact');
        return;
      }
    },
    [router]
  );

  const handleSearchSubmit = useCallback(
    (query: string) => {
      setFilters((prev) => ({
        ...prev,
        searchQuery: query,
      }));
      if (
        query.trim() !== '' &&
        pathname !== '/catalog' &&
        !pathname.startsWith('/category')
      ) {
        router.push('/catalog');
      }
    },
    [pathname, router]
  );

  const handleSelectProduct = useCallback(
    (productId: string) => {
      setFilters((prev) =>
        prev.searchQuery ? { ...prev, searchQuery: '' } : prev
      );
      setSelectedProductId(productId);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      router.push(`/products/${encodeURIComponent(productId)}`);
    },
    [router]
  );

  const handleSubmitCustomerRequest = useCallback(
    (payload: {
      product: Product;
      customerName: string;
      phoneNumber: string;
      note: string;
      priceUsd: number;
      priceSyp: number;
    }) => {
      const newReq: CustomerRequest = {
        id: `req-${Date.now()}`,
        productId: payload.product.id,
        productName: payload.product.name,
        productSku: payload.product.sku,
        priceUsdAtRequest: payload.priceUsd,
        priceSypAtRequest: payload.priceSyp,
        customerName: payload.customerName,
        phoneNumber: payload.phoneNumber,
        note: payload.note,
        createdAt: new Date().toISOString(),
        status: 'NEW',
      };
      setCustomerRequests((prev) => [newReq, ...prev]);
    },
    []
  );

  const handleSaveProduct = useCallback((prod: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === prod.id);
      return exists
        ? prev.map((p) => (p.id === prod.id ? prod : p))
        : [prod, ...prev];
    });
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const handleToggleBestSeller = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isBestSeller: !p.isBestSeller } : p
      )
    );
  }, []);

  const handleSaveCategory = useCallback((cat: Category) => {
    setCategories((prev) => [...prev, cat]);
  }, []);

  const handleSaveBrand = useCallback((brand: Brand) => {
    setBrands((prev) => [...prev, brand]);
  }, []);

  const handleSaveUseCaseTag = useCallback((tag: UseCaseTag) => {
    setUseCaseTags((prev) => [...prev, tag]);
  }, []);

  const handleSaveOffer = useCallback((offer: Offer) => {
    setOffers((prev) => [
      offer,
      ...prev.filter((o) => o.productId !== offer.productId),
    ]);
  }, []);

  const handleDeleteOffer = useCallback((offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }, []);

  const handleSaveService = useCallback((srv: StoreService) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === srv.id);
      return exists
        ? prev.map((s) => (s.id === srv.id ? srv : s))
        : [srv, ...prev];
    });
  }, []);

  const handleDeleteService = useCallback((serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  }, []);

  const handleUpdateRequestStatus = useCallback(
    (requestId: string, status: CustomerRequest['status']) => {
      setCustomerRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
    },
    []
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      lang,
      themeId,
      fontId,
      settings,
      products,
      categories,
      brands,
      useCaseTags,
      offers,
      customerRequests,
      services,
      selectedServiceId,
      filters,
      selectedProductId,
      requestModalProduct,
      effectiveNowMs,
      activeOffersCount,
      pendingRequestsCount,
      simulateExpiredOffers,
      setSelectedServiceId,
      setFilters,
      updateFilters,
      resetFilters,
      setSelectedProductId,
      setRequestModalProduct,
      setSimulateExpiredOffers,
      handleToggleLanguage,
      handleNavigate,
      handleSearchSubmit,
      handleSelectProduct,
      handleSubmitCustomerRequest,
      handleSaveProduct,
      handleDeleteProduct,
      handleToggleBestSeller,
      handleSaveCategory,
      handleSaveBrand,
      handleSaveUseCaseTag,
      handleSaveOffer,
      handleDeleteOffer,
      handleSaveService,
      handleDeleteService,
      handleUpdateRequestStatus,
      setSettings,
    }),
    [
      lang,
      themeId,
      fontId,
      settings,
      products,
      categories,
      brands,
      useCaseTags,
      offers,
      customerRequests,
      services,
      selectedServiceId,
      filters,
      selectedProductId,
      requestModalProduct,
      effectiveNowMs,
      activeOffersCount,
      pendingRequestsCount,
      simulateExpiredOffers,
      updateFilters,
      resetFilters,
      handleToggleLanguage,
      handleNavigate,
      handleSearchSubmit,
      handleSelectProduct,
      handleSubmitCustomerRequest,
      handleSaveProduct,
      handleDeleteProduct,
      handleToggleBestSeller,
      handleSaveCategory,
      handleSaveBrand,
      handleSaveUseCaseTag,
      handleSaveOffer,
      handleDeleteOffer,
      handleSaveService,
      handleDeleteService,
      handleUpdateRequestStatus,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
