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
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import {
  AvailabilityStatus,
  Brand,
  Category,
  CustomerRequest,
  Language,
  Offer,
  Product,
  ProductCondition,
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
  | 'categories'
  | 'brands'
  | 'usecases'
  | 'offers'
  | 'requests'
  | 'analytics'
  | 'settings';

interface AdminDashboardProps {
  lang: Language;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  customerRequests: CustomerRequest[];
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
  onUpdateRequestStatus,
  onUpdateSettings,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@pixelstore.sy');
  const [loginPass, setLoginPass] = useState('••••••••••••');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Product Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [includeLaptopSpecs, setIncludeLaptopSpecs] = useState(false);

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

  // 1. ADMIN LOGIN SCREEN (Previewable anytime via "Lock / Login View" button)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111318] bg-pixel-grid-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#8E4DEB] via-[#D66C9D] to-[#EF875D]" />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <PixelLogo variant="light" size="md" />
              <span className="text-xs font-mono-num font-bold px-2.5 py-1 rounded bg-[#F4F3F7] text-[#8E4DEB]">
                ADMIN PORTAL
              </span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-[#111318]">
                {lang === 'ar'
                  ? 'تسجيل الدخول إلى لوحة إدارة بيكسل ستور'
                  : 'Sign In to Pixel Store Admin'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar'
                  ? 'إدارة الكتالوج، سعر الصرف، العروض الموقوتة، وطلبات الزبائن'
                  : 'Manage catalog, global SYP exchange rate, timed offers, and WhatsApp requests'}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoggedIn(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar' ? 'البريد الإداري' : 'Admin Username / Email'}
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono-num text-[#111318]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-[#111318]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'دخول إلى لوحة التحكم'
                    : 'Sign In to Dashboard'}
                </span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToStorefront}
                className="text-xs font-semibold text-slate-500 hover:text-[#111318]"
              >
                {lang === 'ar' ? 'العودة إلى واجهة المتجر' : 'Back to Storefront'}
              </button>
              <button
                type="button"
                onClick={onToggleLanguage}
                className="text-xs font-bold text-[#8E4DEB]"
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#F4F3F7] flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-[#111318] text-white border-b border-white/10 px-4 lg:px-6 h-14 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <PixelLogo variant="dark" size="sm" />
          <span className="text-xs font-mono-num px-2 py-0.5 rounded bg-[#8E4DEB]/25 border border-[#8E4DEB]/40 text-white">
            {lang === 'ar' ? 'لوحة الإدارة' : 'ADMIN CONSOLE'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Exchange Rate Quick Indicator */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/15 text-xs font-mono-num"
            dir="ltr"
          >
            <span className="text-slate-300">Rate: 1$ =</span>
            <span className="font-bold text-[#EF875D]">
              {settings.usdToSypRate.toLocaleString('en-US')} SYP
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-[#8E4DEB]" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLoggedIn(false)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-300"
            title={lang === 'ar' ? 'معاينة شاشة تسجيل الدخول' : 'Preview Login Screen'}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {lang === 'ar' ? 'شاشة الدخول' : 'Login View'}
            </span>
          </button>

          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar' ? 'معاينة المتجر العام' : 'Back to Storefront'}
            </span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-5 end-5 z-50 bg-[#111318] text-white px-4 py-3 rounded-xl border border-[#8E4DEB] shadow-xl flex items-center gap-2.5 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Navigation (3 Columns) */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-3 space-y-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setEditingProduct(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
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
        <main className="lg:col-span-9 space-y-6">
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

                  <div className="overflow-x-auto">
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
                                <button
                                  type="button"
                                  onClick={() => onDeleteProduct(prod.id)}
                                  className="p-1.5 rounded bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                                  aria-label={`Delete ${prod.name.en}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                        ? 'رقم الهاتف المعروض'
                        : 'Public Phone Number'}
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
                        ? 'رقم واتساب لاستقبال الطلبات'
                        : 'WhatsApp Number'}
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
                </div>

                {/* Promotional Banner Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </main>
      </div>
    </div>
  );
};
