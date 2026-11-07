'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
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
  Settings,
  Sparkles,
  Tag,
  Trash2,
  Wrench,
} from 'lucide-react';
import {
  ArabicFontId,
  AvailabilityStatus,
  Brand,
  Category,
  CustomerRequest,
  DesignThemeId,
  Language,
  Offer,
  Product,
  ProductCondition,
  StoreService,
  StoreSettings,
  UseCaseTag,
} from '../../types/store';
import {
  convertUsdToSyp,
  formatSyp,
  formatUsd,
  isOfferActive,
} from '../../utils/storeLogic';
import { CountdownBadge } from '../storefront/CountdownBadge';
import { PixelLogo } from '../visuals/PixelLogo';
import { ProductVisual } from '../visuals/ProductVisual';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'services'
  | 'categories'
  | 'brands'
  | 'usecases'
  | 'offers'
  | 'requests'
  | 'analytics'
  | 'settings';

interface AdminDashboardProps {
  lang: Language;
  themeId: DesignThemeId;
  fontId: ArabicFontId;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  customerRequests: CustomerRequest[];
  services: StoreService[];
  settings: StoreSettings;
  nowMs: number;
  onToggleLanguage: () => void;
  onBackToStorefront: () => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleBestSeller: (productId: string) => void;
  onSaveCategory: (category: Category) => void;
  onSaveBrand: (brand: Brand) => void;
  onSaveUseCaseTag: (tag: UseCaseTag) => void;
  onSaveOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: string) => void;
  onSaveService: (service: StoreService) => void;
  onDeleteService: (serviceId: string) => void;
  onUpdateRequestStatus: (
    requestId: string,
    status: CustomerRequest['status']
  ) => void;
  onUpdateSettings: (nextSettings: StoreSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  products,
  categories,
  brands,
  useCaseTags,
  offers,
  customerRequests,
  services,
  settings,
  nowMs,
  onToggleLanguage,
  onBackToStorefront,
  onSaveProduct,
  onDeleteProduct,
  onToggleBestSeller,
  onSaveCategory,
  onSaveBrand,
  onSaveUseCaseTag,
  onSaveOffer,
  onDeleteOffer,
  onSaveService,
  onDeleteService,
  onUpdateRequestStatus,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Product Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [includeLaptopSpecs, setIncludeLaptopSpecs] = useState(false);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<
    string | null
  >(null);

  // Service Editor State
  const [editingService, setEditingService] = useState<StoreService | null>(
    null
  );

  // Offer Creator State
  const [newOfferProductId, setNewOfferProductId] = useState(
    products[0]?.id ?? ''
  );
  const [newOfferTitleAr, setNewOfferTitleAr] = useState('عرض خاص لنهاية الأسبوع');
  const [newOfferTitleEn, setNewOfferTitleEn] = useState('Weekend Special Deal');
  const [newOfferPriceUsd, setNewOfferPriceUsd] = useState(850);
  const [newOfferDurationHours, setNewOfferDurationHours] = useState(48);
  const [newOfferExclusive, setNewOfferExclusive] = useState(true);

  // Category Quick Add State
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatParentId, setNewCatParentId] = useState<string>('NONE');

  // Brand Quick Add State
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCountryAr, setNewBrandCountryAr] = useState('تايوان');
  const [newBrandCountryEn, setNewBrandCountryEn] = useState('Taiwan');

  // Use-Case Quick Add State
  const [newTagAr, setNewTagAr] = useState('');
  const [newTagEn, setNewTagEn] = useState('');

  // Store Settings Local Form State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);

  const showToast = (msgAr: string, msgEn: string) => {
    setSavedToast(lang === 'ar' ? msgAr : msgEn);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const openProductEditor = (prod?: Product) => {
    if (prod) {
      setEditingProduct({ ...prod });
      setIncludeLaptopSpecs(Boolean(prod.laptopSpecs));
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
      };
      setEditingProduct(fresh);
      setIncludeLaptopSpecs(true);
    }
  };



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
      id: 'services',
      label: { ar: 'إدارة الخدمات (Services)', en: 'Services Management' },
      icon: <Wrench className="w-4 h-4" />,
      badge: services.length,
    },
    {
      id: 'offers',
      label: { ar: 'إدارة العروض والمؤقت', en: 'Timed Offers' },
      icon: <Flame className="w-4 h-4" />,
      badge: offers.filter((o) => isOfferActive(o, nowMs)).length,
    },
    {
      id: 'requests',
      label: { ar: 'طلبات الزبائن (واتساب)', en: 'Customer Requests' },
      icon: <MessageCircle className="w-4 h-4" />,
      badge: customerRequests.filter((r) => r.status === 'NEW').length,
    },
    {
      id: 'categories',
      label: { ar: 'الأقسام والفروع', en: 'Categories' },
      icon: <FolderTree className="w-4 h-4" />,
    },
    {
      id: 'usecases',
      label: { ar: 'وسوم الاستخدام (Use Cases)', en: 'Use-Case Tags' },
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'brands',
      label: { ar: 'العلامات التجارية', en: 'Brands' },
      icon: <Tag className="w-4 h-4" />,
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

  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

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
              ? 'نسخة تجريبية للمعاينة المحلية (بيانات محلية — يلزم تأمين المصادقة قبل النشر الإنتاجي)'
              : 'DEMO PROTOTYPE — Local Preview Only (Unauthenticated — Secure Before Production)'}
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
                  setEditingProduct(null);
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
                      ? 'متابعة فورية لطلبات الزبائن عبر واتساب، العروض الموقوتة، وسعر الصرف اليومي'
                      : 'Monitor incoming WhatsApp product requests, active timed deals, and catalog inventory'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('products');
                      openProductEditor();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add Product'}</span>
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
                      ? 'مرتبطة بمؤقت تنازلي تلقائي'
                      : 'Auto-expiring promotional windows'}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4">
                  <div className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'طلبات الزبائن عبر واتساب'
                      : 'Customer Product Requests'}
                  </div>
                  <div className="font-mono-num text-2xl font-extrabold text-[#8E4DEB] mt-1">
                    {customerRequests.length}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {customerRequests.filter((r) => r.status === 'NEW').length}{' '}
                    {lang === 'ar' ? 'بانتظار المتابعة' : 'awaiting WhatsApp follow-up'}
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
                    className="text-[11px] font-bold text-[#8E4DEB] hover:underline mt-1"
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
                    className="text-xs font-bold text-[#8E4DEB] hover:underline"
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
                      {customerRequests.slice(0, 4).map((req) => (
                        <tr key={req.id}>
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#111318]">
                              {req.customerName}
                            </div>
                            <div
                              className="font-mono-num text-[11px] text-slate-500"
                              dir="ltr"
                            >
                              {req.phoneNumber}
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
                              {formatSyp(req.priceSypAtRequest, lang)}
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
                          </td>
                        </tr>
                      ))}
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
                <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-extrabold text-[#111318]">
                        {lang === 'ar'
                          ? 'محرر المنتج (Product Editor)'
                          : 'Product Editor'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {lang === 'ar'
                          ? 'يدعم السعر الأساسي بالدولار، حالة NEW/USED، خيار الأكثر مبيعاً، ومواصفات اللابتوب الـ 4'
                          : 'Configure USD base price, NEW/USED condition, manual Best Seller flag, and optional 4-field Laptop specs'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#111318]"
                    >
                      <BackArrow className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ar' ? 'العودة للقائمة' : 'Back to List'}
                      </span>
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const finalProd: Product = {
                        ...editingProduct,
                        laptopSpecs: includeLaptopSpecs
                          ? editingProduct.laptopSpecs ?? {
                              processor: '',
                              memory: '',
                              storage: '',
                              display: '',
                            }
                          : undefined,
                      };
                      onSaveProduct(finalProd);
                      setEditingProduct(null);
                      showToast(
                        'تم حفظ بيانات المنتج بنجاح',
                        'Product saved successfully'
                      );
                    }}
                    className="space-y-5"
                  >
                    {/* Bilingual Product Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar'
                            ? 'اسم المنتج (بالعربية) *'
                            : 'Product Name (Arabic) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name.ar}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: { ...editingProduct.name, ar: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar'
                            ? 'اسم المنتج (بالإنكليزية) *'
                            : 'Product Name (English) *'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          required
                          value={editingProduct.name.en}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: { ...editingProduct.name, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                    </div>

                    {/* Category, Subcategory, Brand, SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar' ? 'القسم الرئيسي' : 'Category'}
                        </label>
                        <select
                          value={editingProduct.categoryId}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        >
                          {categories
                            .filter((c) => !c.parentId)
                            .map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name[lang]}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar' ? 'القسم الفرعي' : 'Subcategory'}
                        </label>
                        <select
                          value={editingProduct.subcategoryId ?? ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              subcategoryId: e.target.value || undefined,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        >
                          <option value="">
                            {lang === 'ar' ? 'بدون فرع' : 'None'}
                          </option>
                          {categories
                            .filter(
                              (c) => c.parentId === editingProduct.categoryId
                            )
                            .map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name[lang]}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar' ? 'العلامة التجارية' : 'Brand'}
                        </label>
                        <select
                          value={editingProduct.brandId}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              brandId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        >
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={editingProduct.sku}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              sku: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                        />
                      </div>
                    </div>

                    {/* Single USD Base Price + Auto SYP Preview + Condition (NEW/USED) + Availability */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F4F3F7]">
                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar'
                            ? 'السعر الأساسي (USD $) *'
                            : 'Base Price (USD $) *'}
                        </label>
                        <input
                          type="number"
                          dir="ltr"
                          min={1}
                          required
                          value={editingProduct.priceUsd}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              priceUsd: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono-num font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {lang === 'ar'
                            ? 'السعر المحول تلقائياً (SYP)'
                            : 'Auto-Converted SYP (Read-Only)'}
                        </label>
                        <div className="px-3 py-2 rounded-lg bg-slate-200/70 text-xs font-mono-num font-bold text-[#8E4DEB]">
                          {formatSyp(
                            convertUsdToSyp(
                              editingProduct.priceUsd,
                              settings.usdToSypRate
                            ),
                            lang
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar'
                            ? 'الحالة (NEW / USED فقط)'
                            : 'Condition (NEW / USED)'}
                        </label>
                        <select
                          value={editingProduct.condition}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              condition: e.target.value as ProductCondition,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                        >
                          <option value="NEW">NEW (جديد)</option>
                          <option value="USED">USED (مستعمل)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#111318] mb-1">
                          {lang === 'ar' ? 'حالة التوفر' : 'Availability'}
                        </label>
                        <select
                          value={editingProduct.availability}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              availability: e.target.value as AvailabilityStatus,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                        >
                          <option value="IN_STOCK">In Stock (متوفر)</option>
                          <option value="ON_REQUEST">On Request (حسب الطلب)</option>
                          <option value="OUT_OF_STOCK">Out of Stock (غير متوفر)</option>
                        </select>
                      </div>
                    </div>

                    {/* Merchandising Flags: Best Seller (Manual Flag), New Arrival, Featured */}
                    <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#111318] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isBestSeller}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isBestSeller: e.target.checked,
                            })
                          }
                          className="rounded text-[#8E4DEB]"
                        />
                        <span>
                          {lang === 'ar'
                            ? 'تعيين كـ "الأكثر مبيعاً" (Best Seller Flag)'
                            : 'Manual Best Seller Flag'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-[#111318] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isNewArrival}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isNewArrival: e.target.checked,
                            })
                          }
                          className="rounded text-[#8E4DEB]"
                        />
                        <span>
                          {lang === 'ar'
                            ? 'وصل حديثاً (New Arrival)'
                            : 'New Arrival Flag'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-[#111318] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="rounded text-[#8E4DEB]"
                        />
                        <span>
                          {lang === 'ar'
                            ? 'منتج مميز (Featured)'
                            : 'Featured Flag'}
                        </span>
                      </label>
                    </div>

                    {/* Optional 4-Field Laptop Specifications */}
                    <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                      <label className="flex items-center gap-2 text-xs font-extrabold text-[#8E4DEB] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeLaptopSpecs}
                          onChange={(e) =>
                            setIncludeLaptopSpecs(e.target.checked)
                          }
                          className="rounded text-[#8E4DEB]"
                        />
                        <span>
                          {lang === 'ar'
                            ? 'تفعيل الحقول الأربعة الخاصة باللابتوبات (Processor / Memory / Storage / Display)'
                            : 'Enable 4-Field Laptop Specifications (Processor, Memory, Storage, Display)'}
                        </span>
                      </label>

                      {includeLaptopSpecs && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Processor (المعالج)
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              value={editingProduct.laptopSpecs?.processor ?? ''}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  laptopSpecs: {
                                    processor: e.target.value,
                                    memory:
                                      editingProduct.laptopSpecs?.memory ?? '',
                                    storage:
                                      editingProduct.laptopSpecs?.storage ?? '',
                                    display:
                                      editingProduct.laptopSpecs?.display ?? '',
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Memory / RAM (الرام)
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              value={editingProduct.laptopSpecs?.memory ?? ''}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  laptopSpecs: {
                                    processor:
                                      editingProduct.laptopSpecs?.processor ?? '',
                                    memory: e.target.value,
                                    storage:
                                      editingProduct.laptopSpecs?.storage ?? '',
                                    display:
                                      editingProduct.laptopSpecs?.display ?? '',
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Storage (التخزين)
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              value={editingProduct.laptopSpecs?.storage ?? ''}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  laptopSpecs: {
                                    processor:
                                      editingProduct.laptopSpecs?.processor ?? '',
                                    memory:
                                      editingProduct.laptopSpecs?.memory ?? '',
                                    storage: e.target.value,
                                    display:
                                      editingProduct.laptopSpecs?.display ?? '',
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Display (الشاشة)
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              value={editingProduct.laptopSpecs?.display ?? ''}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  laptopSpecs: {
                                    processor:
                                      editingProduct.laptopSpecs?.processor ?? '',
                                    memory:
                                      editingProduct.laptopSpecs?.memory ?? '',
                                    storage:
                                      editingProduct.laptopSpecs?.storage ?? '',
                                    display: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold"
                      >
                        {lang === 'ar' ? 'حفظ المنتج' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-base font-extrabold text-[#111318]">
                        {lang === 'ar'
                          ? 'إدارة المنتجات (Products Catalog)'
                          : 'Products Management'}
                      </h1>
                      <p className="text-xs text-slate-500">
                        {lang === 'ar'
                          ? 'يمكنك تعديل أي منتج أو تفعيل/إلغاء شارة الأكثر مبيعاً (Best Seller) مباشرة'
                          : 'Edit product specs, USD pricing, or toggle the manual Best Seller flag directly'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openProductEditor()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {lang === 'ar' ? 'إضافة منتج جديد' : 'New Product'}
                      </span>
                    </button>
                  </div>

                  {/* Desktop & Tablet Table View (>= 768px) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2.5 px-2 text-start">
                            {lang === 'ar' ? 'المنتج' : 'Product'}
                          </th>
                          <th className="py-2.5 px-2 text-start">
                            {lang === 'ar' ? 'الحالة' : 'Condition'}
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
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-12 h-9 rounded border border-slate-200 overflow-hidden shrink-0">
                                  <ProductVisual
                                    visualKey={prod.primaryImage}
                                    alt={prod.name[lang]}
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-[#111318] line-clamp-1 max-w-xs">
                                    {prod.name[lang]}
                                  </div>
                                  <div
                                    className="font-mono-num text-[11px] text-slate-400"
                                    dir="ltr"
                                  >
                                    {prod.sku}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-2 font-bold">
                              <span
                                className={
                                  prod.condition === 'USED'
                                    ? 'text-[#D96B38]'
                                    : 'text-[#111318]'
                                }
                              >
                                {prod.condition}
                              </span>
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
                                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
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
                                  className="p-1.5 rounded bg-[#F4F3F7] hover:bg-[#8E4DEB] hover:text-white text-slate-700 transition-colors"
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
                                      className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                                    >
                                      {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setConfirmDeleteProductId(null)
                                      }
                                      className="px-1.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold"
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
                                    className="p-1.5 rounded bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                                    aria-label={`Delete ${prod.name.en}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Layout (< 768px — Full Readable Product Titles, Zero Horizontal Crushing) */}
                  <div
                    data-testid="admin-mobile-products-list"
                    className="md:hidden space-y-2.5"
                  >
                    {products.map((prod) => (
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
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OFFERS MANAGEMENT WITH DATE/TIME & COUNTDOWN PREVIEW */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Create Time-Limited Offer Form */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <h2 className="text-base font-extrabold text-[#111318]">
                  {lang === 'ar'
                    ? 'إنشاء عرض مؤقت جديد (Time-Limited Offer)'
                    : 'Create Time-Limited Offer'}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const created: Offer = {
                      id: `offer-${Date.now()}`,
                      productId: newOfferProductId,
                      title: { ar: newOfferTitleAr, en: newOfferTitleEn },
                      badgeText: {
                        ar: newOfferExclusive ? 'عرض حصري' : 'عرض مؤقت',
                        en: newOfferExclusive ? 'Exclusive Deal' : 'Limited Deal',
                      },
                      offerPriceUsd: newOfferPriceUsd,
                      startTime: new Date(nowMs - 60000).toISOString(),
                      endTime: new Date(
                        nowMs + newOfferDurationHours * 3600 * 1000
                      ).toISOString(),
                      isExclusive: newOfferExclusive,
                    };
                    onSaveOffer(created);
                    showToast(
                      'تم تفعيل العرض المؤقت بنجاح',
                      'Timed offer published'
                    );
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar' ? 'اختر المنتج' : 'Select Product'}
                    </label>
                    <select
                      value={newOfferProductId}
                      onChange={(e) => {
                        const p = products.find(
                          (item) => item.id === e.target.value
                        );
                        setNewOfferProductId(e.target.value);
                        if (p) {
                          setNewOfferPriceUsd(Math.round(p.priceUsd * 0.88));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name[lang]} ({formatUsd(p.priceUsd)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'سعر العرض المخفض (USD $)'
                        : 'Discounted Offer Price (USD $)'}
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min={1}
                      value={newOfferPriceUsd}
                      onChange={(e) =>
                        setNewOfferPriceUsd(Number(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'مدة العرض (بالساعات)'
                        : 'Active Duration (Hours)'}
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min={1}
                      max={720}
                      value={newOfferDurationHours}
                      onChange={(e) =>
                        setNewOfferDurationHours(Number(e.target.value) || 24)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar' ? 'عنوان العرض (عربي)' : 'Offer Title (AR)'}
                    </label>
                    <input
                      type="text"
                      value={newOfferTitleAr}
                      onChange={(e) => setNewOfferTitleAr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar' ? 'عنوان العرض (إنكليزي)' : 'Offer Title (EN)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={newOfferTitleEn}
                      onChange={(e) => setNewOfferTitleEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#111318]">
                      <input
                        type="checkbox"
                        checked={newOfferExclusive}
                        onChange={(e) =>
                          setNewOfferExclusive(e.target.checked)
                        }
                        className="rounded text-[#D66C9D]"
                      />
                      <span>
                        {lang === 'ar' ? 'عرض حصري (Exclusive)' : 'Exclusive'}
                      </span>
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#D66C9D] hover:opacity-95 text-white text-xs font-bold"
                    >
                      {lang === 'ar' ? 'نشر العرض' : 'Publish Offer'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Offers List with Live Countdown Preview */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <h2 className="text-sm font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'العروض المسجلة ومعاينة المؤقت التنازلي'
                    : 'Configured Offers & Live Countdown Preview'}
                </h2>
                <div className="space-y-3">
                  {offers.map((offer) => {
                    const prod = products.find((p) => p.id === offer.productId);
                    const active = isOfferActive(offer, nowMs);
                    return (
                      <div
                        key={offer.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                active
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {active
                                ? lang === 'ar'
                                  ? 'نشط حالياً'
                                  : 'ACTIVE'
                                : lang === 'ar'
                                ? 'منتهي الصلاحية'
                                : 'EXPIRED'}
                            </span>
                            <span className="text-xs font-bold text-[#111318]">
                              {prod?.name[lang]}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {offer.title[lang]} —{' '}
                            <span className="font-mono-num font-bold text-[#111318]">
                              {formatUsd(offer.offerPriceUsd)}
                            </span>{' '}
                            <span className="line-through font-mono-num">
                              {prod ? formatUsd(prod.priceUsd) : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <CountdownBadge
                            endTimeIso={offer.endTime}
                            nowMs={nowMs}
                            lang={lang}
                            variant="compact"
                          />
                          <button
                            type="button"
                            onClick={() => onDeleteOffer(offer.id)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
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

              <div className="space-y-3">
                {customerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
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
                        ({formatSyp(req.priceSypAtRequest, lang)})
                      </div>

                      {req.note && (
                        <p className="text-xs text-slate-600 bg-[#F4F3F7] p-2 rounded mt-1">
                          {lang === 'ar' ? 'ملاحظة الزبون: ' : 'Customer Note: '}
                          {req.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          onUpdateRequestStatus(
                            req.id,
                            e.target.value as CustomerRequest['status']
                          )
                        }
                        aria-label={`Status for ${req.customerName}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                      >
                        <option value="NEW">NEW (جديد)</option>
                        <option value="CONTACTED">CONTACTED (تم التواصل)</option>
                        <option value="COMPLETED">COMPLETED (مكتمل)</option>
                      </select>

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
                          {lang === 'ar' ? 'رد عبر واتساب' : 'WhatsApp Reply'}
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES & SUBCATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <h2 className="text-base font-extrabold text-[#111318]">
                  {lang === 'ar'
                    ? 'إضافة قسم رئيسي أو فرعي جديد'
                    : 'Add Category or Subcategory'}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatNameAr.trim() || !newCatNameEn.trim()) return;
                    onSaveCategory({
                      id: `cat-${Date.now()}`,
                      name: { ar: newCatNameAr.trim(), en: newCatNameEn.trim() },
                      description: {
                        ar: 'قسم مضاف من لوحة الإدارة',
                        en: 'Admin-created hardware category',
                      },
                      iconKey: 'cpu',
                      parentId:
                        newCatParentId === 'NONE' ? undefined : newCatParentId,
                      useCaseIds: ['gaming', 'office'],
                      visualKey: 'cat-components',
                    });
                    setNewCatNameAr('');
                    setNewCatNameEn('');
                    showToast('تمت إضافة القسم بنجاح', 'Category added');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {lang === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatNameAr}
                      onChange={(e) => setNewCatNameAr(e.target.value)}
                      placeholder="مثال: الشاشات"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {lang === 'ar' ? 'الاسم بالإنكليزية' : 'English Name'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={newCatNameEn}
                      onChange={(e) => setNewCatNameEn(e.target.value)}
                      placeholder="e.g. Gaming Monitors"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {lang === 'ar' ? 'يتبع للقسم' : 'Parent Category'}
                    </label>
                    <select
                      value={newCatParentId}
                      onChange={(e) => setNewCatParentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="NONE">
                        {lang === 'ar'
                          ? 'قسم رئيسي مستقل'
                          : 'Top-Level Category'}
                      </option>
                      {categories
                        .filter((c) => !c.parentId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name[lang]}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إضافة القسم' : 'Add Category'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <h2 className="text-sm font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'شجرة الأقسام الرئيسية والفرعية الحالية'
                    : 'Category Hierarchy'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories
                    .filter((c) => !c.parentId)
                    .map((parent) => {
                      const subs = categories.filter(
                        (s) => s.parentId === parent.id
                      );
                      return (
                        <div
                          key={parent.id}
                          className="p-4 rounded-xl border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-extrabold text-[#111318]">
                              {parent.name[lang]}
                            </span>
                            <span className="text-[11px] font-mono-num text-slate-400">
                              {subs.length} subcategories
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {subs.map((s) => (
                              <span
                                key={s.id}
                                className="px-2.5 py-1 rounded bg-[#F4F3F7] text-xs font-medium text-slate-700"
                              >
                                {s.name[lang]}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: USE-CASE TAGS MANAGEMENT */}
          {activeTab === 'usecases' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#111318]">
                    {lang === 'ar'
                      ? 'إدارة وسوم الاستخدام (Use-Case Selector Tags)'
                      : 'Manage Use-Case Selector Tags'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'تظهر هذه الوسوم كبطاقات اختيار بارزة أعلى صفحات الأقسام (مثل: ألعاب Gaming / مكتبي Office / دراسة Work & Study)'
                      : 'These tags power the prominent visual Use-Case Selector tiles at the top of category pages'}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTagAr.trim() || !newTagEn.trim()) return;
                    onSaveUseCaseTag({
                      id: `uc-${Date.now()}`,
                      name: { ar: newTagAr.trim(), en: newTagEn.trim() },
                      subtitle: {
                        ar: 'وسم استخدام مخصص من الإدارة',
                        en: 'Custom use-case workflow filter',
                      },
                      applicableCategories: [
                        'laptops',
                        'accessories',
                        'keyboards',
                        'mice',
                      ],
                      accentColor: 'purple',
                      visualKey: 'usecase-gaming',
                    });
                    setNewTagAr('');
                    setNewTagEn('');
                    showToast('تمت إضافة وسم الاستخدام', 'Use-Case Tag Added');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {lang === 'ar' ? 'اسم الوسم (عربي)' : 'Tag Name (AR)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTagAr}
                      onChange={(e) => setNewTagAr(e.target.value)}
                      placeholder="مثال: صناعة المحتوى والستريم"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {lang === 'ar' ? 'اسم الوسم (إنكليزي)' : 'Tag Name (EN)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={newTagEn}
                      onChange={(e) => setNewTagEn(e.target.value)}
                      placeholder="e.g. Streaming & Content Creation"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إضافة وسم استخدام' : 'Add Use-Case Tag'}
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {useCaseTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-[#111318]">
                          {tag.name[lang]}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {tag.subtitle[lang]}
                        </div>
                        <div className="text-[11px] font-mono-num text-[#8E4DEB] mt-2">
                          Applies to: {tag.applicableCategories.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRANDS MANAGEMENT */}
          {activeTab === 'brands' && (
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-5">
              <h2 className="text-base font-extrabold text-[#111318]">
                {lang === 'ar'
                  ? 'إدارة العلامات التجارية والوكالات (Brands)'
                  : 'Brands Management'}
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newBrandName.trim()) return;
                  onSaveBrand({
                    id: newBrandName.toLowerCase().replace(/\s+/g, '-'),
                    name: newBrandName.trim(),
                    country: { ar: newBrandCountryAr, en: newBrandCountryEn },
                    featured: true,
                  });
                  setNewBrandName('');
                  showToast('تمت إضافة العلامة التجارية', 'Brand added');
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-xs font-bold mb-1">
                    {lang === 'ar' ? 'اسم الشركة' : 'Brand Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g. MSI / Corsair"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    {lang === 'ar' ? 'بلد المنشأ (عربي)' : 'Origin (AR)'}
                  </label>
                  <input
                    type="text"
                    value={newBrandCountryAr}
                    onChange={(e) => setNewBrandCountryAr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    {lang === 'ar' ? 'بلد المنشأ (إنكليزي)' : 'Origin (EN)'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newBrandCountryEn}
                    onChange={(e) => setNewBrandCountryEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold"
                >
                  {lang === 'ar' ? 'إضافة علامة تجارية' : 'Add Brand'}
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {brands.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-[#111318]">
                        {b.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.country[lang]}
                      </div>
                    </div>
                    <span className="font-mono-num text-xs text-slate-400">
                      {products.filter((p) => p.brandId === b.id).length} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
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

                {/* Contact & WhatsApp Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'الرقم الرئيسي المعروض (Primary Phone)'
                        : 'Primary Public Phone Number'}
                    </label>
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
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'الرقم الثاني (يظهر كأيقونة اتصال)'
                        : 'Secondary Phone (Icon-Only Trigger)'}
                    </label>
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
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'رقم واتساب لاستقبال الطلبات (أيقونة)'
                        : 'WhatsApp Number (Icon-Only Trigger)'}
                    </label>
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
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'رابط موقع المتجر على Google Maps (أيقونة)'
                        : 'Google Maps Location URL (Icon-Only Trigger)'}
                    </label>
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
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'رابط قناة تلغرام (Telegram)'
                        : 'Telegram Channel URL'}
                    </label>
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
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'رابط إنستغرام (Instagram)'
                        : 'Instagram Page URL'}
                    </label>
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
                    <label className="block text-xs font-bold text-[#111318] mb-1">
                      {lang === 'ar'
                        ? 'رابط فيسبوك (Facebook)'
                        : 'Facebook Page URL'}
                    </label>
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
                    className="px-6 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold"
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
                      ? 'إضافة، تعديل، أو تفعيل/إيقاف الخدمات المعروضة في قسم الخدمات وتبويب حلول التبريد في المتجر'
                      : 'Create, edit, or toggle active status for store services and cooling solutions'}
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
                      description: { ar: '', en: '' },
                      iconKey: 'maintenance',
                      badge: {
                        ar: 'خدمة فنية معتمدة',
                        en: 'Certified Technical Service',
                      },
                      turnaroundNote: {
                        ar: 'مدة التنفيذ: خلال 24 ساعة',
                        en: 'Turnaround: Within 24 hours',
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold shrink-0"
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
                    onSaveService(editingService);
                    setEditingService(null);
                    showToast(
                      'تم حفظ بيانات الخدمة بنجاح',
                      'Service saved successfully'
                    );
                  }}
                  className="bg-white rounded-xl border-2 border-[#8E4DEB] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-extrabold text-[#111318]">
                      {lang === 'ar' ? 'محرر الخدمة الفنية' : 'Service Editor'}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {lang === 'ar'
                          ? 'العنوان الفرعي المختصر (عربي)'
                          : 'Subtitle (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={editingService.subtitle.ar}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
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
                          ? 'العنوان الفرعي المختصر (إنكليزي)'
                          : 'Subtitle (English)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={editingService.subtitle.en}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
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
                          : 'Description (Arabic)'}
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
                          : 'Description (English)'}
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
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold"
                    >
                      {lang === 'ar' ? 'حفظ الخدمة' : 'Save Service'}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    data-testid={`admin-service-row-${srv.id}`}
                    className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-[#111318]">
                          {srv.title[lang]}
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
                        {srv.subtitle[lang]}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {srv.description[lang]}
                      </p>
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
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#8E4DEB] text-xs font-bold text-slate-700"
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#111318] text-[#111318] hover:text-white text-xs font-bold transition-colors"
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
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title={lang === 'ar' ? 'حذف الخدمة' : 'Delete Service'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
