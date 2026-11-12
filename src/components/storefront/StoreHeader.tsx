'use client';

import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Flame,
  Globe,
  Headphones,
  Keyboard,
  Laptop,
  Menu,
  Monitor,
  Search,
  Snowflake,
  Store,
  Wrench,
  X,
} from 'lucide-react';
import {
  Category,
  DesignThemeId,
  Language,
  StoreSettings,
} from '../../types/store';
import { PixelLogo } from '../visuals/PixelLogo';

export type StorefrontView =
  | 'home'
  | 'shop'
  | 'category'
  | 'product'
  | 'offers'
  | 'services'
  | 'contact';

interface StoreHeaderProps {
  lang: Language;
  themeId: DesignThemeId;
  settings: StoreSettings;
  categories: Category[];
  currentView: StorefrontView;
  activeCategoryId: string | 'ALL';
  selectedServiceId?: string | 'ALL';
  searchQuery: string;
  activeOffersCount: number;
  pendingRequestsCount?: number;
  onToggleLanguage: () => void;
  onNavigate: (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string
  ) => void;
  onSearchSubmit: (query: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  lang,
  themeId,
  currentView,
  activeCategoryId,
  selectedServiceId = 'ALL',
  searchQuery,
  activeOffersCount,
  onToggleLanguage,
  onNavigate,
  onSearchSubmit,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keep header search input synchronized when searchQuery is cleared or updated externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const isContrastHeader = themeId === 'contrast';

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localSearch);
  };

  const navBtnBase = `inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
    isContrastHeader ? 'rounded-none' : 'rounded-md'
  }`;

  const getTabClasses = (isActive: boolean) => {
    if (isActive) {
      return `${navBtnBase} bg-[#8E4DEB] text-white shadow-xs`;
    }
    if (isContrastHeader || themeId === 'retail') {
      return `${navBtnBase} text-slate-200 hover:bg-white/10 hover:text-white`;
    }
    return `${navBtnBase} text-slate-700 hover:bg-slate-200/70 hover:text-[#111318]`;
  };

  return (
    <header
      data-testid="store-header"
      className={`w-full z-30 border-b transition-colors ${
        isContrastHeader
          ? 'bg-[#111318] border-white/10 text-white'
          : 'bg-white border-slate-200 text-[#111318]'
      }`}
    >
      {/* Main Search-First Header Row (Top Utility Bar Removed; Language Switcher Integrated) */}
      <div
        data-testid="main-header-row"
        className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6"
      >
        {/* Brand Zone: Official Pixel Store Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Toggle Menu'}
            className={`lg:hidden p-1.5 sm:p-2 rounded-md ${
              isContrastHeader
                ? 'text-white hover:bg-white/10'
                : 'text-[#111318] hover:bg-slate-100'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-start focus-visible:outline-2 focus-visible:outline-[#8E4DEB] shrink-0"
            aria-label="PIXEL STORE Home"
          >
            <PixelLogo
              variant={isContrastHeader ? 'dark' : 'light'}
              size="sm"
            />
          </button>
        </div>

        {/* Prominent Central Search Bar */}
        <form
          onSubmit={handleSearchForm}
          className="hidden md:flex flex-1 max-w-2xl items-center relative"
          role="search"
        >
          <label htmlFor="header-search-input" className="sr-only">
            {lang === 'ar'
              ? 'ابحث عن لابتوب، كرت شاشة، كيبورد، أو رقم الموديل'
              : 'Search laptops, GPUs, keyboards, or SKU'}
          </label>
          <input
            id="header-search-input"
            type="search"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (e.target.value === '') {
                onSearchSubmit('');
              }
            }}
            placeholder={
              lang === 'ar'
                ? 'ابحث عن لابتوب، كرت شاشة RTX، كيبورد ميكانيكي، أو موديل...'
                : 'Search laptops, RTX graphics cards, mechanical keyboards, or SKU...'
            }
            className={`w-full h-10 ps-4 pe-24 text-sm transition-all focus:outline-none ${
              isContrastHeader
                ? 'rounded-none bg-[#1B1E28] border border-white/15 text-white placeholder:text-slate-400 focus:border-[#8E4DEB]'
                : themeId === 'retail'
                ? 'rounded bg-white border-2 border-slate-300 text-[#111318] placeholder:text-slate-400 focus:border-[#8E4DEB]'
                : 'rounded-md bg-[#F4F3F7] border border-slate-200/90 text-[#111318] placeholder:text-slate-400 focus:bg-white focus:border-[#8E4DEB]'
            }`}
          />
          <button
            type="submit"
            className={`absolute end-1.5 top-1.5 bottom-1.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isContrastHeader
                ? 'rounded-none bg-[#8E4DEB] hover:bg-[#7A38D8] text-white'
                : themeId === 'retail'
                ? 'rounded-xs bg-[#111318] hover:bg-[#8E4DEB] text-white'
                : 'rounded bg-[#8E4DEB] hover:bg-[#7A38D8] text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بحث' : 'Search'}</span>
          </button>
        </form>

        {/* End Action Cluster (Relocated Language Switcher — Upper Exclusive Offers Duplicate Removed) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="lang-toggle-btn"
            onClick={onToggleLanguage}
            aria-label={
              lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'
            }
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              isContrastHeader ? 'rounded-none' : 'rounded-md'
            } ${
              isContrastHeader
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                : 'bg-[#F4F3F7] text-[#111318] hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#8E4DEB] shrink-0" />
            <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5">
        <form onSubmit={handleSearchForm} className="relative flex items-center">
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'ابحث في متجر بيكسل...'
                : 'Search Pixel Store...'
            }
            aria-label={lang === 'ar' ? 'ابحث في المتجر' : 'Search products'}
            className={`w-full h-9 ps-3.5 pe-20 text-xs focus:outline-none ${
              isContrastHeader
                ? 'rounded-none bg-[#1B1E28] border border-white/15 text-white'
                : 'rounded-md bg-[#F4F3F7] border border-slate-200 text-[#111318]'
            }`}
          />
          <button
            type="submit"
            className="absolute end-1 top-1 bottom-1 px-3 rounded-xs bg-[#8E4DEB] text-white text-xs font-semibold"
          >
            {lang === 'ar' ? 'بحث' : 'Find'}
          </button>
        </form>
      </div>

      {/* Desktop Structured Main Navigation Bar:
          [Primary Group 1] -> [Immediate Separator] -> [Regular Group 2 Links] --- (Deliberate Flexible Gap ms-auto) ---> [Cooling Solutions & Exclusive Offers] */}
      <div
        className={`hidden lg:block border-t ${
          isContrastHeader
            ? 'border-white/10 bg-[#171923]'
            : themeId === 'retail'
            ? 'border-slate-800 bg-[#111318] text-white'
            : 'border-slate-200 bg-[#FAF9FC]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 xl:px-6 h-11 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* GROUP 1: Primary Categories & Services */}
          <nav
            data-testid="navbar-group-1"
            className="flex items-center gap-1 shrink-0"
            aria-label={
              lang === 'ar'
                ? 'المجموعة الأولى — الأقسام الرئيسية والخدمات'
                : 'Group 1 — Core Categories & Services'
            }
          >
            <button
              type="button"
              data-testid="nav-tab-all-products"
              onClick={() => onNavigate('shop', 'ALL')}
              className={getTabClasses(
                currentView === 'shop' && activeCategoryId === 'ALL'
              )}
            >
              <Store className="w-3.5 h-3.5 text-[#8E4DEB]" />
              <span>{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
            </button>

            <button
              type="button"
              data-testid="nav-tab-services"
              onClick={() => onNavigate('services', 'ALL')}
              className={getTabClasses(
                currentView === 'services' && selectedServiceId === 'ALL'
              )}
            >
              <Wrench className="w-3.5 h-3.5 text-[#EF875D]" />
              <span>{lang === 'ar' ? 'الخدمات' : 'Services'}</span>
            </button>

            <button
              type="button"
              data-testid="nav-tab-laptops"
              onClick={() => onNavigate('category', 'laptops')}
              className={getTabClasses(
                currentView === 'category' && activeCategoryId === 'laptops'
              )}
            >
              <Laptop className="w-3.5 h-3.5 text-[#8E4DEB]" />
              <span>{lang === 'ar' ? 'اللابتوبات' : 'Laptops'}</span>
            </button>

            <button
              type="button"
              data-testid="nav-tab-pc-builds"
              onClick={() => onNavigate('category', 'pc-builds')}
              className={getTabClasses(
                currentView === 'category' && activeCategoryId === 'pc-builds'
              )}
            >
              <Monitor className="w-3.5 h-3.5 text-[#D66C9D]" />
              <span>{lang === 'ar' ? 'تجميعات PC' : 'PC Builds'}</span>
            </button>

            <button
              type="button"
              data-testid="nav-tab-pc-components"
              onClick={() => onNavigate('category', 'pc-components')}
              className={getTabClasses(
                currentView === 'category' &&
                  activeCategoryId === 'pc-components'
              )}
            >
              <Cpu className="w-3.5 h-3.5 text-[#EF875D]" />
              <span>
                {lang === 'ar' ? 'قطع الكمبيوتر' : 'PC Components'}
              </span>
            </button>
          </nav>

          {/* Immediate Visual Group Separator (No oversized gap before or after) */}
          <div
            data-testid="navbar-group-separator"
            className={`h-4 w-px mx-1.5 shrink-0 ${
              isContrastHeader || themeId === 'retail'
                ? 'bg-white/20'
                : 'bg-slate-300'
            }`}
            aria-hidden="true"
          />

          {/* GROUP 2: Regular Peripherals & Audio (Immediately after separator) + Promotional Links pushed to opposite end via ms-auto */}
          <nav
            data-testid="navbar-group-2"
            className="flex items-center flex-1 min-w-0 gap-1"
            aria-label={
              lang === 'ar'
                ? 'المجموعة الثانية — الإكسسوارات وحلول التبريد والعروض'
                : 'Group 2 — Peripherals, Audio, Cooling Solutions & Offers'
            }
          >
            {/* Regular Links immediately after separator */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                data-testid="nav-tab-accessories"
                onClick={() => onNavigate('category', 'accessories')}
                className={getTabClasses(
                  currentView === 'category' &&
                    activeCategoryId === 'accessories'
                )}
              >
                <Keyboard className="w-3.5 h-3.5 text-[#8E4DEB]" />
                <span>
                  {lang === 'ar'
                    ? 'الإكسسوارات والملحقات'
                    : 'Accessories & Peripherals'}
                </span>
              </button>

              <button
                type="button"
                data-testid="nav-tab-audio"
                onClick={() => onNavigate('category', 'audio')}
                className={getTabClasses(
                  currentView === 'category' && activeCategoryId === 'audio'
                )}
              >
                <Headphones className="w-3.5 h-3.5 text-[#D66C9D]" />
                <span>
                  {lang === 'ar' ? 'الصوتيات والسماعات' : 'Audio & Headsets'}
                </span>
              </button>
            </div>

            {/* Deliberate flexible gap before the final promotional links */}
            <div className="ms-auto flex items-center gap-1.5 ps-3 shrink-0">
              {/* Cooling Solutions — Direct Service Shortcut */}
              <button
                type="button"
                data-testid="nav-tab-cooling-solutions"
                onClick={() => onNavigate('services', 'service-cooling')}
                className={`${navBtnBase} ${
                  currentView === 'services' &&
                  selectedServiceId === 'service-cooling'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : isContrastHeader || themeId === 'retail'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 hover:bg-sky-500 hover:text-white'
                    : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-600 hover:text-white'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar' ? 'حلول التبريد' : 'Cooling Solutions'}
                </span>
              </button>

              {/* Exclusive Offers (Single Authoritative Shortcut with Active Count Badge) */}
              <button
                type="button"
                data-testid="nav-tab-exclusive-offers"
                onClick={() => onNavigate('offers')}
                className={`${navBtnBase} group ${
                  currentView === 'offers'
                    ? 'bg-[#D66C9D] text-white border border-[#EF875D]'
                    : isContrastHeader || themeId === 'retail'
                    ? 'bg-[#EF875D]/20 text-[#EF875D] border border-[#EF875D]/40 hover:bg-[#EF875D] hover:text-[#111318]'
                    : 'bg-[#D66C9D]/15 text-[#D66C9D] border border-[#D66C9D]/30 hover:bg-[#D66C9D] hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers'}
                </span>
                <span
                  data-testid="nav-offers-count-badge"
                  className={`font-mono-num text-[10px] leading-none px-1.5 py-0.5 rounded-xs font-extrabold transition-colors ${
                    currentView === 'offers'
                      ? 'bg-[#111318] text-white'
                      : isContrastHeader || themeId === 'retail'
                      ? 'bg-[#EF875D] text-[#111318] group-hover:bg-[#111318] group-hover:text-white'
                      : 'bg-[#D66C9D] text-white'
                  }`}
                >
                  {activeOffersCount}
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Clean Two-Group Structure, No Design Playground) */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-nav-drawer"
          className={`lg:hidden border-t px-4 py-3.5 space-y-3.5 ${
            isContrastHeader
              ? 'border-white/10 bg-[#171923] text-white'
              : 'border-slate-200 bg-white text-[#111318]'
          }`}
        >
          {/* Group 1 Mobile */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ar'
                ? 'الأقسام الرئيسية والخدمات'
                : 'Core Categories & Services'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onNavigate('shop', 'ALL');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/10 text-start"
              >
                <Store className="w-4 h-4 text-[#8E4DEB]" />
                <span>{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('services', 'ALL');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/10 text-start"
              >
                <Wrench className="w-4 h-4 text-[#EF875D]" />
                <span>{lang === 'ar' ? 'الخدمات' : 'Services'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('category', 'laptops');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/5 text-start"
              >
                <Laptop className="w-4 h-4 text-[#8E4DEB]" />
                <span>{lang === 'ar' ? 'اللابتوبات' : 'Laptops'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('category', 'pc-builds');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/5 text-start"
              >
                <Monitor className="w-4 h-4 text-[#D66C9D]" />
                <span>{lang === 'ar' ? 'تجميعات PC' : 'PC Builds'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('category', 'pc-components');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/5 text-start sm:col-span-2"
              >
                <Cpu className="w-4 h-4 text-[#EF875D]" />
                <span>
                  {lang === 'ar' ? 'قطع الكمبيوتر' : 'PC Components'}
                </span>
              </button>
            </div>
          </div>

          {/* Group 2 Mobile */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ar'
                ? 'الإكسسوارات وحلول التبريد والعروض'
                : 'Peripherals, Cooling & Offers'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onNavigate('category', 'accessories');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/5 text-start"
              >
                <Keyboard className="w-4 h-4 text-[#8E4DEB]" />
                <span>
                  {lang === 'ar'
                    ? 'الإكسسوارات والملحقات'
                    : 'Accessories & Peripherals'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('category', 'audio');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-white/5 text-start"
              >
                <Headphones className="w-4 h-4 text-[#D66C9D]" />
                <span>
                  {lang === 'ar' ? 'الصوتيات والسماعات' : 'Audio & Headsets'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('services', 'service-cooling');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 text-start"
              >
                <Snowflake className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'حلول التبريد' : 'Cooling Solutions'}
                </span>
              </button>

              <button
                type="button"
                data-testid="mobile-nav-exclusive-offers"
                onClick={() => {
                  onNavigate('offers');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-md text-xs font-bold bg-[#D66C9D]/20 text-[#EF875D] border border-[#D66C9D]/30 text-start"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers'}
                  </span>
                </span>
                <span className="font-mono-num text-[10px] px-1.5 py-0.5 rounded bg-[#EF875D] text-[#111318] font-extrabold">
                  {activeOffersCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Contact Page Shortcut */}
          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-md text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              {lang === 'ar' ? 'التواصل والموقع' : 'Contact & Location'}
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#8E4DEB]" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
