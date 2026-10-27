import React, { useEffect, useState } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CatalogPage } from './components/storefront/CatalogPage';
import { ContactPage } from './components/storefront/ContactPage';
import { HomePage } from './components/storefront/HomePage';
import { OffersPage } from './components/storefront/OffersPage';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { RequestModal } from './components/storefront/RequestModal';
import { StoreFooter } from './components/storefront/StoreFooter';
import {
  StorefrontView,
  StoreHeader,
} from './components/storefront/StoreHeader';
import {
  createInitialOffers,
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMER_REQUESTS,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_USE_CASE_TAGS,
} from './data/mockStoreData';
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
  StoreSettings,
  UseCaseTag,
} from './types/store';
import {
  ARABIC_FONT_OPTIONS,
  DEFAULT_ARABIC_FONT_ID,
  DEFAULT_THEME_ID,
  DESIGN_THEME_OPTIONS,
  isOfferActive,
} from './utils/storeLogic';

const DEFAULT_FILTERS: FilterState = {
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

const STORAGE_KEY_THEME = 'pixel_store_theme';
const STORAGE_KEY_FONT = 'pixel_store_font';

function getInitialTheme(): DesignThemeId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY_THEME);
    if (saved && DESIGN_THEME_OPTIONS.some((t) => t.id === saved)) {
      return saved as DesignThemeId;
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_THEME_ID;
}

function getInitialFont(): ArabicFontId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY_FONT);
    if (saved && ARABIC_FONT_OPTIONS.some((f) => f.id === saved)) {
      return saved as ArabicFontId;
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_ARABIC_FONT_ID;
}

export default function App() {
  // Arabic is DEFAULT (right-to-left) per Section 4
  const [lang, setLang] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<StorefrontView>('home');

  // Temporary Client Design Playground State (Theme + Arabic Font)
  const [themeId, setThemeId] = useState<DesignThemeId>(getInitialTheme);
  const [fontId, setFontId] = useState<ArabicFontId>(getInitialFont);

  // Centralized Store & Admin State
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
    createInitialOffers(Date.now())
  );
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>(
    INITIAL_CUSTOMER_REQUESTS
  );

  // Catalog Filters, Selected Product, & Request Modal State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    INITIAL_PRODUCTS[0].id
  );
  const [requestModalProduct, setRequestModalProduct] =
    useState<Product | null>(null);

  // Live Clock & Offer Expiration Simulator
  const [realNowMs, setRealNowMs] = useState<number>(() => Date.now());
  const [simulateExpiredOffers, setSimulateExpiredOffers] =
    useState<boolean>(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRealNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Sync HTML dir and lang attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Theme and Arabic Font immediately on documentElement + persist in localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
    try {
      window.localStorage.setItem(STORAGE_KEY_THEME, themeId);
    } catch {
      // Ignore storage write errors
    }
  }, [themeId]);

  useEffect(() => {
    document.documentElement.dataset.arabicFont = fontId;
    try {
      window.localStorage.setItem(STORAGE_KEY_FONT, fontId);
    } catch {
      // Ignore storage write errors
    }
  }, [fontId]);

  const handleResetDesign = () => {
    setThemeId(DEFAULT_THEME_ID);
    setFontId(DEFAULT_ARABIC_FONT_ID);
  };

  // Effective timestamp (adds +6 days when user tests expired-offer simulation)
  const effectiveNowMs = simulateExpiredOffers
    ? realNowMs + 6 * 24 * 60 * 60 * 1000
    : realNowMs;

  const activeOffersCount = offers.filter((o) =>
    isOfferActive(o, effectiveNowMs)
  ).length;

  const pendingRequestsCount = customerRequests.filter(
    (r) => r.status === 'NEW'
  ).length;

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleNavigate = (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string,
    useCaseId?: string
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'shop') {
      const isBestSellersShortcut = subcategoryId === 'BEST_SELLERS';
      const isNewArrivalsShortcut = subcategoryId === 'NEW_ARRIVALS';
      setFilters({
        ...DEFAULT_FILTERS,
        categoryId: categoryId ?? 'ALL',
        onlyBestSellers: isBestSellersShortcut,
        onlyNewArrivals: isNewArrivalsShortcut,
      });
      setCurrentView('shop');
      return;
    }

    if (view === 'category') {
      setFilters({
        ...DEFAULT_FILTERS,
        categoryId: categoryId ?? 'ALL',
        subcategoryId: subcategoryId ?? 'ALL',
        useCaseId: useCaseId ?? 'ALL',
      });
      setCurrentView('category');
      return;
    }

    setCurrentView(view);
  };

  const handleSearchSubmit = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
    if (
      query.trim() !== '' &&
      currentView !== 'shop' &&
      currentView !== 'category'
    ) {
      setCurrentView('shop');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCustomerRequest = (payload: {
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
  };

  // Admin Handlers
  const handleSaveProduct = (prod: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === prod.id);
      return exists
        ? prev.map((p) => (p.id === prod.id ? prod : p))
        : [prod, ...prev];
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleToggleBestSeller = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isBestSeller: !p.isBestSeller } : p
      )
    );
  };

  const handleSaveCategory = (cat: Category) => {
    setCategories((prev) => [...prev, cat]);
  };

  const handleSaveBrand = (brand: Brand) => {
    setBrands((prev) => [...prev, brand]);
  };

  const handleSaveUseCaseTag = (tag: UseCaseTag) => {
    setUseCaseTags((prev) => [...prev, tag]);
  };

  const handleSaveOffer = (offer: Offer) => {
    setOffers((prev) => [
      offer,
      ...prev.filter((o) => o.productId !== offer.productId),
    ]);
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    status: CustomerRequest['status']
  ) => {
    setCustomerRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];

  // Render Admin Dashboard when in 'admin' view
  if (currentView === 'admin') {
    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
        <AdminDashboard
          lang={lang}
          themeId={themeId}
          fontId={fontId}
          products={products}
          categories={categories}
          brands={brands}
          useCaseTags={useCaseTags}
          offers={offers}
          customerRequests={customerRequests}
          settings={settings}
          nowMs={effectiveNowMs}
          onToggleLanguage={handleToggleLanguage}
          onSelectTheme={setThemeId}
          onSelectFont={setFontId}
          onResetDesign={handleResetDesign}
          onBackToStorefront={() => setCurrentView('home')}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleBestSeller={handleToggleBestSeller}
          onSaveCategory={handleSaveCategory}
          onSaveBrand={handleSaveBrand}
          onSaveUseCaseTag={handleSaveUseCaseTag}
          onSaveOffer={handleSaveOffer}
          onDeleteOffer={handleDeleteOffer}
          onUpdateRequestStatus={handleUpdateRequestStatus}
          onUpdateSettings={setSettings}
        />
      </div>
    );
  }

  // Page surface background adapts subtly to active theme
  const pageSurfaceClass =
    themeId === 'contrast'
      ? 'bg-[#ECEAF2] bg-pixel-subtle text-[#111318]'
      : themeId === 'retail'
      ? 'bg-[#F8FAFC] text-[#111318]'
      : 'bg-[#F4F3F7] bg-pixel-subtle text-[#111318]';

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col ${pageSurfaceClass}`}
    >
      <StoreHeader
        lang={lang}
        themeId={themeId}
        fontId={fontId}
        settings={settings}
        categories={categories}
        currentView={currentView}
        activeCategoryId={filters.categoryId}
        searchQuery={filters.searchQuery}
        activeOffersCount={activeOffersCount}
        pendingRequestsCount={pendingRequestsCount}
        onToggleLanguage={handleToggleLanguage}
        onSelectTheme={setThemeId}
        onSelectFont={setFontId}
        onResetDesign={handleResetDesign}
        onNavigate={handleNavigate}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            lang={lang}
            themeId={themeId}
            products={products}
            categories={categories}
            brands={brands}
            offers={offers}
            settings={settings}
            nowMs={effectiveNowMs}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onRequestProduct={(prod) => setRequestModalProduct(prod)}
          />
        )}

        {(currentView === 'shop' || currentView === 'category') && (
          <CatalogPage
            mode={currentView}
            lang={lang}
            themeId={themeId}
            products={products}
            categories={categories}
            brands={brands}
            useCaseTags={useCaseTags}
            offers={offers}
            usdToSypRate={settings.usdToSypRate}
            nowMs={effectiveNowMs}
            filters={filters}
            onUpdateFilters={(next) =>
              setFilters((prev) => ({ ...prev, ...next }))
            }
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onRequestProduct={(prod) => setRequestModalProduct(prod)}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            categories={categories}
            brands={brands}
            useCaseTags={useCaseTags}
            offers={offers}
            usdToSypRate={settings.usdToSypRate}
            nowMs={effectiveNowMs}
            lang={lang}
            themeId={themeId}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onRequestProduct={(prod) => setRequestModalProduct(prod)}
          />
        )}

        {currentView === 'offers' && (
          <OffersPage
            lang={lang}
            products={products}
            brands={brands}
            offers={offers}
            usdToSypRate={settings.usdToSypRate}
            nowMs={effectiveNowMs}
            simulateExpiredOffers={simulateExpiredOffers}
            onToggleSimulateExpired={() =>
              setSimulateExpiredOffers((prev) => !prev)
            }
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onRequestProduct={(prod) => setRequestModalProduct(prod)}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage lang={lang} settings={settings} />
        )}
      </main>

      <StoreFooter
        lang={lang}
        settings={settings}
        categories={categories}
        onNavigate={handleNavigate}
      />

      {/* Centered Product Request Dialog (No Cart / No Checkout) */}
      <RequestModal
        product={requestModalProduct}
        offers={offers}
        usdToSypRate={settings.usdToSypRate}
        nowMs={effectiveNowMs}
        lang={lang}
        onClose={() => setRequestModalProduct(null)}
        onSubmitRequest={handleSubmitCustomerRequest}
      />
    </div>
  );
}
