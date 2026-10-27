import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AvailabilityStatus,
  Brand,
  Category,
  DesignThemeId,
  FilterState,
  Language,
  Offer,
  Product,
  ProductCondition,
  UseCaseTag,
} from '../../types/store';
import {
  filterAndSortProducts,
  formatUsd,
  resolveProductPricing,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';
import { ProductCard } from './ProductCard';
import { StorefrontView } from './StoreHeader';

interface CatalogPageProps {
  mode: 'shop' | 'category';
  lang: Language;
  themeId: DesignThemeId;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  filters: FilterState;
  onUpdateFilters: (next: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onNavigate: (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string,
    useCaseId?: string
  ) => void;
  onSelectProduct: (productId: string) => void;
  onRequestProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  lang,
  themeId,
  products,
  categories,
  brands,
  useCaseTags,
  offers,
  usdToSypRate,
  nowMs,
  filters,
  onUpdateFilters,
  onResetFilters,
  onNavigate,
  onSelectProduct,
  onRequestProduct,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const topCategories = categories.filter((c) => !c.parentId);
  const activeParentCategory = categories.find(
    (c) => c.id === filters.categoryId
  );
  const activeSubcategory = categories.find(
    (c) => c.id === filters.subcategoryId
  );

  // Subcategories belonging to the currently selected parent category
  const childSubcategories =
    filters.categoryId !== 'ALL'
      ? categories.filter((c) => c.parentId === filters.categoryId)
      : [];

  // Relevant Use-Case Tags for the current category or subcategory
  const targetCatOrSubId =
    filters.subcategoryId !== 'ALL'
      ? filters.subcategoryId
      : filters.categoryId;

  const relevantUseCases =
    targetCatOrSubId === 'ALL'
      ? useCaseTags
      : useCaseTags.filter(
          (u) =>
            u.applicableCategories.includes(targetCatOrSubId) ||
            (activeParentCategory &&
              u.applicableCategories.includes(activeParentCategory.id))
        );

  const filteredProducts = filterAndSortProducts(
    products,
    offers,
    usdToSypRate,
    filters,
    nowMs
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Latest 5 products for the compact sidebar panel
  const latestSidebarProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const toggleBrand = (brandId: string) => {
    const exists = filters.brandIds.includes(brandId);
    const next = exists
      ? filters.brandIds.filter((id) => id !== brandId)
      : [...filters.brandIds, brandId];
    onUpdateFilters({ brandIds: next });
    setCurrentPage(1);
  };

  const toggleCondition = (cond: ProductCondition) => {
    const exists = filters.conditions.includes(cond);
    const next = exists
      ? filters.conditions.filter((c) => c !== cond)
      : [...filters.conditions, cond];
    onUpdateFilters({ conditions: next });
    setCurrentPage(1);
  };

  const toggleAvailability = (avail: AvailabilityStatus) => {
    const exists = filters.availabilities.includes(avail);
    const next = exists
      ? filters.availabilities.filter((a) => a !== avail)
      : [...filters.availabilities, avail];
    onUpdateFilters({ availabilities: next });
    setCurrentPage(1);
  };

  // Reusable Filter Controls Block (shared between Desktop Sidebar and Mobile Drawer)
  const renderFiltersPanel = () => (
    <div className="space-y-5">
      {/* Header + Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm font-bold text-[#111318]">
          <Filter className="w-4 h-4 text-[#8E4DEB]" />
          <span>{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            onResetFilters();
            setCurrentPage(1);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8E4DEB] hover:text-[#111318] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider mb-2.5">
          {lang === 'ar' ? 'القسم الرئيسي' : 'Category'}
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              onUpdateFilters({
                categoryId: 'ALL',
                subcategoryId: 'ALL',
                useCaseId: 'ALL',
              });
              setCurrentPage(1);
            }}
            className={`w-full text-start px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-between ${
              filters.categoryId === 'ALL'
                ? 'bg-[#8E4DEB] text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>{lang === 'ar' ? 'كل الأقسام' : 'All Categories'}</span>
            <span className="font-mono-num text-[11px] opacity-80">
              {products.length}
            </span>
          </button>

          {topCategories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const active = filters.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onUpdateFilters({
                    categoryId: cat.id,
                    subcategoryId: 'ALL',
                    useCaseId: 'ALL',
                  });
                  setCurrentPage(1);
                }}
                className={`w-full text-start px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#8E4DEB] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name[lang]}</span>
                <span className="font-mono-num text-[11px] opacity-80">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Filter (Strictly NEW or USED) */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider mb-2.5">
          {lang === 'ar' ? 'حالة المنتج' : 'Condition'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(['NEW', 'USED'] as ProductCondition[]).map((cond) => {
            const checked = filters.conditions.includes(cond);
            return (
              <button
                key={cond}
                type="button"
                onClick={() => toggleCondition(cond)}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  checked
                    ? 'bg-[#111318] border-[#111318] text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#8E4DEB]'
                }`}
              >
                {checked && <Check className="w-3.5 h-3.5 text-[#EF875D]" />}
                <span>
                  {cond === 'NEW'
                    ? lang === 'ar'
                      ? 'جديد (NEW)'
                      : 'NEW'
                    : lang === 'ar'
                    ? 'مستعمل (USED)'
                    : 'USED'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* USD Price Range Filter */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider mb-2.5">
          {lang === 'ar' ? 'نطاق السعر (USD $)' : 'Price Range (USD)'}
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-2.5" dir="ltr">
          <div>
            <label htmlFor="min-price-input" className="block text-[10px] text-slate-500 mb-1">
              {lang === 'ar' ? 'من ($)' : 'Min ($)'}
            </label>
            <input
              id="min-price-input"
              type="number"
              min={0}
              max={3000}
              value={filters.minPriceUsd}
              onChange={(e) => {
                onUpdateFilters({ minPriceUsd: Number(e.target.value) || 0 });
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 font-mono-num text-xs text-[#111318]"
            />
          </div>
          <div>
            <label htmlFor="max-price-input" className="block text-[10px] text-slate-500 mb-1">
              {lang === 'ar' ? 'إلى ($)' : 'Max ($)'}
            </label>
            <input
              id="max-price-input"
              type="number"
              min={0}
              max={5000}
              value={filters.maxPriceUsd}
              onChange={(e) => {
                onUpdateFilters({ maxPriceUsd: Number(e.target.value) || 5000 });
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 font-mono-num text-xs text-[#111318]"
            />
          </div>
        </div>
        {/* Quick Price Range Presets */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '< $100', min: 0, max: 100 },
            { label: '$100 – $500', min: 100, max: 500 },
            { label: '$500+', min: 500, max: 5000 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onUpdateFilters({
                  minPriceUsd: preset.min,
                  maxPriceUsd: preset.max,
                });
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded bg-[#F4F3F7] hover:bg-[#8E4DEB]/15 text-[11px] font-mono-num font-semibold text-slate-700 transition-colors"
              dir="ltr"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider mb-2.5">
          {lang === 'ar' ? 'العلامة التجارية (Brand)' : 'Brands'}
        </h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
          {brands.map((brand) => {
            const checked = filters.brandIds.includes(brand.id);
            const count = products.filter((p) => p.brandId === brand.id).length;
            return (
              <label
                key={brand.id}
                className="flex items-center justify-between gap-2 text-xs text-slate-700 cursor-pointer hover:text-[#111318] py-0.5"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brand.id)}
                    className="rounded border-slate-300 text-[#8E4DEB] focus:ring-[#8E4DEB]"
                  />
                  <span className={checked ? 'font-bold text-[#111318]' : ''}>
                    {brand.name}
                  </span>
                </span>
                <span className="font-mono-num text-[11px] text-slate-400">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider mb-2.5">
          {lang === 'ar' ? 'التوفر' : 'Availability'}
        </h3>
        <div className="space-y-1.5">
          {(
            [
              {
                id: 'IN_STOCK',
                ar: 'متوفر في الصالة (In Stock)',
                en: 'In Stock',
              },
              {
                id: 'ON_REQUEST',
                ar: 'متوفر حسب الطلب (On Request)',
                en: 'On Request',
              },
              {
                id: 'OUT_OF_STOCK',
                ar: 'نفد حالياً (Out of Stock)',
                en: 'Out of Stock',
              },
            ] as const
          ).map((item) => {
            const checked = filters.availabilities.includes(item.id);
            return (
              <label
                key={item.id}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAvailability(item.id)}
                  className="rounded border-slate-300 text-[#8E4DEB] focus:ring-[#8E4DEB]"
                />
                <span>{lang === 'ar' ? item.ar : item.en}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumb Navigation & Category Header */}
      <div
        className={`bg-white border border-slate-200/90 p-5 ${
          themeId === 'contrast' ? 'rounded-none border-slate-300' : 'rounded-lg'
        }`}
      >
        <nav
          className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 mb-2"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#8E4DEB] transition-colors"
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => {
              onUpdateFilters({
                categoryId: 'ALL',
                subcategoryId: 'ALL',
                useCaseId: 'ALL',
              });
            }}
            className="hover:text-[#8E4DEB] transition-colors"
          >
            {lang === 'ar' ? 'الكتالوج' : 'Catalog'}
          </button>
          {activeParentCategory && (
            <>
              <span>/</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    categoryId: activeParentCategory.id,
                    subcategoryId: 'ALL',
                  })
                }
                className={`hover:text-[#8E4DEB] transition-colors ${
                  !activeSubcategory ? 'font-bold text-[#111318]' : ''
                }`}
              >
                {activeParentCategory.name[lang]}
              </button>
            </>
          )}
          {activeSubcategory && (
            <>
              <span>/</span>
              <span className="font-bold text-[#111318]">
                {activeSubcategory.name[lang]}
              </span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111318]">
              {activeSubcategory
                ? activeSubcategory.name[lang]
                : activeParentCategory
                ? activeParentCategory.name[lang]
                : filters.onlyBestSellers
                ? lang === 'ar'
                  ? 'الأكثر مبيعاً (Best Sellers)'
                  : 'Best Sellers Collection'
                : filters.onlyNewArrivals
                ? lang === 'ar'
                  ? 'وصل حديثاً (New Arrivals)'
                  : 'New Arrivals Collection'
                : lang === 'ar'
                ? 'جميع المنتجات والعتاد التقني'
                : 'All Hardware & Electronics'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {activeSubcategory
                ? activeSubcategory.description[lang]
                : activeParentCategory
                ? activeParentCategory.description[lang]
                : lang === 'ar'
                ? 'تصفح مجموعة متجر بيكسل الكاملة مع إمكانية الفرز حسب الفئة، طبيعة الاستخدام (ألعاب / عمل مكتبي)، وحالة المنتج (جديد / مستعمل).'
                : 'Browse the complete Pixel Store catalog with instant use-case filtering (Gaming vs. Office) and dual USD/SYP pricing.'}
            </p>
          </div>

          {/* Quick Category Switcher Pills when in All-Shop mode */}
          {filters.categoryId === 'ALL' && (
            <div className="flex items-center flex-wrap gap-1.5">
              {topCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    onUpdateFilters({
                      categoryId: cat.id,
                      subcategoryId: 'ALL',
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#F4F3F7] hover:bg-[#8E4DEB] hover:text-white text-xs font-bold text-[#111318] transition-colors whitespace-nowrap shrink-0"
                >
                  {cat.name[lang]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LARGE IMAGE-LED VISUAL SUBCATEGORY SHORTCUTS (Midas Category Reference Inspiration) */}
        {childSubcategories.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {lang === 'ar'
                ? `الأقسام الفرعية داخل ${activeParentCategory?.name.ar ?? ''}`
                : `Subcategories in ${activeParentCategory?.name.en ?? ''}`}
            </div>
            <div
              className={`grid grid-cols-2 gap-3 ${
                childSubcategories.length + 1 <= 3
                  ? 'sm:grid-cols-3'
                  : childSubcategories.length + 1 === 4
                  ? 'sm:grid-cols-4'
                  : 'sm:grid-cols-4 lg:grid-cols-8'
              }`}
            >
              <button
                type="button"
                onClick={() => onUpdateFilters({ subcategoryId: 'ALL' })}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  filters.subcategoryId === 'ALL'
                    ? 'bg-[#111318] border-[#111318] text-white shadow-xs'
                    : 'bg-[#F8F7FA] border-slate-200/90 text-[#111318] hover:border-[#8E4DEB]'
                }`}
              >
                <div className="w-full max-w-[140px] aspect-[4/3] rounded bg-white mb-2 overflow-hidden border border-slate-200/60">
                  <ProductVisual
                    visualKey={
                      activeParentCategory?.visualKey ?? 'cat-components'
                    }
                    alt="All"
                  />
                </div>
                <span className="text-xs font-bold">
                  {lang === 'ar' ? 'عرض الكل' : 'View All'}
                </span>
              </button>

              {childSubcategories.map((sub) => {
                const isSelected = filters.subcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({
                        subcategoryId: isSelected ? 'ALL' : sub.id,
                      })
                    }
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-[#8E4DEB] border-[#8E4DEB] text-white shadow-xs'
                        : 'bg-[#F8F7FA] border-slate-200/90 text-[#111318] hover:border-[#8E4DEB]'
                    }`}
                  >
                    <div className="w-full max-w-[140px] aspect-[4/3] rounded bg-white mb-2 overflow-hidden border border-slate-200/60">
                      <ProductVisual
                        visualKey={sub.visualKey}
                        alt={sub.name[lang]}
                      />
                    </div>
                    <span className="text-xs font-bold line-clamp-1">
                      {sub.name[lang]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PROMINENT VISUAL USE-CASE SELECTOR TILES (Requirement #7: Gaming vs Office / Work-Study / Everyday) */}
        {relevantUseCases.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8E4DEB]" />
                <span className="text-xs font-bold text-[#111318] uppercase tracking-wider">
                  {lang === 'ar'
                    ? 'اختر حسب طبيعة الاستخدام (Use-Case Selector)'
                    : 'Select by Primary Use Case'}
                </span>
              </div>
              {filters.useCaseId !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ useCaseId: 'ALL' })}
                  className="text-xs font-semibold text-[#D66C9D] hover:underline"
                >
                  {lang === 'ar'
                    ? 'إلغاء فلتر الاستخدام'
                    : 'Clear Use-Case Selection'}
                </button>
              )}
            </div>

            <div
              className={`grid grid-cols-1 gap-3 ${
                relevantUseCases.length === 2
                  ? 'sm:grid-cols-2'
                  : relevantUseCases.length === 3
                  ? 'sm:grid-cols-3'
                  : 'sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {relevantUseCases.map((uc) => {
                const isSelected = filters.useCaseId === uc.id;
                return (
                  <button
                    key={uc.id}
                    type="button"
                    onClick={() => {
                      onUpdateFilters({
                        useCaseId: isSelected ? 'ALL' : uc.id,
                      });
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-start transition-all ${
                      isSelected
                        ? 'bg-[#111318] border-[#8E4DEB] text-white ring-2 ring-[#8E4DEB]/40'
                        : 'bg-[#F4F3F7]/80 border-slate-200/90 text-[#111318] hover:bg-white hover:border-[#8E4DEB]'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200/50 bg-white">
                      <ProductVisual
                        visualKey={uc.visualKey}
                        alt={uc.name[lang]}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold truncate">
                          {uc.name[lang]}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#EF875D] shrink-0" />
                        )}
                      </div>
                      <p
                        className={`text-[11px] line-clamp-1 mt-0.5 ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {uc.subtitle[lang]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Split: Desktop Left Sidebar (Filters + Compact Latest Products) & Dense Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar (3 Columns) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4">
            {renderFiltersPanel()}
          </div>

          {/* Compact Latest Products Sidebar Panel (Inspired by Midas Category Page Reference) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <span className="w-2 h-2 bg-[#8E4DEB]" />
              <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider">
                {lang === 'ar' ? 'أحدث المنتجات المضافة' : 'Latest Products'}
              </h3>
            </div>
            <div className="space-y-3">
              {latestSidebarProducts.map((lp) => {
                const lpPrice = resolveProductPricing(
                  lp,
                  offers,
                  usdToSypRate,
                  nowMs
                );
                return (
                  <button
                    key={lp.id}
                    type="button"
                    onClick={() => onSelectProduct(lp.id)}
                    className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#F4F3F7] transition-colors text-start group"
                  >
                    <div className="w-14 h-11 rounded bg-[#F8F7FA] border border-slate-200/80 shrink-0 overflow-hidden">
                      <ProductVisual
                        visualKey={lp.primaryImage}
                        alt={lp.name[lang]}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#111318] group-hover:text-[#8E4DEB] line-clamp-1">
                        {lp.name[lang]}
                      </div>
                      <div
                        className="font-mono-num text-xs font-bold text-[#8E4DEB] mt-0.5"
                        dir="ltr"
                      >
                        {formatUsd(lpPrice.effectiveUsd)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Product Catalog Area (9 Columns on Desktop) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Toolbar: Search Within View, Active Filter Chips, Count, & Sort */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111318] text-white text-xs font-bold shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الفلاتر' : 'Filters'}</span>
              </button>

              {/* Inline Quick Search Input */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={filters.searchQuery}
                  onChange={(e) => {
                    onUpdateFilters({ searchQuery: e.target.value });
                    setCurrentPage(1);
                  }}
                  placeholder={
                    lang === 'ar'
                      ? 'تصفية سريعة بالاسم أو الموديل...'
                      : 'Filter by name or SKU...'
                  }
                  aria-label={lang === 'ar' ? 'تصفية بالاسم' : 'Filter by keyword'}
                  className="w-full ps-8 pe-3 py-1.5 rounded-lg bg-[#F4F3F7] border border-slate-200 text-xs text-[#111318] focus:bg-white focus:outline-none focus:border-[#8E4DEB]"
                />
              </div>

              <span className="text-xs text-slate-500 whitespace-nowrap">
                {lang === 'ar'
                  ? `النتائج: ${filteredProducts.length} منتج`
                  : `Showing ${filteredProducts.length} items`}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <label
                htmlFor="catalog-sort-select"
                className="text-xs font-semibold text-slate-600 whitespace-nowrap"
              >
                {lang === 'ar' ? 'الترتيب حسب:' : 'Sort by:'}
              </label>
              <select
                id="catalog-sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  onUpdateFilters({
                    sortBy: e.target.value as FilterState['sortBy'],
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#F4F3F7] border border-slate-200 text-xs font-bold text-[#111318] focus:outline-none focus:border-[#8E4DEB]"
              >
                <option value="featured">
                  {lang === 'ar' ? 'الأكثر تميزاً' : 'Featured'}
                </option>
                <option value="newest">
                  {lang === 'ar' ? 'الأحدث أولاً' : 'Newest Arrivals'}
                </option>
                <option value="price-asc">
                  {lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}
                </option>
                <option value="price-desc">
                  {lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}
                </option>
              </select>
            </div>
          </div>

          {/* Active Interactive Filter Removal Buttons */}
          {(filters.useCaseId !== 'ALL' ||
            filters.subcategoryId !== 'ALL' ||
            filters.brandIds.length > 0 ||
            filters.conditions.length > 0 ||
            filters.searchQuery.trim() !== '' ||
            filters.onlyBestSellers ||
            filters.onlyNewArrivals) && (
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'ar' ? 'الفلاتر النشطة:' : 'Active filters:'}
              </span>

              {filters.useCaseId !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ useCaseId: 'ALL' })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8E4DEB] text-white text-xs font-semibold"
                >
                  <span>
                    {
                      useCaseTags.find((u) => u.id === filters.useCaseId)?.name[
                        lang
                      ]
                    }
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {filters.subcategoryId !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ subcategoryId: 'ALL' })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111318] text-white text-xs font-semibold"
                >
                  <span>{activeSubcategory?.name[lang]}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {filters.conditions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCondition(c)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 text-xs font-semibold text-[#111318]"
                >
                  <span>{c}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {filters.brandIds.map((bId) => (
                <button
                  key={bId}
                  type="button"
                  onClick={() => toggleBrand(bId)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 text-xs font-semibold text-[#111318]"
                >
                  <span>{brands.find((b) => b.id === bId)?.name}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {filters.onlyBestSellers && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ onlyBestSellers: false })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8E4DEB]/15 text-[#8E4DEB] text-xs font-bold"
                >
                  <span>{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {filters.onlyNewArrivals && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ onlyNewArrivals: false })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D66C9D]/15 text-[#D66C9D] text-xs font-bold"
                >
                  <span>{lang === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-bold text-rose-600 hover:underline ms-1"
              >
                {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
              </button>
            </div>
          )}

          {/* Dense Product Grid or Empty Search State */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F4F3F7] text-[#8E4DEB] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'لم يتم العثور على منتجات مطابقة للفلاتر المحددة'
                    : 'No Products Match Your Active Filters'}
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {lang === 'ar'
                    ? 'جرب توسيع نطاق السعر أو إزالة بعض فلاتر العلامات التجارية أو البحث بكلمة أخرى.'
                    : 'Try adjusting your USD price range, clearing use-case tags, or searching for another model.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onResetFilters}
                className="px-5 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors"
              >
                {lang === 'ar'
                  ? 'إعادة ضبط جميع الفلاتر'
                  : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {paginatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  brands={brands}
                  offers={offers}
                  usdToSypRate={usdToSypRate}
                  nowMs={nowMs}
                  lang={lang}
                  themeId={themeId}
                  showCountdown={true}
                  onSelectProduct={onSelectProduct}
                  onRequestProduct={onRequestProduct}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-between bg-white rounded-xl border border-slate-200/90 px-4 py-3">
              <span className="text-xs text-slate-500">
                {lang === 'ar'
                  ? `صفحة ${safePage} من ${totalPages}`
                  : `Page ${safePage} of ${totalPages}`}
              </span>
              <div className="flex items-center gap-1.5" dir="ltr">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:border-[#8E4DEB]"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded text-xs font-mono-num font-bold ${
                      safePage === i + 1
                        ? 'bg-[#8E4DEB] text-white'
                        : 'bg-[#F4F3F7] text-[#111318] hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:border-[#8E4DEB]"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex justify-end lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-white h-full overflow-y-auto p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-sm font-bold text-[#111318]">
                {lang === 'ar' ? 'فلترة المنتجات' : 'Filter Products'}
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#111318]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderFiltersPanel()}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold"
              >
                {lang === 'ar'
                  ? `عرض النتائج (${filteredProducts.length})`
                  : `Show Results (${filteredProducts.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
