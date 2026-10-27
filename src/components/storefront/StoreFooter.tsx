import React from 'react';
import { Clock, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Category, Language, StoreSettings } from '../../types/store';
import { PixelLogo } from '../visuals/PixelLogo';
import { StorefrontView } from './StoreHeader';

interface StoreFooterProps {
  lang: Language;
  settings: StoreSettings;
  categories: Category[];
  onNavigate: (view: StorefrontView, categoryId?: string, subcategoryId?: string) => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  lang,
  settings,
  categories,
  onNavigate,
}) => {
  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <footer className="bg-[#111318] text-slate-300 border-t-2 border-[#8E4DEB] mt-16">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <PixelLogo variant="dark" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline[lang]}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs">
              <span className="text-slate-400">
                {lang === 'ar' ? 'سعر الصرف المعتمد:' : 'Exchange Rate:'}
              </span>
              <span className="font-mono-num font-bold text-[#EF875D]" dir="ltr">
                1 USD = {settings.usdToSypRate.toLocaleString('en-US')} SYP
              </span>
            </div>
          </div>

          {/* Column 2: Main Categories */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">
              {lang === 'ar' ? 'أقسام المتجر' : 'Store Categories'}
            </h3>
            <ul className="space-y-2.5 text-xs">
              {topCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('category', cat.id)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name[lang]}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('offers')}
                  className="text-[#D66C9D] hover:text-white font-semibold transition-colors"
                >
                  {lang === 'ar' ? 'العروض والتخفيضات الحصرية' : 'Exclusive Offers & Deals'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Use-Case Shortcuts */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">
              {lang === 'ar' ? 'تصفح حسب الاستخدام' : 'Browse by Use Case'}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'accessories', 'keyboards')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar'
                    ? 'لوحات مفاتيح للألعاب والعمل المكتبي'
                    : 'Gaming & Office Keyboards'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'accessories', 'mice')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar'
                    ? 'ماوسات احترافية للألعاب والمكاتب'
                    : 'Esports & Ergonomic Office Mice'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'laptops', 'new-laptops')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar'
                    ? 'لابتوبات جديدة بالكرتونة'
                    : 'Brand-New Laptops'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'laptops', 'used-laptops')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar'
                    ? 'لابتوبات مستعملة مفحوصة ومكفولة'
                    : 'Certified Clean Used Laptops'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'audio', 'iem')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar'
                    ? 'سماعات IEM وسماعات محيطية'
                    : 'IEM Earphones & Gaming Headsets'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact & Showroom Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white mb-4">
              {lang === 'ar' ? 'التواصل والعنوان' : 'Showroom & Contact'}
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-[#8E4DEB] shrink-0 mt-0.5" />
              <span>{settings.address[lang]}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-[#D66C9D] shrink-0" />
              <span className="font-mono-num" dir="ltr">
                {settings.phone}
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-[#EF875D] shrink-0 mt-0.5" />
              <span>{settings.workingHours[lang]}</span>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Support'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {lang === 'ar'
              ? `© ${new Date().getFullYear()} بيكسل ستور (PIXEL STORE). جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} PIXEL STORE. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4 font-mono-num text-[11px] text-slate-400">
            <span>Instagram: {settings.instagramHandle}</span>
            <span>·</span>
            <span>Telegram: {settings.telegramChannel}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
