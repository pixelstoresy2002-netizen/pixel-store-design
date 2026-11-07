'use client';

import React from 'react';
import {
  Clock,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Send,
  Sparkles,
} from 'lucide-react';
import { Language, StoreSettings } from '../../types/store';
import {
  isExternalChannelVerified,
  isPhoneLinkVerified,
  isWhatsappLinkVerified,
  normalizeChannelUrl,
} from '../../utils/storeLogic';
import { ContactIconsBar } from './ContactIconsBar';

interface ContactPageProps {
  lang: Language;
  settings: StoreSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  lang,
  settings,
}) => {
  const primaryPhoneVerified = isPhoneLinkVerified(settings.phone);
  const secondaryPhoneVerified = isPhoneLinkVerified(settings.secondaryPhone);
  const whatsappVerified = isWhatsappLinkVerified(settings.whatsappNumber);
  const telegramVerified = isExternalChannelVerified(settings.telegramChannel);
  const instagramVerified = isExternalChannelVerified(settings.instagramHandle);
  const facebookVerified = isExternalChannelVerified(settings.facebookPage);
  const mapVerified = isExternalChannelVerified(settings.mapLocationUrl);

  const cleanPrimaryTel = settings.phone.replace(/[^+\d]/g, '');
  const cleanSecondaryTel = (settings.secondaryPhone || '').replace(
    /[^+\d]/g,
    ''
  );
  const cleanWhatsapp = settings.whatsappNumber.replace(/[^\d]/g, '');
  const telegramHref = normalizeChannelUrl(
    settings.telegramChannel,
    'https://t.me/'
  );
  const instagramHref = normalizeChannelUrl(
    settings.instagramHandle,
    'https://instagram.com/'
  );
  const facebookHref = normalizeChannelUrl(
    settings.facebookPage,
    'https://facebook.com/'
  );
  const mapHref =
    settings.mapLocationUrl && settings.mapLocationUrl.trim().startsWith('http')
      ? settings.mapLocationUrl.trim()
      : 'https://maps.google.com';

  const unconfiguredSuffix =
    lang === 'ar'
      ? ' (بيانات تجريبية — يُفعّل من إعدادات المتجر)'
      : ' (Demo placeholder — configure in Store Settings)';

  const contactGridChannels = [
    {
      id: 'whatsapp',
      verified: whatsappVerified,
      href: `https://wa.me/${cleanWhatsapp}`,
      isTel: false,
      title: lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      activeClass:
        'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-2 border-emerald-200 hover:border-emerald-600 cursor-pointer',
      disabledClass:
        'bg-emerald-50/70 text-emerald-700/75 border-2 border-emerald-200 opacity-75 cursor-not-allowed',
    },
    {
      id: 'telegram',
      verified: telegramVerified,
      href: telegramHref,
      isTel: false,
      title: lang === 'ar' ? 'قناة التلغرام' : 'Telegram',
      icon: <Send className="w-5 h-5" />,
      activeClass:
        'bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border-2 border-sky-200 hover:border-sky-600 cursor-pointer',
      disabledClass:
        'bg-sky-50/70 text-sky-700/75 border-2 border-sky-200 opacity-75 cursor-not-allowed',
    },
    {
      id: 'secondary-phone',
      verified: secondaryPhoneVerified,
      href: `tel:${cleanSecondaryTel}`,
      isTel: true,
      title: lang === 'ar' ? 'الرقم الثاني للتواصل' : 'Secondary Phone Line',
      icon: <PhoneCall className="w-5 h-5" />,
      activeClass:
        'bg-slate-100 hover:bg-[#111318] text-slate-700 hover:text-white border-2 border-slate-200 hover:border-[#111318] cursor-pointer',
      disabledClass:
        'bg-slate-100/70 text-slate-500 border-2 border-slate-200 opacity-75 cursor-not-allowed',
    },
    {
      id: 'location',
      verified: mapVerified,
      href: mapHref,
      isTel: false,
      title:
        lang === 'ar'
          ? 'موقع المتجر على الخريطة'
          : 'Store Location on Google Maps',
      icon: <MapPin className="w-5 h-5" />,
      activeClass:
        'bg-amber-50 hover:bg-[#EF875D] text-amber-800 hover:text-white border-2 border-amber-200 hover:border-[#EF875D] cursor-pointer',
      disabledClass:
        'bg-amber-50/70 text-amber-800/75 border-2 border-amber-200 opacity-75 cursor-not-allowed',
    },
    {
      id: 'instagram',
      verified: instagramVerified,
      href: instagramHref,
      isTel: false,
      title: lang === 'ar' ? 'صفحة إنستغرام' : 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      activeClass:
        'bg-pink-50 hover:bg-[#D66C9D] text-pink-700 hover:text-white border-2 border-pink-200 hover:border-[#D66C9D] cursor-pointer',
      disabledClass:
        'bg-pink-50/70 text-pink-700/75 border-2 border-pink-200 opacity-75 cursor-not-allowed',
    },
    {
      id: 'facebook',
      verified: facebookVerified,
      href: facebookHref,
      isTel: false,
      title: lang === 'ar' ? 'صفحة فيسبوك' : 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      activeClass:
        'bg-indigo-50 hover:bg-[#8E4DEB] text-indigo-700 hover:text-white border-2 border-indigo-200 hover:border-[#8E4DEB] cursor-pointer',
      disabledClass:
        'bg-indigo-50/70 text-indigo-700/75 border-2 border-indigo-200 opacity-75 cursor-not-allowed',
    },
  ];

  const primaryPhoneLabel =
    (lang === 'ar'
      ? 'الرقم الرئيسي للتواصل المباشر'
      : 'Primary Store Phone Line') +
    (primaryPhoneVerified ? '' : unconfiguredSuffix);

  return (
    <div
      className="max-w-[1100px] mx-auto px-4 lg:px-6 py-8 space-y-6"
      data-testid="contact-page"
    >
      {/* Header Card */}
      <div className="bg-[#111318] bg-pixel-grid-dark text-white rounded-xl p-6 lg:p-8 border-2 border-[#111318] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EF875D] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar'
                  ? 'التواصل والدعم الفني المباشر'
                  : 'DIRECT STORE & LAB SUPPORT'}
              </span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ar'
                ? 'تواصل مع فريق بيكسل ستور عبر الرقم الرئيسي أو قنواتنا الفورية'
                : 'Connect with PIXEL STORE via Primary Line & Instant Channels'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'نستقبل استفساراتكم حول اللابتوبات، تجميعات الـ PC، وحجوزات صيانة وحلول التبريد الاحترافية مباشرة.'
                : 'Reach our hardware specialists directly for laptops, custom PC rigs, and professional thermal servicing.'}
            </p>
          </div>

          <div className="shrink-0">
            <ContactIconsBar
              settings={settings}
              lang={lang}
              variant="cta-dark"
              showPrimaryPhone={true}
            />
          </div>
        </div>
      </div>

      {/* Primary Phone (Readable Text + Icon) & Icon-Only Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Primary Phone Line (ONLY channel allowed to show readable phone text) */}
        <div className="bg-white rounded-xl border-2 border-[#111318] p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-xl bg-[#8E4DEB]/15 text-[#8E4DEB] flex items-center justify-center border border-[#8E4DEB]/30">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-[#111318]">
              {lang === 'ar'
                ? 'الرقم الرئيسي للتواصل المباشر'
                : 'Primary Store Phone Line'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'اتصل مباشرة بمبيعات الصالة وقسم الصيانة والتبريد الاحترافي خلال أوقات العمل.'
                : 'Speak directly with our showroom sales and thermal engineering lab during business hours.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {primaryPhoneVerified ? (
              <a
                href={`tel:${cleanPrimaryTel}`}
                data-testid="contact-page-primary-phone"
                data-verified="true"
                title={primaryPhoneLabel}
                aria-label={primaryPhoneLabel}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#111318] hover:bg-[#8E4DEB] text-white text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-[#EF875D] shrink-0" />
                <span className="font-mono-num tracking-wide whitespace-nowrap" dir="ltr">
                  {settings.phone}
                </span>
              </a>
            ) : (
              <span
                role="link"
                aria-disabled="true"
                data-testid="contact-page-primary-phone"
                data-verified="false"
                title={primaryPhoneLabel}
                aria-label={primaryPhoneLabel}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#111318] text-white text-sm font-extrabold opacity-80 cursor-not-allowed select-none whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-[#EF875D] shrink-0" />
                <span className="font-mono-num tracking-wide whitespace-nowrap" dir="ltr">
                  {settings.phone}
                </span>
              </span>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-[#EF875D] shrink-0" />
              <span>{settings.workingHours[lang]}</span>
            </div>
          </div>
        </div>

        {/* 2. Icon-Only Instant Channels, Socials, Secondary Line & Map Location */}
        <div className="bg-white rounded-xl border-2 border-[#111318] p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-[#111318]">
              {lang === 'ar'
                ? 'قنوات التواصل الفوري، الموقع الجغرافي، والمنصات الرسمية'
                : 'Instant Messaging, Map Location & Social Channels'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'اضغط على أي أيقونة للانتقال الفوري إلى المحادثة أو الموقع على الخريطة أو صفحاتنا الرسمية.'
                : 'Click any icon below to launch instant chat, Google Maps directions, or our official social pages.'}
            </p>
          </div>

          {/* Standalone Icon Buttons (Disabled when unconfigured, Active when configured in Store Settings) */}
          <div className="grid grid-cols-6 gap-2.5 pt-2">
            {contactGridChannels.map((ch) => {
              const label = ch.title + (ch.verified ? '' : unconfiguredSuffix);
              return ch.verified ? (
                <a
                  key={ch.id}
                  href={ch.href}
                  target={ch.isTel ? undefined : '_blank'}
                  rel={ch.isTel ? undefined : 'noopener noreferrer'}
                  data-testid={`contact-page-icon-${ch.id}`}
                  data-verified="true"
                  title={label}
                  aria-label={label}
                  className={`h-12 rounded-xl flex items-center justify-center transition-all ${ch.activeClass}`}
                >
                  {ch.icon}
                </a>
              ) : (
                <span
                  key={ch.id}
                  role="link"
                  aria-disabled="true"
                  data-testid={`contact-page-icon-${ch.id}`}
                  data-verified="false"
                  title={label}
                  aria-label={label}
                  className={`h-12 rounded-xl flex items-center justify-center transition-all ${ch.disabledClass}`}
                >
                  {ch.icon}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

