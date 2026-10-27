import React, { useState } from 'react';
import {
  Cpu,
  Flame,
  Globe,
  Headphones,
  Keyboard,
  Laptop,
  Menu,
  Monitor,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { Category, Language, StoreSettings } from '../../types/store';
import { PixelLogo } from '../visuals/PixelLogo';

export type StorefrontView =
  | 'home'
  | 'shop'
  | 'category'
  | 'product'
  | 'offers'
  | 'contact'
  | 'admin';

interface StoreHeaderProps {
  lang: Language;
  settings: StoreSettings;
  categories: Category[];
  currentView: StorefrontView;
  activeCategoryId: string | 'ALL';
  searchQuery: string;
  activeOffersCount: number;
  pendingRequestsCount: number;
  onToggleLanguage: () => void;
  onNavigate: (view: StorefrontView, categoryId?: string, subcategoryId?: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  lang,
  settings,
  categories,
  currentView,
  activeCategoryId,
  searchQuery,
  activeOffersCount,
  pendingRequestsCount,
  onToggleLanguage,
  onNavigate,
  onSearchSubmit,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const topCategories = categories.filter((c) => !c.parentId);

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localSearch);
  };

  const getCategoryIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'laptop':
        return <Laptop className="w-4 h-4 shrink-0" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 shrink-0" />;
      case 'keyboard':
        return <Keyboard className="w-4 h-4 shrink-0" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 shrink-0" />;
      case 'pc':
      default:
        return <Monitor className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 z-30">
      {/* Slim Top Utility Strip (Dismissible/Compact, non-sticky) */}
      <div className="bg-[#111318] text-slate-200 text-xs border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-9 flex items-center justify-between gap-4">
          {/* Store Promo / Exchange Rate Notice */}
          <div className="flex items-center gap-3 min-w-0 truncate">
            <span className="inline-block w-2 h-2 bg-[#8E4DEB] shrink-0" />
            <span className="truncate text-slate-200 font-medium">
              {settings.topPromoBanner[lang]}
            </span>
          </div>

          {/* Utility Right Controls: Exchange Rate Readout, Contact, Language, Admin */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              className="hidden sm:flex items-center gap-1.5 font-mono-num text-[11px] text-slate-300"
              dir="ltr"
            >
              <span>1 USD =</span>
              <span className="font-bold text-[#EF875D]">
                {settings.usdToSypRate.toLocaleString('en-US')} SYP
              </span>
            </div>

            <span className="hidden sm:inline text-white/20" aria-hidden="true">
              |
            </span>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D66C9D]" />
              <span>{lang === 'ar' ? 'التواصل والدعم' : 'Support & Contact'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleLanguage}
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#8E4DEB]" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#8E4DEB]/25 hover:bg-[#8E4DEB] text-white font-semibold border border-[#8E4DEB]/50 transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}</span>
              {pendingRequestsCount > 0 && (
                <span className="font-mono-num text-[10px] px-1 rounded bg-[#EF875D] text-[#111318] font-bold">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Search-First Header Row */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Zone: Official Pixel Store Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Toggle Menu'}
            className="lg:hidden p-2 rounded-lg text-[#111318] hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-start focus-visible:outline-2 focus-visible:outline-[#8E4DEB] shrink-0"
            aria-label="PIXEL STORE Home"
          >
            <PixelLogo variant="light" size="md" />
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
            className="w-full h-11 ps-4 pe-28 rounded-lg bg-[#F4F3F7] border border-slate-200/90 text-sm text-[#111318] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#8E4DEB] focus:ring-2 focus:ring-[#8E4DEB]/15 transition-all"
          />
          <button
            type="submit"
            className="absolute end-1.5 top-1.5 bottom-1.5 px-4 rounded-md bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بحث' : 'Search'}</span>
          </button>
        </form>

        {/* Primary Right Action Cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* All Products Button */}
          <button
            type="button"
            onClick={() => onNavigate('shop', 'ALL')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'shop' && activeCategoryId === 'ALL'
                ? 'bg-[#111318] text-white'
                : 'bg-[#F4F3F7] text-[#111318] hover:bg-slate-200/80'
            }`}
          >
            <Store className="w-4 h-4 text-[#8E4DEB]" />
            <span>{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
          </button>

          {/* Prominent Offers Navigation Button */}
          <button
            type="button"
            onClick={() => onNavigate('offers')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              currentView === 'offers'
                ? 'bg-[#111318] text-white ring-2 ring-[#D66C9D]'
                : 'bg-gradient-to-r from-[#8E4DEB] to-[#D66C9D] text-white hover:opacity-95 shadow-xs'
            }`}
          >
            <Flame className="w-4 h-4 text-[#EF875D] fill-[#EF875D]" />
            <span>{lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers'}</span>
            <span className="font-mono-num text-[11px] px-1.5 py-0.2 rounded bg-black/25 text-white">
              {activeOffersCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
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
            className="w-full h-10 ps-3.5 pe-20 rounded-lg bg-[#F4F3F7] border border-slate-200 text-xs text-[#111318] focus:bg-white focus:outline-none focus:border-[#8E4DEB]"
          />
          <button
            type="submit"
            className="absolute end-1 top-1 bottom-1 px-3 rounded bg-[#8E4DEB] text-white text-xs font-semibold"
          >
            {lang === 'ar' ? 'بحث' : 'Find'}
          </button>
        </form>
      </div>

      {/* Desktop Visual Category & Merchandising Shortcut Rail */}
      <div className="hidden lg:block border-t border-slate-100 bg-[#FAF9FC]">
        <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between gap-4 overflow-x-auto">
          <nav
            className="flex items-center gap-1.5"
            aria-label={lang === 'ar' ? 'أقسام المتجر' : 'Store Categories'}
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home'
                  ? 'bg-[#111318] text-white'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-[#111318]'
              }`}
            >
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </button>

            {topCategories.map((cat) => {
              const isActive =
                currentView === 'category' && activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigate('category', cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#8E4DEB] text-white'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-[#111318]'
                  }`}
                >
                  <span
                    className={
                      isActive ? 'text-white' : 'text-[#8E4DEB]'
                    }
                  >
                    {getCategoryIcon(cat.iconKey)}
                  </span>
                  <span>{cat.name[lang]}</span>
                </button>
              );
            })}

            {/* Direct Popular Subcategory Quick Links */}
            <span className="text-slate-300 mx-1" aria-hidden="true">
              |
            </span>

            <button
              type="button"
              onClick={() => onNavigate('category', 'accessories', 'keyboards')}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-[#8E4DEB] hover:bg-[#8E4DEB]/8 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'كيبوردات Gaming / Office' : 'Keyboards (Gaming / Office)'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('category', 'accessories', 'mice')}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-[#8E4DEB] hover:bg-[#8E4DEB]/8 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'ماوسات احترافية' : 'Pro Mice'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('category', 'audio', 'iem')}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-[#8E4DEB] hover:bg-[#8E4DEB]/8 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'سماعات IEM' : 'IEM Monitors'}
            </button>
          </nav>

          {/* Right Rail Quick Highlights */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('shop', 'ALL', 'NEW_ARRIVALS')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold text-[#8E4DEB] bg-[#8E4DEB]/10 hover:bg-[#8E4DEB]/20 transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-[#F4F3F7] text-xs font-bold text-[#111318] text-start"
            >
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('shop', 'ALL');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-[#F4F3F7] text-xs font-bold text-[#111318] text-start"
            >
              {lang === 'ar' ? 'كل المنتجات' : 'All Products'}
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-1">
            {lang === 'ar' ? 'الأقسام الرئيسية' : 'Categories'}
          </div>

          <div className="space-y-1">
            {topCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onNavigate('category', cat.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#111318] hover:bg-[#F4F3F7]"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#8E4DEB]">{getCategoryIcon(cat.iconKey)}</span>
                  <span>{cat.name[lang]}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#8E4DEB]"
            >
              {lang === 'ar' ? 'التواصل والدعم' : 'Contact & Support'}
            </button>
            <span className="font-mono-num text-xs text-slate-500" dir="ltr">
              1$ = {settings.usdToSypRate.toLocaleString('en-US')} SYP
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
