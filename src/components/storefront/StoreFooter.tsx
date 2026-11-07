'use client';

import React from 'react';
import { Clock, Snowflake, Wrench } from 'lucide-react';
import { Category, Language, StoreSettings } from '../../types/store';
import { PixelLogo } from '../visuals/PixelLogo';
import { ContactIconsBar } from './ContactIconsBar';
import { StorefrontView } from './StoreHeader';

interface StoreFooterProps {
  lang: Language;
  settings: StoreSettings;
  categories: Category[];
  onNavigate: (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string
  ) => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  lang,
  settings,
  onNavigate,
}) => {
  return (
    <footer
      data-testid="store-footer"
      className="bg-[#111318] text-slate-300 border-t-2 border-[#8E4DEB] mt-10"
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-7 lg:py-8">
        {/* Compact 4-Column Upper Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 pb-6 border-b border-white/10 items-start">
          {/* Column 1: Brand Identity & Working Hours (4 Cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <PixelLogo variant="dark" size="sm" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline[lang]}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#EF875D] shrink-0" />
              <span>{settings.workingHours[lang]}</span>
            </div>
          </div>

          {/* Column 2: Core Store Categories (3 Cols — Concise, High-Value Shortcuts) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'ar' ? 'أقسام المتجر' : 'Store Sections'}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'ALL')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'جميع المنتجات' : 'All Products'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'laptops')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'اللابتوبات' : 'Laptops'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'pc-builds')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'تجميعات PC' : 'PC Builds'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'pc-components')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'قطع الكمبيوتر' : 'PC Components'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'accessories')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar'
                    ? 'الإكسسوارات والملحقات'
                    : 'Accessories & Peripherals'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Offers (2 Cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'ar' ? 'الخدمات والعروض' : 'Services & Deals'}
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'ALL')}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-[#EF875D]" />
                  <span>
                    {lang === 'ar' ? 'الخدمات والصيانة' : 'Technical Services'}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'service-cooling')}
                  className="inline-flex items-center gap-1.5 text-sky-400 hover:text-white font-semibold transition-colors"
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'ar' ? 'حلول التبريد' : 'Cooling Solutions'}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('offers')}
                  className="text-[#D66C9D] hover:text-white font-semibold transition-colors"
                >
                  {lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'التواصل والموقع' : 'Contact & Location'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Primary Contact & Official Social Channels (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'ar' ? 'التواصل والقنوات الرسمية' : 'Connect With Us'}
            </h3>

            {/* Single authoritative social/contact icon row in upper footer */}
            <ContactIconsBar
              settings={settings}
              lang={lang}
              variant="footer"
              showPrimaryPhone={true}
              showIconChannels={true}
            />

            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-semibold transition-colors"
              >
                <span>
                  {lang === 'ar' ? 'صفحة التواصل' : 'Contact Page'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Compact Single Copyright Row (Zero Duplicated Social Icons) */}
        <div
          data-testid="footer-copyright-row"
          className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400"
        >
          <p>
            {lang === 'ar'
              ? '© 2026 بيكسل ستور (PIXEL STORE). جميع الحقوق محفوظة.'
              : '© 2026 PIXEL STORE. All rights reserved.'}
          </p>
          <span className="text-slate-500">
            {lang === 'ar'
              ? 'لابتوبات · تجميعات PC · قطع كمبيوتر · صيانة وحلول تبريد'
              : 'Laptops · Custom PCs · Components · Thermal Engineering'}
          </span>
        </div>
      </div>
    </footer>
  );
};
