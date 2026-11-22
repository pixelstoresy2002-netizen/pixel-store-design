'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Flame,
  FolderTree,
  Globe,
  LayoutDashboard,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Wrench,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Images,
  LogOut,
} from 'lucide-react';
import {
  ArabicFontId,
  AvailabilityStatus,
  Brand,
  Category,
  CustomerRequest,
  DesignThemeId,
  HeroSlide,
  Language,
  Offer,
  OfferTemporalStatus,
  Product,
  ProductCondition,
  PromoBanner,
  StoreService,
  StoreSettings,
  UseCaseTag,
} from '../../types/store';
import {
  calculateDiscountPercent,
  convertUsdToSyp,
  formatSyp,
  formatUsd,
  getOfferTemporalStatus,
  getServiceGalleryImages,
  isExternalChannelVerified,
  isOfferActive,
  isPhoneLinkVerified,
  isWhatsappLinkVerified,
  VISUAL_KEY_PRESETS,
} from '../../utils/storeLogic';
import {
  AdminOffersQuery,
  AdminProductsQuery,
  AdminRequestsQuery,
  DEFAULT_ADMIN_OFFERS_QUERY,
  DEFAULT_ADMIN_PRODUCTS_QUERY,
  DEFAULT_ADMIN_REQUESTS_QUERY,
  parseAdminProductsQuery,
  queryAdminOffers,
  queryAdminProducts,
  queryAdminRequests,
  serializeAdminProductsQuery,
} from '../../utils/adminQueryContract';
import type {
  AdminCustomerRequestDTO,
  BackendCustomerRequestStatus,
} from '../../lib/data/admin-contract';
import { CountdownBadge } from '../storefront/CountdownBadge';
import { PixelLogo } from '../visuals/PixelLogo';
import { ProductVisual } from '../visuals/ProductVisual';
import { AdminProductEditor } from './AdminProductEditor';
import { AdminBannersManager } from './AdminBannersManager';
import {
  AdminBrandsPanel,
  AdminCategoriesPanel,
  AdminUseCasesPanel,
} from './AdminTaxonomyPanels';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'banners'
  | 'offers'
  | 'services'
  | 'categories'
  | 'brands'
  | 'usecases'
  | 'requests'
  | 'analytics'
  | 'settings';

function formatSypSnapshot(snapshot: string, lang: Language): string {
  try {
    const amount = BigInt(snapshot);
    return `${new Intl.NumberFormat('en-US').format(amount)} ${lang === 'ar' ? 'ل.س' : 'SYP'}`;
  } catch {
    return `${snapshot} ${lang === 'ar' ? 'ل.س' : 'SYP'}`;
  }
}

interface AdminDashboardProps {
  lang: Language;
  themeId: DesignThemeId;
  fontId: ArabicFontId;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  heroSlides?: HeroSlide[];
  promoBanners?: PromoBanner[];
  customerRequests: CustomerRequest[];
  isMockMode: boolean;
  services: StoreService[];
  settings: StoreSettings;
  nowMs: number;
  onToggleLanguage: () => void;
  onBackToStorefront: () => void;
  onSignOut: () => void;
  isSigningOut: boolean;
  signOutError: boolean;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleBestSeller: (productId: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onSaveBrand: (brand: Brand) => void;
  onDeleteBrand?: (brandId: string) => void;
  onSaveUseCaseTag: (tag: UseCaseTag) => void;
  onDeleteUseCaseTag?: (tagId: string) => void;
  onSaveOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: string) => void;
  onSaveHeroSlide?: (slide: HeroSlide) => void;
  onReorderHeroSlides?: (slides: HeroSlide[]) => void;
  onDeleteHeroSlide?: (slideId: string) => void;
  onSavePromoBanner?: (banner: PromoBanner) => void;
  onReorderPromoBanners?: (banners: PromoBanner[]) => void;
  onSaveService: (service: StoreService) => void;
  onDeleteService: (serviceId: string) => void;
  onUpdateRequestStatus: (
    requestId: string,
    status: CustomerRequest['status'],
    adminNote?: string
  ) => void;
  onDeleteCustomerRequest?: (requestId: string) => void;
  onUpdateSettings: (nextSettings: StoreSettings) => void;
  onResetDemoData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  products,
  categories,
  brands,
  useCaseTags,
  offers,
  heroSlides = [],
  promoBanners = [],
  customerRequests,
  isMockMode,
  services,
  settings,
  nowMs,
  onToggleLanguage,
  onBackToStorefront,
  onSignOut,
  isSigningOut,
  signOutError,
  onSaveProduct,
  onDeleteProduct,
  onToggleBestSeller,
  onSaveCategory,
  onDeleteCategory = () => {},
  onSaveBrand,
  onDeleteBrand = () => {},
  onSaveUseCaseTag,
  onDeleteUseCaseTag = () => {},
  onSaveOffer,
  onDeleteOffer,
  onSaveHeroSlide = () => {},
  onReorderHeroSlides = () => {},
  onDeleteHeroSlide = () => {},
  onSavePromoBanner = () => {},
  onReorderPromoBanners = () => {},
  onSaveService,
  onDeleteService,
  onUpdateRequestStatus,
  onDeleteCustomerRequest = () => {},
  onUpdateSettings,
  onResetDemoData,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Product Editor & Query State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);
  const [productsQuery, setProductsQuery] = useState<AdminProductsQuery>(
    DEFAULT_ADMIN_PRODUCTS_QUERY
  );

  // Offers Editor & Query State
  const [offersQuery, setOffersQuery] = useState<AdminOffersQuery>(
    DEFAULT_ADMIN_OFFERS_QUERY
  );
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerProductId, setOfferProductId] = useState(products[0]?.id ?? '');
  const [offerTitleAr, setOfferTitleAr] = useState('عرض خاص لنهاية الأسبوع');
  const [offerTitleEn, setOfferTitleEn] = useState('Weekend Special Deal');
  const [offerBadgeAr, setOfferBadgeAr] = useState('عرض حصري');
  const [offerBadgeEn, setOfferBadgeEn] = useState('Exclusive Deal');
  const [offerPriceUsd, setOfferPriceUsd] = useState(850);
  const [offerStartIso, setOfferStartIso] = useState(() =>
    new Date(nowMs - 3600 * 1000).toISOString().slice(0, 16)
  );
  const [offerEndIso, setOfferEndIso] = useState(() =>
    new Date(nowMs + 48 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [offerExclusive, setOfferExclusive] = useState(true);

  // Customer Requests Query State
  const [requestsQuery, setRequestsQuery] = useState<AdminRequestsQuery>(
    DEFAULT_ADMIN_REQUESTS_QUERY
  );
  const [editingRequestNoteId, setEditingRequestNoteId] = useState<string | null>(null);
  const [requestAdminNoteDraft, setRequestAdminNoteDraft] = useState('');
  const [liveRequestItems, setLiveRequestItems] = useState<AdminCustomerRequestDTO[]>([]);
  const [liveRequestPagination, setLiveRequestPagination] = useState({
    page: 1,
    limit: DEFAULT_ADMIN_REQUESTS_QUERY.limit,
    total: 0,
    totalPages: 1,
  });
  const [liveRequestsLoading, setLiveRequestsLoading] = useState(false);
  const [liveRequestsError, setLiveRequestsError] = useState<string | null>(null);
  const [liveRequestsRetry, setLiveRequestsRetry] = useState(0);
  const liveRequestSequence = useRef(0);
  const [liveRequestSaving, setLiveRequestSaving] = useState<Record<string, boolean>>({});
  const [liveRequestFailures, setLiveRequestFailures] = useState<Record<string, {
    status?: BackendCustomerRequestStatus;
    adminNotes?: string | null;
  }>>({});
  const liveRequestMutationSequence = useRef(new Map<string, number>());

  // Service Editor State
  const [editingService, setEditingService] = useState<StoreService | null>(null);

  // Store Settings Local Form State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Initialize tab & product query state from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as AdminTab | null;
    if (
      tabParam &&
      [
        'overview',
        'products',
        'banners',
        'offers',
        'services',
        'categories',
        'brands',
        'usecases',
        'requests',
        'analytics',
        'settings',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
    const parsedProdQuery = parseAdminProductsQuery(params);
    setProductsQuery(parsedProdQuery);
  }, []);

  // Sync URL query params when activeTab or productsQuery changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (activeTab !== 'overview') {
      params.set('tab', activeTab);
    }
    if (activeTab === 'products') {
      const prodParams = new URLSearchParams(
        serializeAdminProductsQuery(productsQuery)
      );
      prodParams.forEach((val, key) => params.set(key, val));
    }
    const qs = params.toString();
    const nextUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', nextUrl);
  }, [activeTab, productsQuery]);

  const showToast = (msgAr: string, msgEn: string) => {
    setSavedToast(lang === 'ar' ? msgAr : msgEn);
    setTimeout(() => setSavedToast(null), 3200);
  };

  const openProductEditor = (prod?: Product) => {
    if (prod) {
      setIsCreatingProduct(false);
      setEditingProduct({ ...prod });
    } else {
      const fresh: Product = {
        id: `prod-${Date.now()}`,
        sku: `PXL-NEW-${Math.floor(100 + Math.random() * 900)}`,
        name: { ar: '', en: '' },
        description: { ar: '', en: '' },
        categoryId: 'laptops',
        subcategoryId: 'new-laptops',
        brandId: brands[0]?.id ?? 'asus',
        useCaseIds: ['gaming'],
        priceUsd: 999,
        condition: 'NEW',
        availability: 'IN_STOCK',
        primaryImage: 'laptop-rog-front',
        secondaryImage: 'laptop-rog-side',
        galleryImages: [
          'laptop-rog-front',
          'laptop-rog-side',
          'laptop-rog-ports',
          'laptop-rog-cooling',
          'laptop-rog-kit',
        ],
        isBestSeller: false,
        isNewArrival: true,
        isFeatured: false,
        isActive: true,
        laptopSpecs: {
          processor: 'Intel Core i7-13650HX',
          memory: '16GB DDR5',
          storage: '1TB NVMe SSD',
          display: '15.6" FHD 144Hz IPS',
        },
        specs: [
          {
            label: { ar: 'الكفالة', en: 'Warranty' },
            value: { ar: 'سنة كاملة', en: '1 Year' },
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIsCreatingProduct(true);
      setEditingProduct(fresh);
    }
  };

  const closeProductEditor = () => {
    setIsCreatingProduct(false);
    setEditingProduct(null);
  };

  // Start editing an existing offer
  const startEditOffer = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setOfferProductId(offer.productId);
    setOfferTitleAr(offer.title.ar);
    setOfferTitleEn(offer.title.en);
    setOfferBadgeAr(offer.badgeText.ar);
    setOfferBadgeEn(offer.badgeText.en);
    setOfferPriceUsd(offer.offerPriceUsd);
    setOfferStartIso(new Date(offer.startTime).toISOString().slice(0, 16));
    setOfferEndIso(new Date(offer.endTime).toISOString().slice(0, 16));
    setOfferExclusive(offer.isExclusive);
  };

  const resetOfferForm = () => {
    setEditingOfferId(null);
    const firstProd = products[0];
    setOfferProductId(firstProd?.id ?? '');
    setOfferTitleAr('عرض خاص لنهاية الأسبوع');
    setOfferTitleEn('Weekend Special Deal');
    setOfferBadgeAr('عرض حصري');
    setOfferBadgeEn('Exclusive Deal');
    setOfferPriceUsd(firstProd ? Math.round(firstProd.priceUsd * 0.88) : 850);
    setOfferStartIso(new Date(nowMs - 60000).toISOString().slice(0, 16));
    setOfferEndIso(new Date(nowMs + 48 * 3600 * 1000).toISOString().slice(0, 16));
    setOfferExclusive(true);
  };

  // Queried & paginated results
  const productsResult = useMemo(
    () => queryAdminProducts(products, offers, productsQuery, nowMs),
    [products, offers, productsQuery, nowMs]
  );

  const offersResult = useMemo(
    () =>
      queryAdminOffers(
        offers,
        products,
        offersQuery,
        nowMs,
        settings.usdToSypRate
      ),
    [offers, products, offersQuery, nowMs, settings.usdToSypRate]
  );

  const requestsResult = useMemo(
    () => queryAdminRequests(customerRequests, requestsQuery),
    [customerRequests, requestsQuery]
  );

  useEffect(() => {
    if (isMockMode || (activeTab !== 'overview' && activeTab !== 'requests')) return;

    const sequence = ++liveRequestSequence.current;
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(requestsQuery.page),
      limit: String(requestsQuery.limit),
    });
    if (requestsQuery.q.trim()) params.set('q', requestsQuery.q.trim());
    if (requestsQuery.status !== 'ALL') params.set('status', requestsQuery.status);

    setLiveRequestsLoading(true);
    setLiveRequestsError(null);
    fetch(`/api/admin/customer-requests?${params.toString()}`, {
      headers: { accept: 'application/json' },
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as {
          data?: {
            items?: AdminCustomerRequestDTO[];
            pagination?: { page: number; limit: number; total: number; totalPages: number };
          };
          error?: { message?: string };
        };
        if (!response.ok || !Array.isArray(body.data?.items) || !body.data.pagination) {
          throw new Error(body.error?.message || 'Unable to load customer requests.');
        }
        return { items: body.data.items, pagination: body.data.pagination };
      })
      .then((data) => {
        if (liveRequestSequence.current !== sequence) return;
        setLiveRequestItems(data.items);
        setLiveRequestPagination(data.pagination);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || liveRequestSequence.current !== sequence) return;
        setLiveRequestsError(
          error instanceof Error ? error.message : 'Unable to load customer requests.',
        );
        setLiveRequestItems([]);
      })
      .finally(() => {
        if (liveRequestSequence.current === sequence && !controller.signal.aborted) {
          setLiveRequestsLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    activeTab,
    isMockMode,
    liveRequestsRetry,
    requestsQuery.limit,
    requestsQuery.page,
    requestsQuery.q,
    requestsQuery.status,
  ]);

  const inboxRequests = useMemo(() => {
    if (!isMockMode) {
      return liveRequestItems.map((request) => ({
        ...request,
        adminNote: request.adminNotes,
        phoneNumber: request.customerPhone,
        priceUsdAtRequest: request.usdPriceCentsSnapshot / 100,
        priceSypAtRequest: request.sypPriceSnapshot,
      }));
    }

    return requestsResult.items.map((request) => ({
      id: request.id,
      customerName: request.customerName,
      phoneNumber: request.phoneNumber,
      note: request.note,
      adminNote: request.adminNote ?? null,
      productName: request.productName,
      productSku: request.productSku,
      priceUsdAtRequest: request.priceUsdAtRequest,
      priceSypAtRequest: String(request.priceSypAtRequest),
      status: request.status as BackendCustomerRequestStatus,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt ?? request.createdAt,
    }));
  }, [isMockMode, liveRequestItems, requestsResult.items]);

  const inboxPagination = isMockMode ? requestsResult : liveRequestPagination;

  const saveLiveRequest = async (
    requestId: string,
    patch: { status?: BackendCustomerRequestStatus; adminNotes?: string | null },
  ) => {
    const request = liveRequestItems.find((item) => item.id === requestId);
    if (!request || liveRequestSaving[requestId]) return false;

    const sequence = (liveRequestMutationSequence.current.get(requestId) ?? 0) + 1;
    liveRequestMutationSequence.current.set(requestId, sequence);
    setLiveRequestSaving((current) => ({ ...current, [requestId]: true }));
    setLiveRequestFailures((current) => {
      const remaining = { ...current };
      delete remaining[requestId];
      return remaining;
    });

    try {
      const response = await fetch('/api/admin/customer-requests', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id: requestId, expectedUpdatedAt: request.updatedAt, ...patch }),
      });
      const body = await response.json() as {
        data?: { item?: AdminCustomerRequestDTO };
      };
      if (!response.ok || !body.data?.item) throw new Error('Customer request could not be updated.');
      if (liveRequestMutationSequence.current.get(requestId) !== sequence) return false;

      setLiveRequestItems((items) => items.map((item) => item.id === requestId ? body.data!.item! : item));
      liveRequestSequence.current += 1;
      setLiveRequestsRetry((value) => value + 1);
      showToast('تم حفظ تحديث الطلب', 'Request update saved');
      return true;
    } catch {
      if (liveRequestMutationSequence.current.get(requestId) === sequence) {
        setLiveRequestFailures((current) => ({ ...current, [requestId]: patch }));
        setLiveRequestsRetry((value) => value + 1);
      }
      return false;
    } finally {
      if (liveRequestMutationSequence.current.get(requestId) === sequence) {
        setLiveRequestSaving((current) => ({ ...current, [requestId]: false }));
      }
    }
  };

  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const selectedFilterSubcategories = useMemo(
    () =>
      productsQuery.categoryId === 'ALL'
        ? categories.filter((c) => Boolean(c.parentId))
        : categories.filter((c) => c.parentId === productsQuery.categoryId),
    [categories, productsQuery.categoryId]
  );

  const hasActiveProductFilters =
    productsQuery.q !== '' ||
    productsQuery.categoryId !== 'ALL' ||
    productsQuery.subcategoryId !== 'ALL' ||
    productsQuery.brandId !== 'ALL' ||
    productsQuery.condition !== 'ALL' ||
    productsQuery.availability !== 'ALL' ||
    productsQuery.useCaseId !== 'ALL' ||
    productsQuery.bestSeller !== 'ALL' ||
    productsQuery.newArrival !== 'ALL' ||
    productsQuery.hasOffer !== 'ALL';

  const navItems: {
    id: AdminTab;
    label: { ar: string; en: string };
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'overview',
      label: { ar: 'نظرة عامة', en: 'Overview' },
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'products',
      label: { ar: 'المنتجات والمحرر', en: 'Products & Editor' },
      icon: <Boxes className="w-4 h-4" />,
      badge: products.length,
    },
    {
      id: 'banners',
      label: { ar: 'البانرات والسلايدر الرئيسي', en: 'Hero & Promo Banners' },
      icon: <Presentation className="w-4 h-4" />,
      badge: heroSlides.length + promoBanners.length,
    },
    {
      id: 'offers',
      label: { ar: 'إدارة العروض والمؤقت', en: 'Timed Offers' },
      icon: <Flame className="w-4 h-4" />,
      badge: offers.filter((o) => isOfferActive(o, nowMs)).length,
    },
    {
      id: 'services',
      label: { ar: 'إدارة الخدمات (Services)', en: 'Services Management' },
      icon: <Wrench className="w-4 h-4" />,
      badge: services.length,
    },
    {
      id: 'categories',
      label: { ar: 'الأقسام والفروع', en: 'Categories & Tree' },
      icon: <FolderTree className="w-4 h-4" />,
      badge: categories.length,
    },
    {
      id: 'brands',
      label: { ar: 'العلامات التجارية', en: 'Brands' },
      icon: <Tag className="w-4 h-4" />,
      badge: brands.length,
    },
    {
      id: 'usecases',
      label: { ar: 'وسوم الاستخدام (Use Cases)', en: 'Use-Case Tags' },
      icon: <Sparkles className="w-4 h-4" />,
      badge: useCaseTags.length,
    },
    {
      id: 'requests',
      label: { ar: 'طلبات الزبائن (واتساب)', en: 'Customer Requests' },
      icon: <MessageCircle className="w-4 h-4" />,
      badge: isMockMode ? customerRequests.filter((r) => r.status === 'NEW').length : undefined,
    },
    {
      id: 'analytics',
      label: { ar: 'إحصائيات التفاعل', en: 'Basic Analytics' },
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: { ar: 'إعدادات المتجر وسعر الصرف', en: 'Store Settings & Rate' },
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const selectedOfferProduct = products.find((p) => p.id === offerProductId);
  const previewDiscountPct = selectedOfferProduct
    ? calculateDiscountPercent(selectedOfferProduct.priceUsd, offerPriceUsd)
    : 0;

  return (
    <div
      data-testid="admin-dashboard"
      className="min-h-screen bg-[#F4F3F7] flex flex-col"
    >
      {/* Admin Top Header */}
      <header className="bg-[#111318] text-white border-b border-white/10 px-3 sm:px-4 lg:px-6 min-h-14 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-wrap">
          <PixelLogo variant="dark" size="sm" />
          <span className="hidden sm:inline-block text-xs font-mono-num px-2 py-0.5 rounded bg-[#8E4DEB]/25 border border-[#8E4DEB]/40 text-white">
            {lang === 'ar' ? 'لوحة الإدارة' : 'ADMIN CONSOLE'}
          </span>
          <span
            data-testid="admin-demo-notice"
            className="text-[11px] px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-400/35 text-amber-200 font-semibold"
          >
            {lang === 'ar'
              ? 'مساحة إدارة محمية — الوصول للحسابات المعتمدة فقط'
              : 'PROTECTED ADMIN WORKSPACE — Authorized accounts only'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-semibold cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#8E4DEB]" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>{isSigningOut ? (lang === 'ar' ? 'جارٍ الخروج…' : 'Signing out…') : (lang === 'ar' ? 'تسجيل الخروج' : 'Sign out')}</span>
          </button>

          <button
            type="button"
            data-testid="exit-admin-button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {lang === 'ar' ? 'معاينة المتجر' : 'Storefront'}
            </span>
          </button>
        </div>
        {signOutError && (
          <p role="alert" className="basis-full text-[11px] font-semibold text-rose-200">
            {lang === 'ar' ? 'تعذر تسجيل الخروج حالياً. حاول مرة أخرى.' : 'Sign-out could not be completed. Please try again.'}
          </p>
        )}
      </header>

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-5 end-5 z-50 bg-[#111318] text-white px-4 py-3 rounded-lg border border-[#8E4DEB] shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Sidebar Navigation (3 Columns) */}
        <aside className="lg:col-span-3 min-w-0 bg-white rounded-xl border border-slate-200/90 p-2.5 sm:p-3 space-y-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`admin-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  closeProductEditor();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#111318] text-white'
                    : 'text-slate-700 hover:bg-[#F4F3F7]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={active ? 'text-[#8E4DEB]' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label[lang]}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`font-mono-num text-[11px] px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-[#8E4DEB] text-white'
                        : 'bg-[#F4F3F7] text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Panel (9 Columns) */}
        <main className="lg:col-span-9 min-w-0 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg font-extrabold text-[#111318]">
                    {lang === 'ar'
                      ? 'ملخص إدارة متجر بيكسل (Dashboard Overview)'
                      : 'Pixel Store Operations Overview'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'متابعة فورية لطلبات الزبائن عبر واتساب، العروض الموقوتة، البانرات الترويجية، وسعر الصرف اليومي'
                      : 'Monitor incoming WhatsApp product requests, active timed deals, hero banners, and catalog inventory'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('products');
                      openProductEditor();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add Product'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('banners')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    <Presentation className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تعديل البانرات' : 'Manage Banners'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Key Operational Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200/90 p-4">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar' ? 'إجمالي المنتجات' : 'Total Catalog Products'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#111318] mt-1">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {products.filter((p) => p.condition === 'NEW').length} NEW ·{' '}
                    {products.filter((p) => p.condition === 'USED').length} USED
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar' ? 'العروض النشطة حالياً' : 'Active Timed Offers'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#D66C9D] mt-1">
                    {offers.filter((o) => isOfferActive(o, nowMs)).length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {lang === 'ar'
                      ? `من أصل ${offers.length} عرض مسجل`
                      : `Out of ${offers.length} total offers`}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'طلبات الزبائن عبر واتساب'
                      : 'Customer Product Requests'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#8E4DEB] mt-1">
                    {isMockMode ? customerRequests.length : liveRequestPagination.total}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {isMockMode
                      ? `${customerRequests.filter((r) => r.status === 'NEW').length} ${lang === 'ar' ? 'بانتظار المتابعة' : 'awaiting WhatsApp follow-up'}`
                      : lang === 'ar'
                      ? 'صندوق Neon متصل'
                      : 'Connected Neon inbox'}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'سعر الصرف المعتمد (USD → SYP)'
                      : 'Global Exchange Rate'}
                  </div>
                  <div
                    className="font-mono-num text-xl font-extrabold text-[#EF875D] mt-1"
                    dir="ltr"
                  >
                    {settings.usdToSypRate.toLocaleString('en-US')} SYP
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="text-[11px] font-bold text-[#8E4DEB] hover:underline mt-1 cursor-pointer"
                  >
                    {lang === 'ar' ? 'تعديل سعر الصرف' : 'Update Rate'}
                  </button>
                </div>
              </div>

              {/* Recent Customer Product Requests Table */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#111318]">
                    {lang === 'ar'
                      ? 'أحدث طلبات الزبائن (للمتابعة عبر واتساب)'
                      : 'Recent Customer Product Requests'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('requests')}
                    className="text-xs font-bold text-[#8E4DEB] hover:underline cursor-pointer"
                  >
                    {lang === 'ar' ? 'عرض جميع الطلبات' : 'View All Requests'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 px-3 text-start">
                          {lang === 'ar' ? 'الزبون' : 'Customer'}
                        </th>
                        <th className="py-2.5 px-3 text-start">
                          {lang === 'ar' ? 'المنتج المطلوب' : 'Product'}
                        </th>
                        <th className="py-2.5 px-3 text-start">
                          {lang === 'ar' ? 'السعر عند الطلب' : 'Price'}
                        </th>
                        <th className="py-2.5 px-3 text-start">
                          {lang === 'ar' ? 'الحالة' : 'Status'}
                        </th>
                        <th className="py-2.5 px-3 text-end">
                          {lang === 'ar' ? 'إجراء واتساب' : 'WhatsApp Action'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inboxRequests.slice(0, 4).map((req) => {
                        const phoneVerified = isMockMode
                          ? isPhoneLinkVerified(req.phoneNumber)
                          : Boolean(req.phoneNumber.trim());
                        return (
                          <tr key={req.id}>
                            <td className="py-3 px-3">
                              <div className="font-bold text-[#111318]">
                                {req.customerName}
                              </div>
                              <div
                                className="font-mono-num text-[11px] text-slate-500 flex items-center gap-1"
                                dir="ltr"
                              >
                                <span>{req.phoneNumber}</span>
                                {isMockMode && !phoneVerified && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-sans">
                                    Demo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-[#111318] max-w-xs truncate">
                                {req.productName[lang]}
                              </div>
                              {req.note && (
                                <div className="text-[11px] text-slate-500 truncate max-w-xs">
                                  “{req.note}”
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono-num">
                              <div className="font-bold text-[#111318]" dir="ltr">
                                {formatUsd(req.priceUsdAtRequest)}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {formatSypSnapshot(req.priceSypAtRequest, lang)}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`font-bold ${
                                  req.status === 'NEW'
                                    ? 'text-amber-600'
                                    : req.status === 'CONTACTED'
                                    ? 'text-[#8E4DEB]'
                                    : 'text-emerald-600'
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-end">
                              {phoneVerified ? (
                                <a
                                  href={`https://wa.me/${req.phoneNumber.replace(
                                    /\D/g,
                                    ''
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>
                                    {lang === 'ar' ? 'مراسلة واتساب' : 'WhatsApp'}
                                  </span>
                                </a>
                              ) : (
                                <span
                                  title={
                                    isAr
                                      ? 'رقم تجريبي للعرض — أدخل رقماً حقيقياً لتفعيل المراسلة'
                                      : 'Demo placeholder phone number'
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-bold cursor-not-allowed"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>
                                    {lang === 'ar' ? 'رقم تجريبي' : 'Demo Number'}
                                  </span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS LIST & PRODUCT EDITOR */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {editingProduct ? (
                <AdminProductEditor
                  product={editingProduct}
                  isNew={isCreatingProduct}
                  categories={categories}
                  brands={brands}
                  useCaseTags={useCaseTags}
                  offers={offers}
                  usdToSypRate={settings.usdToSypRate}
                  nowMs={nowMs}
                  lang={lang}
                  onCancel={closeProductEditor}
                  onManageOfferForProduct={(prodId) => {
                    closeProductEditor();
                    setActiveTab('offers');
                    setOfferProductId(prodId);
                  }}
                  onSave={(savedProd) => {
                    onSaveProduct(savedProd);
                    closeProductEditor();
                    showToast(
                      'تم حفظ بيانات المنتج ومعرض الصور بنجاح',
                      'Product and 5-image gallery saved successfully'
                    );
                  }}
                />
              ) : (
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                  {/* Top Header & New Product Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-base font-extrabold text-[#111318]">
                        {lang === 'ar'
                          ? 'إدارة المنتجات (Products Catalog & Filter Engine)'
                          : 'Products Management & Query Engine'}
                      </h1>
                      <p className="text-xs text-slate-500">
                        {lang === 'ar'
                          ? `عرض ${productsResult.items.length} من أصل ${productsResult.total} منتج مطابق (إجمالي الكتالوج: ${products.length})`
                          : `Showing ${productsResult.items.length} of ${productsResult.total} matching products (Total catalog: ${products.length})`}
                      </p>
                    </div>
                    <button
                      type="button"
                      data-testid="admin-new-product-button"
                      onClick={() => openProductEditor()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {lang === 'ar' ? 'إضافة منتج جديد' : 'New Product'}
                      </span>
                    </button>
                  </div>

                  {/* Comprehensive Filter, Search & Sort Bar */}
                  <div
                    data-testid="admin-products-filter-bar"
                    className="p-4 rounded-xl bg-[#F4F3F7] border border-slate-200/80 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      {/* Search input */}
                      <div className="md:col-span-5 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          data-testid="admin-products-search-input"
                          value={productsQuery.q}
                          onChange={(e) =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              q: e.target.value,
                              page: 1,
                            }))
                          }
                          placeholder={
                            isAr
                              ? 'ابحث بالاسم (عربي/EN)، كود SKU، المعالج، أو المواصفات...'
                              : 'Search title (AR/EN), SKU, processor, specs...'
                          }
                          className="w-full ps-9 pe-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#8E4DEB] focus:outline-none"
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="md:col-span-3">
                        <select
                          data-testid="admin-products-category-filter"
                          value={productsQuery.categoryId}
                          onChange={(e) =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              categoryId: e.target.value,
                              subcategoryId: 'ALL',
                              page: 1,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          <option value="ALL">
                            {isAr ? 'كل الأقسام الرئيسية' : 'All Root Categories'}
                          </option>
                          {rootCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name[lang]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory Filter */}
                      <div className="md:col-span-2">
                        <select
                          data-testid="admin-products-subcategory-filter"
                          value={productsQuery.subcategoryId}
                          onChange={(e) =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              subcategoryId: e.target.value,
                              page: 1,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          <option value="ALL">
                            {isAr ? 'كل الأقسام الفرعية' : 'All Subcategories'}
                          </option>
                          {selectedFilterSubcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name[lang]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Brand Filter */}
                      <div className="md:col-span-2">
                        <select
                          data-testid="admin-products-brand-filter"
                          value={productsQuery.brandId}
                          onChange={(e) =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              brandId: e.target.value,
                              page: 1,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          <option value="ALL">
                            {isAr ? 'كل العلامات' : 'All Brands'}
                          </option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Second Row: Condition, Availability, Use-Case, Merchandising Flags, Sort & Reset */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                      <select
                        data-testid="admin-products-condition-filter"
                        value={productsQuery.condition}
                        onChange={(e) =>
                          setProductsQuery((prev) => ({
                            ...prev,
                            condition: e.target.value as ProductCondition | 'ALL',
                            page: 1,
                          }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700"
                      >
                        <option value="ALL">
                          {isAr ? 'الحالة: الكل (NEW/USED)' : 'Condition: All'}
                        </option>
                        <option value="NEW">NEW ({isAr ? 'جديد' : 'New'})</option>
                        <option value="USED">USED ({isAr ? 'مستعمل' : 'Used'})</option>
                      </select>

                      <select
                        data-testid="admin-products-availability-filter"
                        value={productsQuery.availability}
                        onChange={(e) =>
                          setProductsQuery((prev) => ({
                            ...prev,
                            availability: e.target.value as AvailabilityStatus | 'ALL',
                            page: 1,
                          }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700"
                      >
                        <option value="ALL">
                          {isAr ? 'التوفر: الكل' : 'Availability: All'}
                        </option>
                        <option value="IN_STOCK">
                          {isAr ? 'متوفر (In Stock)' : 'In Stock'}
                        </option>
                        <option value="ON_REQUEST">
                          {isAr ? 'حسب الطلب (On Request)' : 'On Request'}
                        </option>
                        <option value="OUT_OF_STOCK">
                          {isAr ? 'غير متوفر (Out of Stock)' : 'Out of Stock'}
                        </option>
                      </select>

                      <select
                        data-testid="admin-products-usecase-filter"
                        value={productsQuery.useCaseId}
                        onChange={(e) =>
                          setProductsQuery((prev) => ({
                            ...prev,
                            useCaseId: e.target.value,
                            page: 1,
                          }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700"
                      >
                        <option value="ALL">
                          {isAr ? 'وسم الاستخدام: الكل' : 'Use Case: All'}
                        </option>
                        {useCaseTags.map((uc) => (
                          <option key={uc.id} value={uc.id}>
                            {uc.name[lang]}
                          </option>
                        ))}
                      </select>

                      <select
                        data-testid="admin-products-flag-filter"
                        value={
                          productsQuery.bestSeller === 'true'
                            ? 'BEST_SELLER'
                            : productsQuery.newArrival === 'true'
                            ? 'NEW_ARRIVAL'
                            : productsQuery.hasOffer === 'true'
                            ? 'HAS_OFFER'
                            : 'ALL'
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          setProductsQuery((prev) => ({
                            ...prev,
                            bestSeller: v === 'BEST_SELLER' ? 'true' : 'ALL',
                            newArrival: v === 'NEW_ARRIVAL' ? 'true' : 'ALL',
                            hasOffer: v === 'HAS_OFFER' ? 'true' : 'ALL',
                            page: 1,
                          }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700"
                      >
                        <option value="ALL">
                          {isAr ? 'الشارات التسويقية: الكل' : 'Badges: All'}
                        </option>
                        <option value="BEST_SELLER">
                          {isAr ? 'الأكثر مبيعاً ★' : 'Best Sellers ★'}
                        </option>
                        <option value="NEW_ARRIVAL">
                          {isAr ? 'وصل حديثاً' : 'New Arrivals'}
                        </option>
                        <option value="HAS_OFFER">
                          {isAr ? 'عليه عرض نشط' : 'Has Active Offer'}
                        </option>
                      </select>

                      <select
                        data-testid="admin-products-sort-select"
                        value={`${productsQuery.sort}:${productsQuery.order}`}
                        onChange={(e) => {
                          const [sort, order] = e.target.value.split(':') as [
                            AdminProductsQuery['sort'],
                            AdminProductsQuery['order'],
                          ];
                          setProductsQuery((prev) => ({
                            ...prev,
                            sort,
                            order,
                            page: 1,
                          }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700"
                      >
                        <option value="updatedAt:desc">
                          {isAr ? 'ترتيب: الأحدث تعديلاً' : 'Sort: Recently Updated'}
                        </option>
                        <option value="priceUsd:asc">
                          {isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}
                        </option>
                        <option value="priceUsd:desc">
                          {isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}
                        </option>
                        <option value="name:asc">
                          {isAr ? 'الاسم: أ - ي' : 'Name: A to Z'}
                        </option>
                        <option value="sku:asc">
                          {isAr ? 'كود SKU' : 'SKU Code'}
                        </option>
                      </select>

                      <div className="flex items-center gap-1.5">
                        <select
                          aria-label="Items per page"
                          value={productsQuery.limit}
                          onChange={(e) =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              limit: Number(e.target.value) || 10,
                              page: 1,
                            }))
                          }
                          className="flex-1 px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono-num font-bold text-slate-700"
                        >
                          <option value={8}>8 / page</option>
                          <option value={10}>10 / page</option>
                          <option value={20}>20 / page</option>
                          <option value={50}>50 / page</option>
                        </select>

                        {hasActiveProductFilters && (
                          <button
                            type="button"
                            data-testid="admin-products-reset-filters"
                            onClick={() =>
                              setProductsQuery(DEFAULT_ADMIN_PRODUCTS_QUERY)
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                            title={isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isAr ? 'مسح' : 'Clear'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop & Tablet Table View (>= 768px) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2.5 px-2 text-start">
                            {lang === 'ar' ? 'المنتج والمعرض' : 'Product & Gallery'}
                          </th>
                          <th className="py-2.5 px-2 text-start">
                            {lang === 'ar' ? 'القسم / العلامة' : 'Category / Brand'}
                          </th>
                          <th className="py-2.5 px-2 text-start">
                            {lang === 'ar' ? 'الحالة والتوفر' : 'Condition & Stock'}
                          </th>
                          <th className="py-2.5 px-2 text-start">
                            {lang === 'ar' ? 'السعر (USD / SYP)' : 'USD / SYP'}
                          </th>
                          <th className="py-2.5 px-2 text-center">
                            {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                          </th>
                          <th className="py-2.5 px-2 text-end">
                            {lang === 'ar' ? 'إجراءات' : 'Actions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {productsResult.items.map((prod) => {
                          const cat = categories.find((c) => c.id === prod.categoryId);
                          const brand = brands.find((b) => b.id === prod.brandId);
                          const galleryCount = prod.galleryImages?.length || 1;
                          return (
                            <tr key={prod.id} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-12 h-9 rounded border border-slate-200 overflow-hidden shrink-0 relative">
                                    <ProductVisual
                                      visualKey={prod.primaryImage}
                                      alt={prod.name[lang]}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#111318] line-clamp-1 max-w-xs">
                                      {prod.name[lang]}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span
                                        className="font-mono-num text-[11px] text-slate-400"
                                        dir="ltr"
                                      >
                                        {prod.sku}
                                      </span>
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                        <Images className="w-3 h-3 text-[#8E4DEB]" />
                                        {galleryCount}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="font-semibold text-slate-800">
                                  {cat?.name[lang] ?? prod.categoryId}
                                </div>
                                <div className="text-[11px] text-slate-500" dir="ltr">
                                  {brand?.name ?? prod.brandId}
                                </div>
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                      prod.condition === 'USED'
                                        ? 'bg-amber-50 text-[#D96B38] border border-amber-200'
                                        : 'bg-slate-100 text-[#111318]'
                                    }`}
                                  >
                                    {prod.condition}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      prod.availability === 'IN_STOCK'
                                        ? 'text-emerald-700'
                                        : prod.availability === 'ON_REQUEST'
                                        ? 'text-amber-700'
                                        : 'text-rose-600'
                                    }`}
                                  >
                                    {prod.availability === 'IN_STOCK'
                                      ? isAr
                                        ? 'متوفر'
                                        : 'In Stock'
                                      : prod.availability === 'ON_REQUEST'
                                      ? isAr
                                        ? 'حسب الطلب'
                                        : 'On Request'
                                      : isAr
                                      ? 'نفذت الكمية'
                                      : 'Out of Stock'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-2 font-mono-num">
                                <div className="font-bold text-[#111318]" dir="ltr">
                                  {formatUsd(prod.priceUsd)}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {formatSyp(
                                    convertUsdToSyp(
                                      prod.priceUsd,
                                      settings.usdToSypRate
                                    ),
                                    lang
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => onToggleBestSeller(prod.id)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                                    prod.isBestSeller
                                      ? 'bg-[#8E4DEB] text-white'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  {prod.isBestSeller
                                    ? lang === 'ar'
                                      ? 'مفعّل ★'
                                      : 'Active ★'
                                    : lang === 'ar'
                                    ? 'غير مفعّل'
                                    : 'Off'}
                                </button>
                              </td>
                              <td className="py-2.5 px-2 text-end">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openProductEditor(prod)}
                                    className="p-1.5 rounded bg-[#F4F3F7] hover:bg-[#8E4DEB] hover:text-white text-slate-700 transition-colors cursor-pointer"
                                    aria-label={`Edit ${prod.name.en}`}
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  {confirmDeleteProductId === prod.id ? (
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onDeleteProduct(prod.id);
                                          setConfirmDeleteProductId(null);
                                          showToast(
                                            'تم حذف المنتج بنجاح',
                                            'Product deleted'
                                          );
                                        }}
                                        className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                                      >
                                        {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setConfirmDeleteProductId(null)
                                        }
                                        className="px-1.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold cursor-pointer"
                                      >
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setConfirmDeleteProductId(prod.id)
                                      }
                                      className="p-1.5 rounded bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                      aria-label={`Delete ${prod.name.en}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {productsResult.items.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-10 text-center text-slate-400 text-xs font-bold"
                            >
                              {isAr
                                ? 'لا توجد منتجات مطابقة لمعايير البحث أو التصفية الحالية.'
                                : 'No products match the current search or filter criteria.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Layout (< 768px — Full Readable Product Titles, Zero Horizontal Crushing) */}
                  <div
                    data-testid="admin-mobile-products-list"
                    className="md:hidden space-y-2.5"
                  >
                    {productsResult.items.map((prod) => (
                      <div
                        key={prod.id}
                        data-testid={`admin-mobile-product-card-${prod.id}`}
                        className="rounded-xl border border-slate-200 bg-[#FAF9FC] p-3 space-y-2.5"
                      >
                        {/* Top Row: Thumbnail + Full Readable Product Name + SKU & Condition */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-14 h-11 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                            <ProductVisual
                              visualKey={prod.primaryImage}
                              alt={prod.name[lang]}
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="text-xs font-extrabold text-[#111318] leading-snug line-clamp-2">
                              {prod.name[lang]}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
                              <span
                                className="font-mono-num text-slate-500"
                                dir="ltr"
                              >
                                {prod.sku}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  prod.condition === 'USED'
                                    ? 'bg-amber-50 text-[#D96B38] border border-amber-200'
                                    : 'bg-slate-100 text-[#111318]'
                                }`}
                              >
                                {prod.condition}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Price (USD + SYP) & Actions (Best Seller, Edit, Protected Delete) */}
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                          <div className="font-mono-num">
                            <span
                              className="text-sm font-extrabold text-[#111318]"
                              dir="ltr"
                            >
                              {formatUsd(prod.priceUsd)}
                            </span>
                            <span className="text-[11px] text-[#8E4DEB] font-semibold ms-1.5">
                              {formatSyp(
                                convertUsdToSyp(
                                  prod.priceUsd,
                                  settings.usdToSypRate
                                ),
                                lang
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onToggleBestSeller(prod.id)}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                prod.isBestSeller
                                  ? 'bg-[#8E4DEB] text-white'
                                  : 'bg-white border border-slate-200 text-slate-600'
                              }`}
                            >
                              {prod.isBestSeller
                                ? lang === 'ar'
                                  ? 'الأكثر مبيعاً ★'
                                  : 'Best Seller ★'
                                : lang === 'ar'
                                ? 'عادي'
                                : 'Standard'}
                            </button>

                            <button
                              type="button"
                              onClick={() => openProductEditor(prod)}
                              aria-label={`Edit ${prod.name.en}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#111318] text-white text-[11px] font-bold"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                            </button>

                            {confirmDeleteProductId === prod.id ? (
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteProduct(prod.id);
                                    setConfirmDeleteProductId(null);
                                    showToast(
                                      'تم حذف المنتج بنجاح',
                                      'Product deleted'
                                    );
                                  }}
                                  className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-bold"
                                >
                                  {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDeleteProductId(null)
                                  }
                                  className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[11px] font-bold"
                                >
                                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmDeleteProductId(prod.id)
                                }
                                aria-label={`Delete ${prod.name.en}`}
                                className="p-1.5 rounded bg-rose-50 text-rose-600 border border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Footer */}
                  {productsResult.totalPages > 1 && (
                    <div
                      data-testid="admin-products-pagination"
                      className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="text-xs text-slate-500 font-semibold">
                        {isAr
                          ? `صفحة ${productsResult.page} من ${productsResult.totalPages} (${productsResult.total} منتج)`
                          : `Page ${productsResult.page} of ${productsResult.totalPages} (${productsResult.total} products)`}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={productsResult.page <= 1}
                          onClick={() =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              page: Math.max(1, prev.page - 1),
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          {isAr ? (
                            <ChevronRight className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronLeft className="w-3.5 h-3.5" />
                          )}
                          <span>{isAr ? 'السابق' : 'Prev'}</span>
                        </button>
                        {Array.from(
                          { length: productsResult.totalPages },
                          (_, idx) => idx + 1
                        ).map((pNum) => (
                          <button
                            key={pNum}
                            type="button"
                            onClick={() =>
                              setProductsQuery((prev) => ({
                                ...prev,
                                page: pNum,
                              }))
                            }
                            className={`w-8 h-8 rounded-lg text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                              pNum === productsResult.page
                                ? 'bg-[#111318] text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {pNum}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={
                            productsResult.page >= productsResult.totalPages
                          }
                          onClick={() =>
                            setProductsQuery((prev) => ({
                              ...prev,
                              page: Math.min(
                                productsResult.totalPages,
                                prev.page + 1
                              ),
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isAr ? 'التالي' : 'Next'}</span>
                          {isAr ? (
                            <ChevronLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2.5: HOMEPAGE HERO SLIDES & PROMOTIONAL BANNERS */}
          {activeTab === 'banners' && (
            <AdminBannersManager
              heroSlides={heroSlides}
              promoBanners={promoBanners}
              categories={categories}
              lang={lang}
              onNotify={showToast}
              onSaveHeroSlide={(s) => {
                onSaveHeroSlide(s);
                showToast(
                  'تم حفظ شريحة السلايدر الرئيسي بنجاح',
                  'Hero slide saved successfully'
                );
              }}
              onReorderHeroSlides={(slides) => {
                onReorderHeroSlides(slides);
                showToast(
                  'تم تحديث ترتيب السلايدر الرئيسي',
                  'Hero slide order updated'
                );
              }}
              onDeleteHeroSlide={(id) => {
                onDeleteHeroSlide(id);
                showToast('تم حذف الشريحة', 'Hero slide deleted');
              }}
              onSavePromoBanner={(b) => {
                onSavePromoBanner(b);
                showToast(
                  'تم حفظ البانر الترويجي بنجاح',
                  'Promotional banner saved'
                );
              }}
              onReorderPromoBanners={(banners) => {
                onReorderPromoBanners(banners);
                showToast(
                  'تم تحديث ترتيب البانرات الترويجية',
                  'Promo banners reordered'
                );
              }}
            />
          )}

          {/* TAB 3: OFFERS MANAGEMENT WITH FULL CREATE/EDIT, DATE/TIME & FILTERING */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Create / Edit Time-Limited Offer Form */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-[#111318]">
                      {editingOfferId
                        ? isAr
                          ? 'تعديل العرض المؤقت (Edit Time-Limited Offer)'
                          : 'Edit Time-Limited Offer'
                        : isAr
                        ? 'إنشاء عرض مؤقت جديد (Create Time-Limited Offer)'
                        : 'Create Time-Limited Offer'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isAr
                        ? 'حدد المنتج، سعر العرض بالدولار، تاريخ البداية والنهاية، والشارة التسويقية'
                        : 'Configure product, discounted USD price, start/end timestamps, and bilingual promotional badges'}
                    </p>
                  </div>
                  {editingOfferId && (
                    <button
                      type="button"
                      onClick={resetOfferForm}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                    >
                      {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
                    </button>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const saved: Offer = {
                      id: editingOfferId ?? `offer-${Date.now()}`,
                      productId: offerProductId,
                      title: { ar: offerTitleAr, en: offerTitleEn },
                      badgeText: {
                        ar:
                          offerBadgeAr.trim() ||
                          (offerExclusive ? 'عرض حصري' : 'عرض مؤقت'),
                        en:
                          offerBadgeEn.trim() ||
                          (offerExclusive ? 'Exclusive Deal' : 'Limited Deal'),
                      },
                      offerPriceUsd,
                      startTime: new Date(offerStartIso).toISOString(),
                      endTime: new Date(offerEndIso).toISOString(),
                      isExclusive: offerExclusive,
                      isActive: true,
                    };
                    onSaveOffer(saved);
                    resetOfferForm();
                    showToast(
                      editingOfferId
                        ? 'تم تحديث العرض المؤقت بنجاح'
                        : 'تم تفعيل العرض المؤقت بنجاح',
                      editingOfferId
                        ? 'Timed offer updated'
                        : 'Timed offer published'
                    );
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {lang === 'ar' ? 'اختر المنتج *' : 'Select Product *'}
                      </label>
                      <select
                        value={offerProductId}
                        onChange={(e) => {
                          const p = products.find(
                            (item) => item.id === e.target.value
                          );
                          setOfferProductId(e.target.value);
                          if (p && !editingOfferId) {
                            setOfferPriceUsd(Math.round(p.priceUsd * 0.88));
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name[lang]} — {formatUsd(p.priceUsd)} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {lang === 'ar'
                          ? 'سعر العرض المخفض (USD $)'
                          : 'Offer Price (USD $)'}
                      </label>
                      <input
                        type="number"
                        dir="ltr"
                        min={1}
                        value={offerPriceUsd}
                        onChange={(e) =>
                          setOfferPriceUsd(Number(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        {isAr ? 'معاينة الخصم والليرة' : 'Discount & SYP Preview'}
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-[#F4F3F7] border border-slate-200 text-xs font-mono-num flex items-center justify-between">
                        <span className="font-bold text-[#8E4DEB]">
                          {formatSyp(
                            convertUsdToSyp(offerPriceUsd, settings.usdToSypRate),
                            lang
                          )}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                          -{previewDiscountPct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Titles & Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {lang === 'ar' ? 'عنوان العرض (عربي)' : 'Offer Title (AR)'}
                      </label>
                      <input
                        type="text"
                        value={offerTitleAr}
                        onChange={(e) => setOfferTitleAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {lang === 'ar' ? 'عنوان العرض (EN)' : 'Offer Title (EN)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={offerTitleEn}
                        onChange={(e) => setOfferTitleEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {isAr ? 'نص الشارة (عربي)' : 'Badge Text (AR)'}
                      </label>
                      <input
                        type="text"
                        value={offerBadgeAr}
                        onChange={(e) => setOfferBadgeAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {isAr ? 'نص الشارة (EN)' : 'Badge Text (EN)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={offerBadgeEn}
                        onChange={(e) => setOfferBadgeEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Start / End Date-Time & Quick Presets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {isAr ? 'تاريخ ووقت البدء' : 'Start Date & Time'}
                      </label>
                      <input
                        type="datetime-local"
                        dir="ltr"
                        value={offerStartIso}
                        onChange={(e) => setOfferStartIso(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111318] mb-1">
                        {isAr ? 'تاريخ ووقت الانتهاء' : 'End Date & Time'}
                      </label>
                      <input
                        type="datetime-local"
                        dir="ltr"
                        value={offerEndIso}
                        onChange={(e) => setOfferEndIso(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {[24, 48, 72, 168].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => {
                            setOfferStartIso(
                              new Date(nowMs - 60000).toISOString().slice(0, 16)
                            );
                            setOfferEndIso(
                              new Date(nowMs + hrs * 3600 * 1000)
                                .toISOString()
                                .slice(0, 16)
                            );
                          }}
                          className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono-num font-bold cursor-pointer"
                        >
                          +{hrs}h
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#111318] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={offerExclusive}
                        onChange={(e) => setOfferExclusive(e.target.checked)}
                        className="rounded text-[#D66C9D]"
                      />
                      <span>
                        {lang === 'ar'
                          ? 'عرض حصري يظهر في صفحة العروض الحصرية والواجهة الرئيسية'
                          : 'Exclusive Offer (Featured on Homepage & Exclusive Offers Page)'}
                      </span>
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#D66C9D] hover:opacity-95 text-white text-xs font-bold cursor-pointer"
                    >
                      {editingOfferId
                        ? isAr
                          ? 'حفظ تعديلات العرض'
                          : 'Update Offer'
                        : isAr
                        ? 'نشر العرض المؤقت'
                        : 'Publish Offer'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Configured Offers List with Search, Status Filter & Countdown Preview */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-[#111318]">
                    {lang === 'ar'
                      ? `العروض المسجلة ومعاينة المؤقت التنازلي (${offersResult.total})`
                      : `Configured Offers & Live Countdown Preview (${offersResult.total})`}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={offersQuery.q}
                      onChange={(e) =>
                        setOffersQuery((prev) => ({
                          ...prev,
                          q: e.target.value,
                          page: 1,
                        }))
                      }
                      placeholder={
                        isAr ? 'بحث في العروض...' : 'Search offers...'
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <select
                      value={offersQuery.status}
                      onChange={(e) =>
                        setOffersQuery((prev) => ({
                          ...prev,
                          status: e.target.value as OfferTemporalStatus | 'ALL',
                          page: 1,
                        }))
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="ALL">
                        {isAr ? 'كل الحالات' : 'All Statuses'}
                      </option>
                      <option value="ACTIVE">
                        {isAr ? 'نشط حالياً (Active)' : 'Active'}
                      </option>
                      <option value="SCHEDULED">
                        {isAr ? 'مجدول (Scheduled)' : 'Scheduled'}
                      </option>
                      <option value="EXPIRED">
                        {isAr ? 'منتهي (Expired)' : 'Expired'}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {offersResult.items.map((offer) => {
                    const prod = products.find((p) => p.id === offer.productId);
                    const temporalStatus = getOfferTemporalStatus(offer, nowMs);
                    const discPct = prod
                      ? calculateDiscountPercent(
                          prod.priceUsd,
                          offer.offerPriceUsd
                        )
                      : 0;
                    return (
                      <div
                        key={offer.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                temporalStatus === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : temporalStatus === 'SCHEDULED'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {temporalStatus === 'ACTIVE'
                                ? lang === 'ar'
                                  ? 'نشط حالياً'
                                  : 'ACTIVE'
                                : temporalStatus === 'SCHEDULED'
                                ? lang === 'ar'
                                  ? 'مجدول'
                                  : 'SCHEDULED'
                                : lang === 'ar'
                                ? 'منتهي الصلاحية'
                                : 'EXPIRED'}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono-num">
                              -{discPct}%
                            </span>
                            <span className="text-xs font-bold text-[#111318]">
                              {prod?.name[lang]}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {offer.title[lang]} ({offer.badgeText[lang]}) —{' '}
                            <span className="font-mono-num font-bold text-[#111318]">
                              {formatUsd(offer.offerPriceUsd)}
                            </span>{' '}
                            <span className="line-through font-mono-num">
                              {prod ? formatUsd(prod.priceUsd) : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <CountdownBadge
                            endTimeIso={offer.endTime}
                            nowMs={nowMs}
                            lang={lang}
                            variant="compact"
                          />
                          <button
                            type="button"
                            onClick={() => startEditOffer(offer)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#8E4DEB] hover:text-white transition-colors cursor-pointer"
                            title={isAr ? 'تعديل العرض' : 'Edit Offer'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteOffer(offer.id)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            aria-label="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER PRODUCT REQUESTS */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-base font-extrabold text-[#111318]">
                    {lang === 'ar'
                      ? 'طلبات الزبائن للمنتجات (Customer Product Requests)'
                      : 'Customer Product Requests'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'جميع الطلبات المرسلة من نافذة "اطلب الآن" في المتجر للمتابعة المباشرة عبر واتساب'
                      : 'All inquiries submitted via the storefront Request Now modal for direct WhatsApp follow-up'}
                  </p>
                </div>

                {/* Search & Status Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={requestsQuery.q}
                      onChange={(e) =>
                        setRequestsQuery((prev) => ({
                          ...prev,
                          q: e.target.value,
                          page: 1,
                        }))
                      }
                      placeholder={
                        isAr
                          ? 'بحث باسم الزبون، الهاتف، المنتج...'
                          : 'Search name, phone, SKU...'
                      }
                      className="ps-8 pe-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <select
                    value={requestsQuery.status}
                    onChange={(e) =>
                      setRequestsQuery((prev) => ({
                        ...prev,
                        status: e.target.value as
                          | CustomerRequest['status']
                          | 'ALL',
                        page: 1,
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="ALL">
                      {isAr ? 'كل الحالات' : 'All Statuses'}
                    </option>
                    <option value="NEW">NEW ({isAr ? 'جديد' : 'New'})</option>
                    <option value="CONTACTED">
                      CONTACTED ({isAr ? 'تم التواصل' : 'Contacted'})
                    </option>
                    <option value="IN_PROGRESS">
                      IN_PROGRESS ({isAr ? 'قيد المتابعة' : 'In Progress'})
                    </option>
                    <option value="COMPLETED">
                      COMPLETED ({isAr ? 'مكتمل' : 'Completed'})
                    </option>
                    <option value="CANCELLED">
                      CANCELLED ({isAr ? 'ملغى' : 'Cancelled'})
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {!isMockMode && liveRequestsLoading && (
                  <p className="text-xs text-slate-500 py-5 text-center" role="status">
                    {isAr ? 'جارٍ تحميل طلبات الزبائن…' : 'Loading customer requests…'}
                  </p>
                )}
                {!isMockMode && liveRequestsError && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800" role="alert">
                    <p>{isAr ? 'تعذر تحميل طلبات الزبائن. حاول مرة أخرى.' : 'Customer requests could not be loaded. Please try again.'}</p>
                    <button
                      type="button"
                      onClick={() => setLiveRequestsRetry((value) => value + 1)}
                      className="mt-2 rounded-md border border-rose-300 px-2.5 py-1 font-bold hover:bg-rose-100"
                    >
                      {isAr ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                  </div>
                )}
                {!liveRequestsLoading && !liveRequestsError && inboxRequests.length === 0 && (
                  <p className="text-xs text-slate-500 py-5 text-center">
                    {isAr ? 'لا توجد طلبات مطابقة حالياً.' : 'No matching customer requests yet.'}
                  </p>
                )}
                {!liveRequestsError && inboxRequests.map((req) => {
                  const phoneVerified = isMockMode
                    ? isPhoneLinkVerified(req.phoneNumber)
                    : Boolean(req.phoneNumber.trim());
                  const isEditingNote = editingRequestNoteId === req.id;
                  const isSavingRequest = Boolean(liveRequestSaving[req.id]);
                  const failedRequestUpdate = liveRequestFailures[req.id];

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-sm font-extrabold text-[#111318]">
                            {req.customerName}
                          </span>
                          <span
                            className="font-mono-num text-xs font-bold text-[#8E4DEB]"
                            dir="ltr"
                          >
                            {req.phoneNumber}
                          </span>
                          {isMockMode && !phoneVerified && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                              {isAr
                                ? 'رقم تجريبي غير موثق'
                                : 'Unverified Demo Phone'}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono-num">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-slate-800">
                          {req.productName[lang]}{' '}
                          <span className="font-mono-num text-slate-500">
                            ({req.productSku})
                          </span>{' '}
                          —{' '}
                          <span className="font-mono-num font-bold text-[#111318]">
                            {formatUsd(req.priceUsdAtRequest)}
                          </span>{' '}
                          ({formatSypSnapshot(req.priceSypAtRequest, lang)})
                        </div>

                        {req.note && (
                          <p className="text-xs text-slate-600 bg-[#F4F3F7] p-2 rounded mt-1">
                            {lang === 'ar'
                              ? 'ملاحظة الزبون: '
                              : 'Customer Note: '}
                            {req.note}
                          </p>
                        )}

                        {req.adminNote && !isEditingNote && (
                          <p className="text-xs text-blue-800 bg-blue-50 border border-blue-100 p-2 rounded mt-1">
                            <span className="font-bold">
                              {isAr ? 'ملاحظة الإدارة: ' : 'Admin Note: '}
                            </span>
                            {req.adminNote}
                          </p>
                        )}

                        {isEditingNote ? (
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="text"
                              value={requestAdminNoteDraft}
                              onChange={(e) =>
                                setRequestAdminNoteDraft(e.target.value)
                              }
                              placeholder={
                                isAr
                                  ? 'أضف ملاحظة متابعة داخلية...'
                                  : 'Add internal follow-up note...'
                              }
                              className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs"
                            />
                            <button
                              type="button"
                              disabled={!isMockMode && isSavingRequest}
                              onClick={() => {
                                if (isMockMode) {
                                  onUpdateRequestStatus(
                                    req.id,
                                    req.status as CustomerRequest['status'],
                                    requestAdminNoteDraft
                                  );
                                  setEditingRequestNoteId(null);
                                  showToast(
                                    'تم حفظ الملاحظة الإدارية',
                                    'Admin note saved'
                                  );
                                  return;
                                }
                                void saveLiveRequest(req.id, {
                                  adminNotes: requestAdminNoteDraft.trim() || null,
                                }).then((saved) => {
                                  if (saved) setEditingRequestNoteId(null);
                                });
                              }}
                              className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isSavingRequest
                                ? isAr ? 'جارٍ الحفظ…' : 'Saving…'
                                : isAr ? 'حفظ' : 'Save'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={!isMockMode && isSavingRequest}
                            onClick={() => {
                              setEditingRequestNoteId(req.id);
                              setRequestAdminNoteDraft(req.adminNote || '');
                            }}
                            className="text-[11px] font-bold text-slate-500 hover:text-[#8E4DEB] pt-1 inline-block disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {req.adminNote
                              ? isAr
                                ? 'تعديل ملاحظة الإدارة'
                                : 'Edit Admin Note'
                              : isAr
                              ? '+ إضافة ملاحظة متابعة'
                              : '+ Add Follow-up Note'}
                          </button>
                        )}

                        {!isMockMode && failedRequestUpdate && (
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-rose-700" role="alert">
                            <span>{isAr ? 'تعذر حفظ التحديث.' : 'The update could not be saved.'}</span>
                            <button
                              type="button"
                              disabled={isSavingRequest}
                              onClick={() => void saveLiveRequest(req.id, failedRequestUpdate)}
                              className="font-bold underline disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isAr ? 'إعادة المحاولة' : 'Retry'}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center flex-wrap gap-2 shrink-0">
                        <select
                          value={req.status}
                          disabled={!isMockMode && isSavingRequest}
                          onChange={(e) => {
                            const status = e.target.value as BackendCustomerRequestStatus;
                            if (isMockMode) {
                              onUpdateRequestStatus(req.id, status as CustomerRequest['status']);
                              return;
                            }
                            void saveLiveRequest(req.id, { status });
                          }}
                          aria-label={`Status for ${req.customerName}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="NEW">NEW (جديد)</option>
                          <option value="CONTACTED">CONTACTED (تم التواصل)</option>
                          <option value="IN_PROGRESS">IN_PROGRESS (قيد المتابعة)</option>
                          <option value="COMPLETED">COMPLETED (مكتمل)</option>
                          <option value="CANCELLED">CANCELLED (ملغى)</option>
                        </select>
                        {!isMockMode && isSavingRequest && (
                          <span className="text-[11px] font-bold text-slate-500" role="status">
                            {isAr ? 'جارٍ الحفظ…' : 'Saving…'}
                          </span>
                        )}

                        {phoneVerified ? (
                          <a
                            href={`https://wa.me/${req.phoneNumber.replace(
                              /\D/g,
                              ''
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'ar'
                                ? 'رد عبر واتساب'
                                : 'WhatsApp Reply'}
                            </span>
                          </a>
                        ) : (
                          <span
                            title={
                              isAr
                                ? 'رقم تجريبي غير موثق'
                                : 'Demo placeholder number'
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold cursor-not-allowed"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'ar'
                                ? 'واتساب (رقم تجريبي)'
                                : 'Demo Number'}
                            </span>
                          </span>
                        )}

                        {isMockMode && <button
                          type="button"
                          onClick={() => {
                            onDeleteCustomerRequest(req.id);
                            showToast('تم حذف الطلب', 'Request deleted');
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title={isAr ? 'حذف الطلب' : 'Delete Request'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {!liveRequestsError && inboxPagination.totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>
                    {isAr
                      ? `صفحة ${inboxPagination.page} من ${inboxPagination.totalPages} — ${inboxPagination.total} طلب`
                      : `Page ${inboxPagination.page} of ${inboxPagination.totalPages} — ${inboxPagination.total} requests`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={inboxPagination.page <= 1 || liveRequestsLoading}
                      onClick={() => setRequestsQuery((query) => ({ ...query, page: query.page - 1 }))}
                      className="rounded-md border border-slate-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                      aria-label={isAr ? 'الصفحة السابقة' : 'Previous page'}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={inboxPagination.page >= inboxPagination.totalPages || liveRequestsLoading}
                      onClick={() => setRequestsQuery((query) => ({ ...query, page: query.page + 1 }))}
                      className="rounded-md border border-slate-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                      aria-label={isAr ? 'الصفحة التالية' : 'Next page'}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CATEGORIES & SUBCATEGORIES */}
          {activeTab === 'categories' && (
            <AdminCategoriesPanel
              categories={categories}
              products={products}
              useCaseTags={useCaseTags}
              lang={lang}
              onSaveCategory={(cat) => {
                onSaveCategory(cat);
                showToast('تم حفظ بيانات القسم بنجاح', 'Category saved');
              }}
              onDeleteCategory={(id) => {
                onDeleteCategory(id);
                showToast('تم حذف القسم بنجاح', 'Category deleted');
              }}
            />
          )}

          {/* TAB 6: USE-CASE TAGS MANAGEMENT */}
          {activeTab === 'usecases' && (
            <AdminUseCasesPanel
              useCaseTags={useCaseTags}
              categories={categories}
              products={products}
              lang={lang}
              onSaveUseCaseTag={(tag) => {
                onSaveUseCaseTag(tag);
                showToast(
                  'تم حفظ وسم الاستخدام بنجاح',
                  'Use-Case Tag saved'
                );
              }}
              onDeleteUseCaseTag={(id) => {
                onDeleteUseCaseTag(id);
                showToast('تم حذف وسم الاستخدام', 'Use-Case Tag deleted');
              }}
            />
          )}

          {/* TAB 7: BRANDS MANAGEMENT */}
          {activeTab === 'brands' && (
            <AdminBrandsPanel
              brands={brands}
              products={products}
              lang={lang}
              onSaveBrand={(brand) => {
                onSaveBrand(brand);
                showToast(
                  'تم حفظ العلامة التجارية بنجاح',
                  'Brand saved successfully'
                );
              }}
              onDeleteBrand={(id) => {
                onDeleteBrand(id);
                showToast('تم حذف العلامة التجارية', 'Brand deleted');
              }}
            />
          )}

          {/* TAB 8: MODEST & CREDIBLE ANALYTICS (No Fake Completed-Sale Stats) */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-6">
              <div>
                <h1 className="text-base font-extrabold text-[#111318]">
                  {lang === 'ar'
                    ? 'إحصائيات الزيارات والتفاعل (Storefront Engagement Analytics)'
                    : 'Storefront Traffic & Product Inquiry Analytics'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ar'
                    ? 'مؤشرات واقعية لزيارات الأقسام، مشاهدات صفحات المنتجات، وطلبات الاستفسار المرسلة عبر واتساب (بدون عمليات دفع إلكتروني)'
                    : 'Credible engagement metrics tracking category visits, product detail views, and WhatsApp inquiry clicks'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F4F3F7]">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'زيارات المتجر (آخر 7 أيام)'
                      : 'Storefront Visits (Last 7 Days)'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#111318] mt-1">
                    4,820
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {lang === 'ar'
                      ? '78% من سوريا (دمشق، حلب، حمص، اللاذقية)'
                      : '78% local Syrian traffic (mobile & desktop)'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F3F7]">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'مشاهدات تفاصيل المنتجات'
                      : 'Product Detail Views'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#8E4DEB] mt-1">
                    12,490
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {lang === 'ar'
                      ? 'الأعلى مشاهدة: اللابتوبات وكروت الشاشة'
                      : 'Most viewed: Gaming Laptops & RTX GPUs'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F3F7]">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'طلبات المنتجات عبر واتساب'
                      : 'Submitted Product Requests'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#D66C9D] mt-1">
                    {customerRequests.length + 34}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {lang === 'ar'
                      ? 'نسبة النقر على "اطلب الآن": 3.4%'
                      : 'Request Now conversion rate: 3.4%'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xs font-bold text-[#111318] uppercase tracking-wider">
                  {lang === 'ar'
                    ? 'الأقسام الأكثر استكشافاً وتفاعلاً'
                    : 'Most Explored Categories & Use Cases'}
                </h2>
                {[
                  {
                    label:
                      lang === 'ar'
                        ? 'اللابتوبات الجديدة والمستعملة (Laptops)'
                        : 'New & Clean Used Laptops',
                    views: 4910,
                    pct: 84,
                  },
                  {
                    label:
                      lang === 'ar'
                        ? 'كروت الشاشة وقطع التجميع (PC Components)'
                        : 'Graphics Cards & PC Components',
                    views: 3680,
                    pct: 68,
                  },
                  {
                    label:
                      lang === 'ar'
                        ? 'كيبوردات وماوسات (فلتر Gaming مقابل Office)'
                        : 'Keyboards & Mice (Gaming vs. Office Selector)',
                    views: 2450,
                    pct: 52,
                  },
                  {
                    label:
                      lang === 'ar'
                        ? 'سماعات الألعاب وسماعات IEM الاحترافية'
                        : 'Gaming Headsets & IEM Monitors',
                    views: 1450,
                    pct: 36,
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#111318]">
                        {row.label}
                      </span>
                      <span className="font-mono-num text-slate-500">
                        {row.views.toLocaleString('en-US')} views
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-[#8E4DEB] rounded-full"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: STORE SETTINGS & GLOBAL USD-TO-SYP EXCHANGE RATE */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-base font-extrabold text-[#111318]">
                    {lang === 'ar'
                      ? 'إعدادات المتجر وسعر الصرف العام (Store Settings)'
                      : 'Store Identity, Exchange Rate & Contact Settings'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'عند تعديل سعر صرف الدولار مقابل الليرة السورية هنا، يتم تحديث جميع أسعار المنتجات والعروض في المتجر فوراً'
                      : 'Updating the global USD-to-SYP exchange rate immediately recalculates all SYP prices across the storefront'}
                  </p>
                </div>

                {onResetDemoData && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetDemoData();
                      showToast(
                        'تمت استعادة البيانات الافتراضية للمتجر',
                        'Demo data reset to factory defaults'
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>
                      {isAr
                        ? 'استعادة البيانات التجريبية الافتراضية'
                        : 'Reset Demo Data'}
                    </span>
                  </button>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateSettings(localSettings);
                  showToast(
                    'تم تحديث إعدادات المتجر وسعر الصرف بنجاح!',
                    'Store settings & exchange rate updated!'
                  );
                }}
                className="space-y-5"
              >
                {/* Highlighted Global USD-to-SYP Exchange Rate Control */}
                <div className="p-4 rounded-xl bg-[#111318] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label
                      htmlFor="admin-exchange-rate-input"
                      className="block text-sm font-extrabold text-[#EF875D]"
                    >
                      {lang === 'ar'
                        ? 'سعر صرف الدولار مقابل الليرة السورية (1 USD = ? SYP)'
                        : 'Global USD to Syrian Pound Exchange Rate (1 USD = ? SYP)'}
                    </label>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {lang === 'ar'
                        ? 'يُدخل سعر المنتج بالدولار فقط، ويحسب المتجر السعر بالليرة السورية تلقائياً بناءً على هذه القيمة.'
                        : 'Products store a single USD price; all storefront SYP prices derive dynamically from this value.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" dir="ltr">
                    <span className="text-xs font-mono-num text-slate-300">
                      1 USD =
                    </span>
                    <input
                      id="admin-exchange-rate-input"
                      type="number"
                      min={100}
                      step={50}
                      value={localSettings.usdToSypRate}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          usdToSypRate: Number(e.target.value) || 12500,
                        })
                      }
                      className="w-32 px-3 py-2 rounded-lg bg-white text-[#111318] font-mono-num text-sm font-extrabold"
                    />
                    <span className="text-xs font-mono-num text-[#EF875D] font-bold">
                      SYP
                    </span>
                  </div>
                </div>

                {/* Store Identity & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {isAr ? 'اسم المتجر (عربي)' : 'Store Name (AR)'}
                    </label>
                    <input
                      type="text"
                      value={localSettings.storeName.ar}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          storeName: {
                            ...localSettings.storeName,
                            ar: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {isAr ? 'اسم المتجر (EN)' : 'Store Name (EN)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.storeName.en}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          storeName: {
                            ...localSettings.storeName,
                            en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {isAr ? 'عنوان المتجر (عربي)' : 'Store Address (AR)'}
                    </label>
                    <input
                      type="text"
                      value={localSettings.address.ar}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          address: {
                            ...localSettings.address,
                            ar: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {isAr ? 'عنوان المتجر (EN)' : 'Store Address (EN)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.address.en}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          address: {
                            ...localSettings.address,
                            en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                {/* Contact & WhatsApp Settings with Live Verification Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'الرقم الرئيسي المعروض (Primary Phone)'
                          : 'Primary Public Phone Number'}
                      </label>
                      {isPhoneLinkVerified(localSettings.phone) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          {isAr ? 'مفعّل في المتجر' : 'Verified Active'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <ShieldAlert className="w-3 h-3" />
                          {isAr ? 'غير موثق (معطل)' : 'Unverified'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.phone}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'الرقم الثاني (اختياري)'
                          : 'Secondary Phone (Optional)'}
                      </label>
                      {isPhoneLinkVerified(localSettings.secondaryPhone) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          {isAr ? 'مفعّل' : 'Verified'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {isAr ? 'مخفي حتى التوثيق' : 'Hidden Until Verified'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.secondaryPhone ?? ''}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          secondaryPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'رقم واتساب لاستقبال الطلبات'
                          : 'WhatsApp Number for Orders'}
                      </label>
                      {isWhatsappLinkVerified(localSettings.whatsappNumber) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          {isAr ? 'واتساب مفعّل' : 'WhatsApp Verified'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <ShieldAlert className="w-3 h-3" />
                          {isAr ? 'غير موثق' : 'Unverified'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.whatsappNumber}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          whatsappNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'رابط موقع المتجر على Google Maps'
                          : 'Google Maps Location URL'}
                      </label>
                      {isExternalChannelVerified(localSettings.mapLocationUrl) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          {isAr ? 'إحداثيات موثقة' : 'Verified Map Link'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {isAr ? 'غير مضبوط (مخفي)' : 'Unconfigured'}
                        </span>
                      )}
                    </div>
                    <input
                      type="url"
                      dir="ltr"
                      value={localSettings.mapLocationUrl ?? ''}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          mapLocationUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>
                </div>

                {/* Working Hours & Official Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'أوقات العمل (عربي)'
                        : 'Working Hours (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={localSettings.workingHours.ar}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          workingHours: {
                            ...localSettings.workingHours,
                            ar: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'أوقات العمل (إنكليزي)'
                        : 'Working Hours (English)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.workingHours.en}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          workingHours: {
                            ...localSettings.workingHours,
                            en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'رابط قناة تلغرام (Telegram)'
                          : 'Telegram Channel URL'}
                      </label>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {isExternalChannelVerified(localSettings.telegramChannel)
                          ? isAr
                            ? 'مفعّل'
                            : 'Active'
                          : isAr
                          ? 'مخفي'
                          : 'Hidden'}
                      </span>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.telegramChannel}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          telegramChannel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'رابط إنستغرام (Instagram)'
                          : 'Instagram Page URL'}
                      </label>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {isExternalChannelVerified(localSettings.instagramHandle)
                          ? isAr
                            ? 'مفعّل'
                            : 'Active'
                          : isAr
                          ? 'مخفي'
                          : 'Hidden'}
                      </span>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.instagramHandle}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          instagramHandle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#111318]">
                        {lang === 'ar'
                          ? 'رابط فيسبوك (Facebook)'
                          : 'Facebook Page URL'}
                      </label>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {isExternalChannelVerified(localSettings.facebookPage)
                          ? isAr
                            ? 'مفعّل'
                            : 'Active'
                          : isAr
                          ? 'مخفي'
                          : 'Hidden'}
                      </span>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.facebookPage}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          facebookPage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>
                </div>

                {/* Promotional Banner Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'نص الشريط الترويجي العلوي (عربي)'
                        : 'Top Promo Banner Text (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={localSettings.topPromoBanner.ar}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          topPromoBanner: {
                            ...localSettings.topPromoBanner,
                            ar: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'نص الشريط الترويجي العلوي (إنكليزي)'
                        : 'Top Promo Banner Text (English)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={localSettings.topPromoBanner.en}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          topPromoBanner: {
                            ...localSettings.topPromoBanner,
                            en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold cursor-pointer"
                  >
                    {lang === 'ar'
                      ? 'حفظ الإعدادات وتحديث الأسعار'
                      : 'Save Settings & Update Store'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 10: SERVICES MANAGEMENT (إدارة الخدمات) */}
          {activeTab === 'services' && (
            <div className="space-y-6" data-testid="admin-services-panel">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-base font-extrabold text-[#111318]">
                    {lang === 'ar'
                      ? 'إدارة الخدمات الفنية وحلول التبريد (Services Management)'
                      : 'Store Technical Services & Cooling Solutions Management'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'إضافة، تعديل، أو تفعيل/إيقاف الخدمات المعروضة مع إدارة صورة الغلاف ومعرض الصور الـ 5 لكل خدمة'
                      : 'Create, edit, or toggle active status for store services including cover image and 5-image gallery'}
                  </p>
                </div>
                <button
                  type="button"
                  data-testid="admin-add-service-btn"
                  onClick={() =>
                    setEditingService({
                      id: `service-${Date.now()}`,
                      slug: `service-${Date.now()}`,
                      title: { ar: '', en: '' },
                      subtitle: { ar: '', en: '' },
                      summary: { ar: '', en: '' },
                      description: { ar: '', en: '' },
                      primaryImage: '/assets/services/maintenance-1.svg',
                      galleryImages: [
                        '/assets/services/maintenance-1.svg',
                        '/assets/services/maintenance-2.svg',
                        '/assets/services/maintenance-3.svg',
                        '/assets/services/maintenance-4.svg',
                        '/assets/services/maintenance-5.svg',
                      ],
                      iconKey: 'maintenance',
                      badge: {
                        ar: 'خدمة فنية معتمدة',
                        en: 'Certified Technical Service',
                      },
                      turnaroundNote: {
                        ar: 'مدة التنفيذ: خلال 24 ساعة',
                        en: 'Turnaround: Within 24 hours',
                      },
                      startingPriceNote: {
                        ar: 'فحص أولي مجاني',
                        en: 'Free initial check',
                      },
                      isActive: true,
                      isFeatured: false,
                      showInNavbarShortcut: false,
                      highlights: [
                        {
                          title: { ar: 'المرحلة الأولى', en: 'Stage 1' },
                          description: {
                            ar: 'فحص وتشخيص أولي شامل',
                            en: 'Initial comprehensive diagnostic',
                          },
                        },
                        {
                          title: { ar: 'المرحلة الثانية', en: 'Stage 2' },
                          description: {
                            ar: 'تنفيذ الصيانة والترقية بقطع أصلية',
                            en: 'Servicing with genuine components',
                          },
                        },
                        {
                          title: { ar: 'المرحلة الثالثة', en: 'Stage 3' },
                          description: {
                            ar: 'اختبار الاستقرار النهائي قبل التسليم',
                            en: 'Final stability verification before handover',
                          },
                        },
                      ],
                      checklist: [
                        {
                          ar: 'فحص مجاني قبل البدء',
                          en: 'Complimentary pre-check',
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {lang === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}
                  </span>
                </button>
              </div>

              {editingService && (
                <form
                  data-testid="admin-service-editor-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const normalizedGallery = getServiceGalleryImages(editingService);
                    onSaveService({
                      ...editingService,
                      primaryImage:
                        normalizedGallery[0] ||
                        editingService.primaryImage ||
                        '/assets/services/maintenance-1.svg',
                      galleryImages: normalizedGallery,
                    });
                    setEditingService(null);
                    showToast(
                      'تم حفظ بيانات الخدمة ومعرض الصور بنجاح',
                      'Service & gallery images saved successfully'
                    );
                  }}
                  className="bg-white rounded-xl border-2 border-[#8E4DEB] p-6 space-y-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-extrabold text-[#111318]">
                      {lang === 'ar'
                        ? 'محرر الخدمة الفنية ومعرض الصور (Service & Gallery Editor)'
                        : 'Service & Gallery Editor'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="text-xs font-bold text-slate-500 hover:text-[#111318]"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'عنوان الخدمة (عربي) *'
                          : 'Service Title (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.title.ar}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            title: {
                              ...editingService.title,
                              ar: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'عنوان الخدمة (إنكليزي) *'
                          : 'Service Title (English) *'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        required
                        value={editingService.title.en}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            title: {
                              ...editingService.title,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Summary / Short Card Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'ملخص الخدمة المختصر لبطاقة العرض (عربي)'
                          : 'Short Card Summary (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={
                          editingService.summary?.ar ??
                          editingService.subtitle.ar
                        }
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            summary: {
                              ar: e.target.value,
                              en:
                                editingService.summary?.en ??
                                editingService.subtitle.en,
                            },
                            subtitle: {
                              ...editingService.subtitle,
                              ar: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'ملخص الخدمة المختصر لبطاقة العرض (إنكليزي)'
                          : 'Short Card Summary (English)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={
                          editingService.summary?.en ??
                          editingService.subtitle.en
                        }
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            summary: {
                              ar:
                                editingService.summary?.ar ??
                                editingService.subtitle.ar,
                              en: e.target.value,
                            },
                            subtitle: {
                              ...editingService.subtitle,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'وصف الخدمة التفصيلي (عربي)'
                          : 'Detailed Description (Arabic)'}
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.description.ar}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            description: {
                              ...editingService.description,
                              ar: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'وصف الخدمة التفصيلي (إنكليزي)'
                          : 'Detailed Description (English)'}
                      </label>
                      <textarea
                        rows={3}
                        dir="ltr"
                        value={editingService.description.en}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            description: {
                              ...editingService.description,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* UP TO 5-IMAGE SERVICE GALLERY & COVER IMAGE MANAGER */}
                  <div
                    data-testid="admin-service-gallery-manager"
                    className="p-4 rounded-xl bg-[#FAF9FC] border border-slate-200/90 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-extrabold text-[#111318] flex items-center gap-1.5">
                          <Images className="w-4 h-4 text-[#8E4DEB]" />
                          <span>
                            {isAr
                              ? 'صورة الغلاف ومعرض صور الخدمة (حتى 5 صور مع التحكم بالترتيب والحذف)'
                              : 'Service Cover Image & Detail Gallery (Up to 5 Images · Order & Remove)'}
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isAr
                            ? 'الصورة رقم 1 هي صورة الغلاف الرئيسية؛ يمكنك تعيين أي صورة كغلاف أو تغيير ترتيبها أو حذفها.'
                            : 'Slot #1 is the primary Cover Image; promote any slot to cover, reorder, or remove images.'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(
                          [
                            {
                              labelAr: 'تعبئة صور التبريد (5)',
                              labelEn: 'Load Cooling Set (5)',
                              family: 'cooling',
                            },
                            {
                              labelAr: 'تعبئة صور الصيانة (5)',
                              labelEn: 'Load Maintenance Set (5)',
                              family: 'maintenance',
                            },
                            {
                              labelAr: 'تعبئة صور الكاميرات (5)',
                              labelEn: 'Load Cameras Set (5)',
                              family: 'cameras',
                            },
                          ] as const
                        ).map((preset) => (
                          <button
                            key={preset.family}
                            type="button"
                            data-testid={`admin-service-preset-${preset.family}`}
                            onClick={() => {
                              const nextSet = [
                                `/assets/services/${preset.family}-1.svg`,
                                `/assets/services/${preset.family}-2.svg`,
                                `/assets/services/${preset.family}-3.svg`,
                                `/assets/services/${preset.family}-4.svg`,
                                `/assets/services/${preset.family}-5.svg`,
                              ];
                              setEditingService({
                                ...editingService,
                                primaryImage: nextSet[0],
                                galleryImages: nextSet,
                              });
                            }}
                            className="px-2.5 py-1 rounded bg-white hover:bg-[#8E4DEB] hover:text-white border border-slate-200 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                          >
                            {isAr ? preset.labelAr : preset.labelEn}
                          </button>
                        ))}

                        {getServiceGalleryImages(editingService).length < 5 && (
                          <button
                            type="button"
                            data-testid="admin-service-add-image-btn"
                            onClick={() => {
                              const current =
                                getServiceGalleryImages(editingService);
                              if (current.length >= 5) return;
                              const family = editingService.iconKey || 'maintenance';
                              const candidates = [
                                `/assets/services/${family}-1.svg`,
                                `/assets/services/${family}-2.svg`,
                                `/assets/services/${family}-3.svg`,
                                `/assets/services/${family}-4.svg`,
                                `/assets/services/${family}-5.svg`,
                              ];
                              const nextCandidate =
                                candidates.find((c) => !current.includes(c)) ||
                                candidates[current.length] ||
                                `/assets/services/${family}-1.svg`;
                              const updated = [...current, nextCandidate];
                              setEditingService({
                                ...editingService,
                                primaryImage: updated[0],
                                galleryImages: updated,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#111318] hover:bg-[#8E4DEB] text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>
                              {isAr ? 'إضافة صورة للمعرض' : 'Add Gallery Image'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {getServiceGalleryImages(editingService).map(
                        (slotKey, slotIdx, currentGallery) => (
                          <div
                            key={`${slotIdx}-${slotKey}`}
                            data-testid={`admin-service-slot-${slotIdx}`}
                            className={`rounded-lg bg-white border p-2.5 space-y-2 ${
                              slotIdx === 0
                                ? 'border-[#8E4DEB] ring-1 ring-[#8E4DEB]/30'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                              <span
                                className={
                                  slotIdx === 0
                                    ? 'text-[#8E4DEB]'
                                    : 'text-slate-600'
                                }
                              >
                                {slotIdx === 0
                                  ? isAr
                                    ? '1 · صورة الغلاف'
                                    : '1 · Cover Image'
                                  : `${slotIdx + 1} · Gallery`}
                              </span>
                              <div className="flex items-center gap-1">
                                {/* Move Earlier */}
                                <button
                                  type="button"
                                  data-testid={`admin-service-move-prev-${slotIdx}`}
                                  disabled={slotIdx === 0}
                                  title={
                                    isAr ? 'تحريك للأولوية' : 'Move earlier'
                                  }
                                  onClick={() => {
                                    if (slotIdx === 0) return;
                                    const updated = [...currentGallery];
                                    const temp = updated[slotIdx - 1];
                                    updated[slotIdx - 1] = updated[slotIdx];
                                    updated[slotIdx] = temp;
                                    setEditingService({
                                      ...editingService,
                                      primaryImage: updated[0],
                                      galleryImages: updated,
                                    });
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-35 text-[10px] font-bold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                                >
                                  ←
                                </button>
                                {/* Move Later */}
                                <button
                                  type="button"
                                  data-testid={`admin-service-move-next-${slotIdx}`}
                                  disabled={
                                    slotIdx === currentGallery.length - 1
                                  }
                                  title={isAr ? 'تحريك للخلف' : 'Move later'}
                                  onClick={() => {
                                    if (slotIdx >= currentGallery.length - 1)
                                      return;
                                    const updated = [...currentGallery];
                                    const temp = updated[slotIdx + 1];
                                    updated[slotIdx + 1] = updated[slotIdx];
                                    updated[slotIdx] = temp;
                                    setEditingService({
                                      ...editingService,
                                      primaryImage: updated[0],
                                      galleryImages: updated,
                                    });
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-35 text-[10px] font-bold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                                >
                                  →
                                </button>
                                {/* Remove Image (when > 1 image exists) */}
                                {currentGallery.length > 1 && (
                                  <button
                                    type="button"
                                    data-testid={`admin-service-remove-image-${slotIdx}`}
                                    title={isAr ? 'حذف الصورة' : 'Remove image'}
                                    onClick={() => {
                                      const updated = currentGallery.filter(
                                        (_, idx) => idx !== slotIdx
                                      );
                                      setEditingService({
                                        ...editingService,
                                        primaryImage: updated[0],
                                        galleryImages: updated,
                                      });
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="aspect-[4/3] w-full rounded bg-[#F8F7FA] border border-slate-200/80 overflow-hidden">
                              <ProductVisual
                                visualKey={slotKey}
                                alt={`Service slot ${slotIdx + 1}`}
                              />
                            </div>

                            {slotIdx !== 0 && (
                              <button
                                type="button"
                                data-testid={`admin-service-set-primary-${slotIdx}`}
                                onClick={() => {
                                  const selected = currentGallery[slotIdx];
                                  const rest = currentGallery.filter(
                                    (_, idx) => idx !== slotIdx
                                  );
                                  const updated = [selected, ...rest];
                                  setEditingService({
                                    ...editingService,
                                    primaryImage: selected,
                                    galleryImages: updated,
                                  });
                                }}
                                className="w-full py-1 px-2 rounded bg-[#8E4DEB]/10 hover:bg-[#8E4DEB] text-[#8E4DEB] hover:text-white text-[10px] font-extrabold transition-colors cursor-pointer"
                              >
                                {isAr
                                  ? 'تعيين كصورة غلاف رئيسية'
                                  : 'Set as Primary Cover'}
                              </button>
                            )}

                            <input
                              type="text"
                              dir="ltr"
                              data-testid={`admin-service-input-${slotIdx}`}
                              value={slotKey}
                              onChange={(e) => {
                                const updated = [...currentGallery];
                                updated[slotIdx] = e.target.value;
                                setEditingService({
                                  ...editingService,
                                  primaryImage:
                                    slotIdx === 0
                                      ? e.target.value
                                      : updated[0],
                                  galleryImages: updated,
                                });
                              }}
                              className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-mono-num"
                            />
                            <select
                              value={slotKey}
                              data-testid={`admin-service-select-${slotIdx}`}
                              onChange={(e) => {
                                const updated = [...currentGallery];
                                updated[slotIdx] = e.target.value;
                                setEditingService({
                                  ...editingService,
                                  primaryImage:
                                    slotIdx === 0
                                      ? e.target.value
                                      : updated[0],
                                  galleryImages: updated,
                                });
                              }}
                              className="w-full px-1.5 py-1 rounded border border-slate-200 text-[10px] font-mono-num bg-slate-50"
                            >
                              {VISUAL_KEY_PRESETS.map((grp) => (
                                <optgroup key={grp.group} label={grp.group}>
                                  {grp.keys.map((k) => (
                                    <option key={k} value={k}>
                                      {k}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Badge, Turnaround Note & Icon Key */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'الشارة (عربي)' : 'Badge (AR)'}
                      </label>
                      <input
                        type="text"
                        value={editingService.badge.ar}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            badge: {
                              ...editingService.badge,
                              ar: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'الشارة (EN)' : 'Badge (EN)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={editingService.badge.en}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            badge: {
                              ...editingService.badge,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'أيقونة الخدمة (Icon Key)' : 'Icon Key'}
                      </label>
                      <select
                        value={editingService.iconKey}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            iconKey: e.target.value as StoreService['iconKey'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono-num"
                      >
                        <option value="cooling">cooling</option>
                        <option value="maintenance">maintenance</option>
                        <option value="cameras">cameras</option>
                        <option value="custom">custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'ملاحظة مدة التنفيذ (عربي)' : 'Turnaround Note (AR)'}
                      </label>
                      <input
                        type="text"
                        value={editingService.turnaroundNote.ar}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            turnaroundNote: {
                              ...editingService.turnaroundNote,
                              ar: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'ملاحظة مدة التنفيذ (EN)' : 'Turnaround Note (EN)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={editingService.turnaroundNote.en}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            turnaroundNote: {
                              ...editingService.turnaroundNote,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.isActive}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            isActive: e.target.checked,
                          })
                        }
                        className="rounded text-[#8E4DEB]"
                      />
                      <span>
                        {lang === 'ar'
                          ? 'مفعلة في واجهة المتجر (Active)'
                          : 'Active on Storefront'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.isFeatured}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="rounded text-[#8E4DEB]"
                      />
                      <span>
                        {lang === 'ar' ? 'خدمة مميزة (Featured)' : 'Featured'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.showInNavbarShortcut}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            showInNavbarShortcut: e.target.checked,
                          })
                        }
                        className="rounded text-[#8E4DEB]"
                      />
                      <span>
                        {isAr
                          ? 'إظهار كاختصار في شريط التنقل'
                          : 'Show in Navbar Shortcut'}
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold cursor-pointer"
                    >
                      {lang === 'ar' ? 'حفظ الخدمة' : 'Save Service'}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 gap-4">
                {services.map((srv) => {
                  const srvGallery = getServiceGalleryImages(srv);
                  return (
                    <div
                      key={srv.id}
                      data-testid={`admin-service-row-${srv.id}`}
                      className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 max-w-2xl">
                        <div className="w-20 h-14 rounded-lg bg-[#F8F7FA] border border-slate-200 overflow-hidden shrink-0">
                          <ProductVisual
                            visualKey={srvGallery[0]}
                            alt={srv.title[lang]}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-extrabold text-[#111318]">
                              {srv.title[lang]}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              <Images className="w-3 h-3 text-[#8E4DEB]" />
                              {srvGallery.length}/5
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                srv.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {srv.isActive
                                ? lang === 'ar'
                                  ? 'نشطة'
                                  : 'Active'
                                : lang === 'ar'
                                ? 'مخفية'
                                : 'Inactive'}
                            </span>
                            {srv.id === 'service-cooling' && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-bold">
                                {lang === 'ar'
                                  ? 'مرتبطة بتبويب حلول التبريد في الشريط العلوي'
                                  : 'Linked to Top Navbar Cooling Tab'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#8E4DEB]">
                            {srv.summary?.[lang] || srv.subtitle[lang]}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {srv.description[lang]}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onSaveService({ ...srv, isActive: !srv.isActive });
                            showToast(
                              'تم تحديث حالة الخدمة',
                              'Service status updated'
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#8E4DEB] text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          {srv.isActive
                            ? lang === 'ar'
                              ? 'إخفاء مؤقت'
                              : 'Disable'
                            : lang === 'ar'
                            ? 'تفعيل'
                            : 'Enable'}
                        </button>

                        <button
                          type="button"
                          data-testid={`admin-edit-service-${srv.id}`}
                          onClick={() => setEditingService({ ...srv })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#111318] text-[#111318] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                        </button>

                        {srv.id !== 'service-cooling' && (
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteService(srv.id);
                              showToast('تم حذف الخدمة', 'Service deleted');
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title={
                              lang === 'ar' ? 'حذف الخدمة' : 'Delete Service'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
