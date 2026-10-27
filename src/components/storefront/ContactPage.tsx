import React from 'react';
import {
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from 'lucide-react';
import { Language, StoreSettings } from '../../types/store';

interface ContactPageProps {
  lang: Language;
  settings: StoreSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  lang,
  settings,
}) => {
  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-6 py-8 space-y-6">
      {/* Header Card */}
      <div className="bg-[#111318] bg-pixel-grid-dark text-white rounded-xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#EF875D] uppercase tracking-wider">
            {lang === 'ar' ? 'التواصل والدعم المباشر' : 'DIRECT STORE SUPPORT'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar'
              ? 'تواصل مع فريق بيكسل ستور عبر الهاتف أو واتساب'
              : 'Connect with PIXEL STORE via Phone, WhatsApp & Socials'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'نستقبل استفساراتكم حول اللابتوبات، تجميعات الـ PC، وتوفر القطع مباشرة عبر واتساب أو الهاتف أو بزيارتنا في المتجر.'
              : 'Reach our hardware specialists directly via WhatsApp, phone call, or visit our store showroom.'}
          </p>
        </div>
      </div>

      {/* Three Core Contact Channels: WhatsApp, Phone, Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. WhatsApp Direct */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#111318]">
              {lang === 'ar' ? 'الطلب والاستفسار عبر واتساب' : 'WhatsApp Direct Inquiry'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'القناة الأسرع لتأكيد توفر المنتجات، حجز اللابتوبات، واستشارات تجميعات الـ PC.'
                : 'Our primary channel for product requests, laptop reservations, and custom PC quotes.'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="font-mono-num text-xs font-bold text-[#111318]" dir="ltr">
              +{settings.whatsappNumber}
            </span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              {lang === 'ar' ? 'محادثة واتساب' : 'Open WhatsApp'}
            </a>
          </div>
        </div>

        {/* 2. Phone Call */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#8E4DEB]/10 text-[#8E4DEB] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#111318]">
              {lang === 'ar' ? 'الاتصال الهاتفي المباشر' : 'Showroom Phone Line'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'تحدث مباشرة مع مبيعات الصالة والدعم الفني خلال أوقات الدوام الرسمي.'
                : 'Speak directly with our showroom sales and hardware support desk during working hours.'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="font-mono-num text-xs font-bold text-[#111318]" dir="ltr">
              {settings.phone}
            </span>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-3.5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors"
            >
              {lang === 'ar' ? 'اتصل الآن' : 'Call Showroom'}
            </a>
          </div>
        </div>

        {/* 3. Social Media Channels */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#D66C9D]/15 text-[#D66C9D] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#111318]">
              {lang === 'ar' ? 'منصات التواصل الاجتماعي' : 'Social Media Channels'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'تابع أحدث الدفعات الواردة، مراجعات التجميعات، والعروض اليومية على حساباتنا الرسمية.'
                : 'Follow daily stock drops, custom PC build showcases, and flash offers.'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs font-mono-num">
            <div className="flex items-center justify-between text-slate-700">
              <span>Instagram:</span>
              <span className="font-bold text-[#8E4DEB]">{settings.instagramHandle}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Facebook:</span>
              <span className="font-bold text-[#111318]">{settings.facebookPage}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Telegram:</span>
              <span className="font-bold text-[#D66C9D]">{settings.telegramChannel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Showroom Address & Working Hours */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#8E4DEB] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-[#111318]">
              {lang === 'ar' ? 'عنوان صالة العرض' : 'Showroom Location'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {settings.address[lang]}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#EF875D] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-[#111318]">
              {lang === 'ar' ? 'أوقات الدوام' : 'Working Hours'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {settings.workingHours[lang]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
