'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Filter,
  Gamepad2,
  Laptop,
  Layers,
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
  const itemsPerPage = 20;

  const activeCategories = categories.filter((c) => c.isActive !== false);
  const topCategories = activeCategories.filter((c) => !c.parentId);
  const activeParentCategory = activeCategories.find(
    (c) => c.id === filters.categoryId
  );
  const activeSubcategory = activeCategories.find(
    (c) => c.id === filters.subcategoryId
  );

  // Subcategories belonging to the currently selected parent category (backend-managed taxonomy)
  const childSubcategories =
    filters.categoryId !== 'ALL'
      ? activeCategories.filter((c) => c.parentId === filters.categoryId)
      : activeCategories.filter((c) => Boolean(c.parentId));

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
            Boolean(
              activeParentCategory &&
                (u.applicableCategories.includes(activeParentCategory.id) ||
                  activeParentCategory.useCaseIds?.includes(u.id))
            ) ||
            Boolean(activeSubcategory?.useCaseIds?.includes(u.id))
        );

  const filteredProducts = filterAndSortProducts(
    products,
    offers,
    usdToSypRate,
    filters,
    nowMs
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Latest 4 products for the compact sidebar panel
  const latestSidebarProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

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

  const getUseCaseIcon = (ucId: string) => {
    switch (ucId) {
      case 'gaming':
        return <Gamepad2 className="w-3.5 h-3.5 shrink-0" />;
      case 'office':
        return <Briefcase className="w-3.5 h-3.5 shrink-0" />;
      case 'work-study':
        return <Laptop className="w-3.5 h-3.5 shrink-0" />;
      case 'everyday':
      default:
        return <Compass className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  // Reusable Filter Controls Block (shared between Desktop Sidebar and Mobile Drawer)
  // Exact order required by Section 3.B:
  // 1. القسم الرئيسي (Main Category)
  // 2. القسم الفرعي (Subcategory — Dynamic / Contextual)
  // 3. طبيعة الاستخدام (Use-Case Selector — Relocated to Sidebar)
  // 4. Secondary Filters (Condition, Price Range, Brand, Availability)
  const renderFiltersPanel = (isMobileDrawer = false) => (
    <div className="space-y-4" data-testid="catalog-sidebar-filters">
      {/* Header + Reset (Shown in Desktop Sidebar; Mobile Drawer uses its own sticky header) */}
      {!isMobileDrawer && (
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111318]">
            <Filter className="w-4 h-4 text-[#8E4DEB]" />
            <span>{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</span>
          </div>
          <button
            type="button"
            data-testid="sidebar-reset-filters"
            onClick={() => {
              onResetFilters();
              setCurrentPage(1);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8E4DEB] hover:text-[#111318] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
          </button>
        </div>
      )}

      {/* 1. القسم الرئيسي (Main Category) */}
      <div data-testid="sidebar-section-main-category">
        <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider mb-2">
          {lang === 'ar' ? 'القسم الرئيسي' : 'Main Category'}
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
            className={`w-full text-start px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-between ${
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
                data-testid={`sidebar-cat-${cat.id}`}
                onClick={() => {
                  onUpdateFilters({
                    categoryId: cat.id,
                    subcategoryId: 'ALL',
                    useCaseId: 'ALL',
                  });
                  setCurrentPage(1);
                }}
                className={`w-full text-start px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#8E4DEB] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{cat.name[lang]}</span>
                <span className="font-mono-num text-[11px] opacity-80">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. القسم الفرعي (Subcategory — Dynamic / Contextual, Relocated to Sidebar) */}
      {childSubcategories.length > 0 && (
        <div
          data-testid="sidebar-section-subcategory"
          className="pt-3 border-t border-slate-200/80"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8E4DEB]" />
              <span>{lang === 'ar' ? 'القسم الفرعي' : 'Subcategory'}</span>
            </h3>
            {filters.subcategoryId !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateFilters({ subcategoryId: 'ALL' });
                  setCurrentPage(1);
                }}
                className="text-[11px] font-bold text-[#D66C9D] hover:underline"
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
            )}
          </div>

          <div className="space-y-1">
            <button
              type="button"
              data-testid="sidebar-subcat-ALL"
              aria-pressed={filters.subcategoryId === 'ALL'}
              onClick={() => {
                onUpdateFilters({ subcategoryId: 'ALL' });
                setCurrentPage(1);
              }}
              className={`w-full text-start px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-between ${
                filters.subcategoryId === 'ALL'
                  ? 'bg-[#111318] text-white font-bold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
            </button>

            {childSubcategories.map((sub) => {
              const isSelected = filters.subcategoryId === sub.id;
              const subCount = products.filter(
                (p) => p.subcategoryId === sub.id
              ).length;
              return (
                <button
                  key={sub.id}
                  type="button"
                  data-testid={`sidebar-subcat-${sub.id}`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onUpdateFilters({
                      categoryId: sub.parentId || filters.categoryId,
                      subcategoryId: isSelected ? 'ALL' : sub.id,
                    });
                    setCurrentPage(1);
                  }}
                  className={`w-full text-start px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#8E4DEB] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{sub.name[lang]}</span>
                  <span className="font-mono-num text-[11px] opacity-75">
                    {subCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. طبيعة الاستخدام (Use-Case Selector — Relocated to Sidebar) */}
      {relevantUseCases.length > 0 && (
        <div
          data-testid="sidebar-section-usecase"
          className="pt-3 border-t border-slate-200/80"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EF875D]" />
              <span>
                {lang === 'ar' ? 'طبيعة الاستخدام' : 'Primary Use Case'}
              </span>
            </h3>
            {filters.useCaseId !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateFilters({ useCaseId: 'ALL' });
                  setCurrentPage(1);
                }}
                className="text-[11px] font-bold text-[#D66C9D] hover:underline"
              >
                {lang === 'ar' ? 'إلغاء' : 'Clear'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {relevantUseCases.map((uc) => {
              const isSelected = filters.useCaseId === uc.id;
              return (
                <button
                  key={uc.id}
                  type="button"
                  data-testid={`sidebar-usecase-${uc.id}`}
                  onClick={() => {
                    onUpdateFilters({
                      useCaseId: isSelected ? 'ALL' : uc.id,
                    });
                    setCurrentPage(1);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg border text-start transition-all flex items-center justify-between gap-2 text-xs font-bold ${
                    isSelected
                      ? 'bg-[#111318] border-[#111318] text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-[#111318] hover:border-[#8E4DEB]'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={
                        isSelected ? 'text-[#EF875D]' : 'text-[#8E4DEB]'
                      }
                    >
                      {getUseCaseIcon(uc.id)}
                    </span>
                    <span className="truncate">{uc.name[lang]}</span>
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#EF875D] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Secondary Filters: Condition (Strictly NEW or USED) */}
      <div className="pt-3 border-t border-slate-200/80">
        <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider mb-2">
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
                className={`px-2.5 py-2 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
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
      <div className="pt-3 border-t border-slate-200/80">
        <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider mb-2">
          {lang === 'ar' ? 'نطاق السعر (USD $)' : 'Price Range (USD)'}
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-2" dir="ltr">
          <div>
            <label
              htmlFor="min-price-input"
              className="block text-[10px] text-slate-500 mb-1"
            >
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
            <label
              htmlFor="max-price-input"
              className="block text-[10px] text-slate-500 mb-1"
            >
              {lang === 'ar' ? 'إلى ($)' : 'Max ($)'}
            </label>
            <input
              id="max-price-input"
              type="number"
              min={0}
              max={5000}
              value={filters.maxPriceUsd}
              onChange={(e) => {
                onUpdateFilters({
                  maxPriceUsd: Number(e.target.value) || 5000,
                });
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 font-mono-num text-xs text-[#111318]"
            />
          </div>
        </div>
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
      <div className="pt-3 border-t border-slate-200/80">
        <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider mb-2">
          {lang === 'ar' ? 'العلامة التجارية (Brand)' : 'Brands'}
        </h3>
        <div className="space-y-1.5">
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
      <div className="pt-3 border-t border-slate-200/80">
        <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider mb-2">
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

  const activeTitleText = activeSubcategory
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
    : 'All Hardware & Electronics';

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3.5 space-y-3.5">
      {/* ULTRA-COMPACT CATEGORY TITLE STRIP (56px–72px desktop height, zero oversized top filter cards) */}
      <div
        data-testid="compact-catalog-header"
        className={`bg-white border px-4 py-2.5 min-h-[56px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          themeId === 'contrast'
            ? 'rounded-none border-2 border-[#111318]'
            : 'rounded-lg border-slate-200/90'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Compact Breadcrumb Trail */}
          <nav
            className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500"
            aria-label="Breadcrumb"
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#8E4DEB] transition-colors font-semibold"
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
              className="hover:text-[#8E4DEB] transition-colors font-semibold"
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
                  className="hover:text-[#8E4DEB] transition-colors font-semibold"
                >
                  {activeParentCategory.name[lang]}
                </button>
              </>
            )}
          </nav>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Active Category / Subcategory Title + Inline Result Counter Badge */}
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#111318] leading-tight">
              {activeTitleText}
            </h1>
            <span
              data-testid="catalog-count-badge"
              className="px-2 py-0.5 rounded bg-[#8E4DEB]/10 text-[#8E4DEB] border border-[#8E4DEB]/25 text-xs font-extrabold font-mono-num"
            >
              {lang === 'ar'
                ? `${filteredProducts.length} منتج`
                : `${filteredProducts.length} items`}
            </span>
          </div>
        </div>

        {/* Active Use-Case / Subcategory Quick Readout on right/left */}
        <div className="flex items-center gap-1.5 text-xs">
          {activeSubcategory && (
            <span className="px-2 py-0.5 rounded bg-[#111318] text-white font-bold">
              {activeSubcategory.name[lang]}
            </span>
          )}
          {filters.useCaseId !== 'ALL' && (
            <span className="px-2 py-0.5 rounded bg-[#EF875D]/20 text-[#111318] border border-[#EF875D]/40 font-bold">
              {useCaseTags.find((u) => u.id === filters.useCaseId)?.name[lang]}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Split: Desktop Sidebar (Filters + Compact Latest Products) & Immediate Product Grid Above the Fold */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Desktop Sidebar (3 Columns) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div
            className={`bg-white p-4 ${
              themeId === 'contrast'
                ? 'rounded-none border-2 border-[#111318]'
                : 'rounded-xl border border-slate-200/90'
            }`}
          >
            {renderFiltersPanel()}
          </div>

          {/* Compact Latest Products Sidebar Panel */}
          <div
            className={`bg-white p-4 ${
              themeId === 'contrast'
                ? 'rounded-none border-2 border-[#111318]'
                : 'rounded-xl border border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 bg-[#8E4DEB]" />
              <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider">
                {lang === 'ar' ? 'أحدث المنتجات المضافة' : 'Latest Products'}
              </h3>
            </div>
            <div className="space-y-2.5">
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
                    <div className="w-13 h-10 rounded bg-[#F8F7FA] border border-slate-200/80 shrink-0 overflow-hidden">
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
        <div className="lg:col-span-9 space-y-3">
          {/* COMPACT SUBCATEGORY QUICK BROWSING & INLINE USE-CASE BAR ABOVE PRODUCTS */}
          {(childSubcategories.length > 0 || relevantUseCases.length > 0) && (
            <section
              data-testid="subcategory-quick-browse"
              aria-label={
                lang === 'ar'
                  ? 'التصفح السريع للأقسام الفرعية'
                  : 'Subcategory Quick Browsing'
              }
              className={`bg-white px-3 py-2.5 ${
                themeId === 'contrast'
                  ? 'rounded-none border-2 border-[#111318]'
                  : 'rounded-xl border border-slate-200/90'
              }`}
            >
              {childSubcategories.length > 0 && (
                <>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#111318]">
                      <Layers className="w-3.5 h-3.5 text-[#8E4DEB] shrink-0" />
                      <span>
                        {activeParentCategory
                          ? lang === 'ar'
                            ? `الأقسام الفرعية — ${activeParentCategory.name.ar}`
                            : `Subcategories — ${activeParentCategory.name.en}`
                          : lang === 'ar'
                          ? 'تصفح حسب القسم الفرعي'
                          : 'Browse by Subcategory'}
                      </span>
                    </div>
                    {filters.subcategoryId !== 'ALL' && (
                      <button
                        type="button"
                        data-testid="quick-subcat-reset"
                        onClick={() => {
                          onUpdateFilters({ subcategoryId: 'ALL' });
                          setCurrentPage(1);
                        }}
                        className="text-[11px] font-bold text-[#8E4DEB] hover:text-[#111318] transition-colors cursor-pointer"
                      >
                        {lang === 'ar'
                          ? 'عرض كل القسم ←'
                          : 'Show All in Category →'}
                      </button>
                    )}
                  </div>

                  {/* Single-row balanced horizontal strip: stretches evenly across full width on desktop, swipes horizontally on mobile */}
                  <div
                    data-testid="quick-subcat-strip"
                    className="flex items-stretch gap-1.5 overflow-x-auto no-scrollbar pb-0.5 snap-x"
                  >
                    {/* "All" Subcategory Tile */}
                    <button
                      type="button"
                      data-testid="quick-subcat-ALL"
                      aria-pressed={filters.subcategoryId === 'ALL'}
                      onClick={() => {
                        onUpdateFilters({ subcategoryId: 'ALL' });
                        setCurrentPage(1);
                      }}
                      className={`snap-start flex-1 min-w-[108px] sm:min-w-[116px] h-11 px-2 py-1 border text-start transition-all flex items-center justify-between gap-1.5 cursor-pointer shrink-0 ${
                        themeId === 'contrast' ? 'rounded-none' : 'rounded-lg'
                      } ${
                        filters.subcategoryId === 'ALL'
                          ? 'bg-[#111318] border-[#111318] text-white shadow-xs'
                          : 'bg-[#F8F7FA] border-slate-200/90 text-[#111318] hover:border-[#8E4DEB]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            filters.subcategoryId === 'ALL'
                              ? 'bg-[#8E4DEB] text-white'
                              : 'bg-white text-[#8E4DEB] border border-slate-200'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[11px] font-extrabold truncate">
                          {lang === 'ar' ? 'عرض الكل' : 'All Items'}
                        </span>
                      </span>
                      <span
                        className={`font-mono-num text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          filters.subcategoryId === 'ALL'
                            ? 'bg-white/15 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {filters.categoryId !== 'ALL'
                          ? products.filter(
                              (p) =>
                                p.isActive !== false &&
                                p.categoryId === filters.categoryId
                            ).length
                          : products.filter((p) => p.isActive !== false).length}
                      </span>
                    </button>

                    {/* Individual Subcategory Quick Tiles */}
                    {childSubcategories.map((sub) => {
                      const isSelected = filters.subcategoryId === sub.id;
                      const subCount = products.filter(
                        (p) => p.isActive !== false && p.subcategoryId === sub.id
                      ).length;
                      const shortName = sub.name[lang]
                        .replace(/\s*\([^)]*\)\s*$/, '')
                        .trim();

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          title={sub.name[lang]}
                          data-testid={`quick-subcat-${sub.id}`}
                          aria-pressed={isSelected}
                          onClick={() => {
                            onUpdateFilters({
                              categoryId: sub.parentId || filters.categoryId,
                              subcategoryId: isSelected ? 'ALL' : sub.id,
                            });
                            setCurrentPage(1);
                          }}
                          className={`snap-start flex-1 min-w-[120px] sm:min-w-[126px] h-11 px-2 py-1 border text-start transition-all flex items-center justify-between gap-1.5 cursor-pointer group shrink-0 ${
                            themeId === 'contrast' ? 'rounded-none' : 'rounded-lg'
                          } ${
                            isSelected
                              ? 'bg-[#8E4DEB] border-[#111318] text-white shadow-xs ring-1 ring-[#111318]'
                              : 'bg-[#F8F7FA] border-slate-200/90 text-[#111318] hover:border-[#8E4DEB] hover:bg-white'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="w-8 h-7 flex items-center justify-center rounded bg-white border border-slate-200/80 overflow-hidden shrink-0 [&_svg]:!p-0.5">
                              <ProductVisual
                                visualKey={sub.visualKey || 'cat-components'}
                                alt={sub.name[lang]}
                              />
                            </span>
                            <span className="text-[11px] font-bold truncate">
                              {shortName}
                            </span>
                          </span>
                          <span
                            className={`font-mono-num text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              isSelected
                                ? 'bg-[#111318] text-white'
                                : 'bg-white text-slate-600 border border-slate-200 group-hover:border-[#8E4DEB]/40'
                            }`}
                          >
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Compact Secondary Row for Use-Case Filters (Gaming, Office, Everyday, Work/Study) */}
              {relevantUseCases.length > 0 && (
                <div
                  data-testid="quick-usecase-row"
                  className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
                    childSubcategories.length > 0
                      ? 'mt-2 pt-2 border-t border-slate-100'
                      : ''
                  }`}
                >
                  <span className="text-[11px] font-extrabold text-slate-500 whitespace-nowrap me-1 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-[#EF875D]" />
                    <span>
                      {lang === 'ar' ? 'طبيعة الاستخدام:' : 'Use Case:'}
                    </span>
                  </span>
                  <button
                    type="button"
                    data-testid="quick-usecase-ALL"
                    aria-pressed={filters.useCaseId === 'ALL'}
                    onClick={() => {
                      onUpdateFilters({ useCaseId: 'ALL' });
                      setCurrentPage(1);
                    }}
                    className={`h-7 px-2.5 text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer ${
                      themeId === 'contrast' ? 'rounded-none' : 'rounded-md'
                    } ${
                      filters.useCaseId === 'ALL'
                        ? 'bg-[#111318] text-white'
                        : 'bg-[#F4F3F7] text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <span>{lang === 'ar' ? 'الكل' : 'All'}</span>
                  </button>
                  {relevantUseCases.map((uc) => {
                    const active = filters.useCaseId === uc.id;
                    return (
                      <button
                        key={uc.id}
                        type="button"
                        data-testid={`quick-usecase-${uc.id}`}
                        aria-pressed={active}
                        onClick={() => {
                          onUpdateFilters({
                            useCaseId: active ? 'ALL' : uc.id,
                          });
                          setCurrentPage(1);
                        }}
                        className={`h-7 px-2.5 text-[11px] font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          themeId === 'contrast' ? 'rounded-none' : 'rounded-md'
                        } ${
                          active
                            ? 'bg-[#EF875D] text-[#111318] border border-[#111318]'
                            : 'bg-[#F4F3F7] text-slate-700 hover:bg-slate-200/80 border border-transparent'
                        }`}
                      >
                        {getUseCaseIcon(uc.id)}
                        <span>
                          {uc.name[lang].replace(/\s*\([^)]*\)\s*$/, '').trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Toolbar: Search Within View, Active Filter Chips, & Sort */}
          <div
            data-testid="catalog-toolbar"
            className={`bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
              themeId === 'contrast'
                ? 'rounded-none border-2 border-[#111318]'
                : 'rounded-xl border border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                data-testid="mobile-filter-trigger"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] text-white text-xs font-bold shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</span>
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
                  aria-label={
                    lang === 'ar' ? 'تصفية بالاسم' : 'Filter by keyword'
                  }
                  className="w-full ps-8 pe-3 py-1.5 rounded-lg bg-[#F4F3F7] border border-slate-200 text-xs text-[#111318] focus:bg-white focus:outline-none focus:border-[#8E4DEB]"
                />
              </div>
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
                  {lang === 'ar'
                    ? 'السعر: من الأقل للأعلى'
                    : 'Price: Low to High'}
                </option>
                <option value="price-desc">
                  {lang === 'ar'
                    ? 'السعر: من الأعلى للأقل'
                    : 'Price: High to Low'}
                </option>
              </select>
            </div>
          </div>

          {/* Active Interactive Filter Removal Chips */}
          {(filters.useCaseId !== 'ALL' ||
            filters.subcategoryId !== 'ALL' ||
            filters.brandIds.length > 0 ||
            filters.conditions.length > 0 ||
            filters.searchQuery.trim() !== '' ||
            filters.onlyBestSellers ||
            filters.onlyNewArrivals) && (
            <div
              data-testid="active-filter-chips"
              className="flex items-center flex-wrap gap-1.5"
            >
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'ar' ? 'الفلاتر النشطة:' : 'Active filters:'}
              </span>

              {filters.useCaseId !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ useCaseId: 'ALL' })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8E4DEB] text-white text-xs font-bold"
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111318] text-white text-xs font-bold"
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 text-xs font-bold text-[#111318]"
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 text-xs font-bold text-[#111318]"
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
            <div className="bg-white rounded-xl border border-slate-200/90 p-10 text-center space-y-4">
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
            <div
              data-testid="catalog-product-grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5"
            >
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
            <div className="pt-3 flex items-center justify-between bg-white rounded-xl border border-slate-200/90 px-4 py-2.5">
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

      {/* Mobile Filter Drawer (Single Header, Unclipped Scrollable Body, Sticky Action Footer) */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-drawer-title"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            data-testid="mobile-filter-drawer"
            className="w-full max-w-xs bg-white h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Single Drawer Header */}
            <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8E4DEB]" />
                <h2
                  id="mobile-filter-drawer-title"
                  className="text-sm font-extrabold text-[#111318]"
                >
                  {lang === 'ar' ? 'تصفية النتائج' : 'Filters'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="mobile-drawer-reset-filters"
                  onClick={() => {
                    onResetFilters();
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-[#8E4DEB] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label={
                    lang === 'ar' ? 'إغلاق نافذة التصفية' : 'Close filters drawer'
                  }
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#111318] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cleanly Scrollable Filter Sections Body (Zero Inner Clipped Scrollbars) */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {renderFiltersPanel(true)}
            </div>

            {/* Sticky Bottom CTA Bar */}
            <div className="p-3.5 border-t border-slate-200 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors"
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
