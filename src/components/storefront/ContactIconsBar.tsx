'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Send,
} from 'lucide-react';
import { Language, StoreSettings } from '../../types/store';
import {
  isExternalChannelVerified,
  isPhoneLinkVerified,
  isWhatsappLinkVerified,
  normalizeChannelUrl,
} from '../../utils/storeLogic';

interface ContactIconsBarProps {
  settings: StoreSettings;
  lang: Language;
  variant?: 'utility' | 'footer' | 'card' | 'cta-dark';
  showPrimaryPhone?: boolean;
  showIconChannels?: boolean;
  whatsappPrefillText?: string;
}

export const ContactIconsBar: React.FC<ContactIconsBarProps> = ({
  settings,
  lang,
  variant = 'card',
  showPrimaryPhone = true,
  showIconChannels = true,
  whatsappPrefillText,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [moreOpen]);

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
  const whatsappHref = whatsappPrefillText
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        whatsappPrefillText
      )}`
    : `https://wa.me/${cleanWhatsapp}`;

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

  const isUtility = variant === 'utility';
  const isFooter = variant === 'footer';
  const isDark =
    variant === 'utility' || variant === 'footer' || variant === 'cta-dark';

  const primaryPhoneBaseClasses = isUtility
    ? 'inline-flex items-center gap-1.5 h-7 px-2.5 rounded bg-white/10 text-white border border-white/15 text-[11.5px] font-bold transition-colors shrink-0'
    : isFooter
    ? 'inline-flex items-center gap-2 h-8.5 px-3 rounded-md bg-[#1A1D26] text-white border border-slate-700/80 text-xs font-bold transition-colors shrink-0'
    : variant === 'cta-dark'
    ? 'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8E4DEB] text-white text-sm font-bold shadow-sm transition-colors shrink-0'
    : 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111318] text-white text-sm font-bold transition-colors shrink-0';

  const primaryPhoneInteractiveClasses = primaryPhoneVerified
    ? isUtility
      ? 'hover:bg-white/15 cursor-pointer'
      : isFooter
      ? 'hover:bg-[#232734] cursor-pointer'
      : variant === 'cta-dark'
      ? 'hover:bg-[#7b3dd4] cursor-pointer'
      : 'hover:bg-[#8E4DEB] cursor-pointer'
    : 'opacity-80 cursor-not-allowed select-none';

  const iconBtnBase = isUtility
    ? 'w-7 h-7 rounded flex items-center justify-center border transition-colors shrink-0'
    : isFooter
    ? 'w-8.5 h-8.5 rounded-md flex items-center justify-center border transition-colors shrink-0'
    : 'w-9.5 h-9.5 rounded-lg flex items-center justify-center border transition-all shrink-0';

  const iconThemeActiveClasses = isDark
    ? 'bg-white/10 hover:bg-[#8E4DEB] text-slate-200 hover:text-white border-white/15 hover:border-[#8E4DEB] cursor-pointer'
    : 'bg-slate-100 hover:bg-[#111318] text-slate-700 hover:text-white border-slate-200/90 hover:border-[#111318] cursor-pointer';

  const iconThemeDisabledClasses = isDark
    ? 'bg-white/10 text-slate-300 border-white/15 opacity-75 cursor-not-allowed'
    : 'bg-slate-100 text-slate-500 border-slate-200/90 opacity-75 cursor-not-allowed';

  const iconSize = isUtility ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const unconfiguredSuffix =
    lang === 'ar'
      ? ' (بيانات تجريبية — يُفعّل من إعدادات المتجر)'
      : ' (Demo placeholder — configure in Store Settings)';

  const allChannels = [
    {
      id: 'whatsapp',
      verified: whatsappVerified,
      href: whatsappHref,
      isTel: false,
      title: lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp',
      shortLabel: lang === 'ar' ? 'واتساب' : 'WhatsApp',
      icon: <MessageCircle className={iconSize} />,
      accentClass: whatsappVerified
        ? isDark
          ? 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border-emerald-500/30 cursor-pointer'
          : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-200 cursor-pointer'
        : isDark
        ? 'bg-emerald-500/15 text-emerald-300/80 border-emerald-500/25 opacity-75 cursor-not-allowed'
        : 'bg-emerald-50/70 text-emerald-700/75 border-emerald-200 opacity-75 cursor-not-allowed',
    },
    {
      id: 'telegram',
      verified: telegramVerified,
      href: telegramHref,
      isTel: false,
      title:
        lang === 'ar' ? 'قناة التلغرام الرسمية' : 'Official Telegram Channel',
      shortLabel: lang === 'ar' ? 'تلغرام' : 'Telegram',
      icon: <Send className={iconSize} />,
      accentClass: telegramVerified
        ? iconThemeActiveClasses
        : iconThemeDisabledClasses,
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
      shortLabel: lang === 'ar' ? 'موقع المتجر' : 'Map Location',
      icon: <MapPin className={iconSize} />,
      accentClass: mapVerified
        ? iconThemeActiveClasses
        : iconThemeDisabledClasses,
    },
    {
      id: 'instagram',
      verified: instagramVerified,
      href: instagramHref,
      isTel: false,
      title: lang === 'ar' ? 'صفحة إنستغرام' : 'Instagram Page',
      shortLabel: lang === 'ar' ? 'إنستغرام' : 'Instagram',
      icon: <Instagram className={iconSize} />,
      accentClass: instagramVerified
        ? iconThemeActiveClasses
        : iconThemeDisabledClasses,
    },
    {
      id: 'facebook',
      verified: facebookVerified,
      href: facebookHref,
      isTel: false,
      title: lang === 'ar' ? 'صفحة فيسبوك' : 'Facebook Page',
      shortLabel: lang === 'ar' ? 'فيسبوك' : 'Facebook',
      icon: <Facebook className={iconSize} />,
      accentClass: facebookVerified
        ? iconThemeActiveClasses
        : iconThemeDisabledClasses,
    },
    {
      id: 'secondary-phone',
      verified: secondaryPhoneVerified,
      href: `tel:${cleanSecondaryTel}`,
      isTel: true,
      title:
        lang === 'ar' ? 'الرقم الثاني للتواصل المباشر' : 'Secondary Phone Line',
      shortLabel: lang === 'ar' ? 'الرقم الإضافي' : 'Secondary Line',
      icon: <PhoneCall className={iconSize} />,
      accentClass: secondaryPhoneVerified
        ? iconThemeActiveClasses
        : iconThemeDisabledClasses,
    },
  ];

  const primaryUtilityChannels = allChannels.slice(0, 3);
  const secondaryUtilityChannels = allChannels.slice(3);

  const footerChannels = allChannels.filter(
    (c) => c.id !== 'secondary-phone'
  );

  const visibleInlineChannels = isUtility
    ? primaryUtilityChannels
    : isFooter
    ? footerChannels
    : allChannels;

  const primaryPhoneTitle =
    (lang === 'ar'
      ? 'الرقم الرئيسي للتواصل المباشر'
      : 'Primary Store Phone') +
    (primaryPhoneVerified ? '' : unconfiguredSuffix);

  return (
    <div
      className={`flex flex-wrap items-center ${
        isUtility ? 'gap-1.5' : 'gap-2'
      }`}
      data-testid={`contact-icons-bar-${variant}`}
    >
      {showPrimaryPhone &&
        (primaryPhoneVerified ? (
          <a
            href={`tel:${cleanPrimaryTel}`}
            data-testid="primary-phone-link"
            data-verified="true"
            title={primaryPhoneTitle}
            aria-label={primaryPhoneTitle}
            className={`${primaryPhoneBaseClasses} ${primaryPhoneInteractiveClasses}`}
          >
            <Phone
              className={
                isUtility
                  ? 'w-3.5 h-3.5 text-[#EF875D]'
                  : 'w-4 h-4 text-[#EF875D]'
              }
            />
            <span className="font-mono-num tracking-wide" dir="ltr">
              {settings.phone}
            </span>
          </a>
        ) : (
          <span
            role="link"
            aria-disabled="true"
            data-testid="primary-phone-link"
            data-verified="false"
            title={primaryPhoneTitle}
            aria-label={primaryPhoneTitle}
            className={`${primaryPhoneBaseClasses} ${primaryPhoneInteractiveClasses}`}
          >
            <Phone
              className={
                isUtility
                  ? 'w-3.5 h-3.5 text-[#EF875D]'
                  : 'w-4 h-4 text-[#EF875D]'
              }
            />
            <span className="font-mono-num tracking-wide" dir="ltr">
              {settings.phone}
            </span>
          </span>
        ))}

      {showIconChannels && (
        <div
          className={`flex items-center ${isUtility ? 'gap-1' : 'gap-1.5'}`}
        >
          {visibleInlineChannels.map((ch) => {
            const label = ch.title + (ch.verified ? '' : unconfiguredSuffix);
            return ch.verified ? (
              <a
                key={ch.id}
                href={ch.href}
                target={ch.isTel ? undefined : '_blank'}
                rel={ch.isTel ? undefined : 'noopener noreferrer'}
                data-testid={`contact-icon-${ch.id}`}
                data-verified="true"
                title={label}
                aria-label={label}
                className={`${iconBtnBase} ${ch.accentClass}`}
              >
                {ch.icon}
              </a>
            ) : (
              <span
                key={ch.id}
                role="link"
                aria-disabled="true"
                data-testid={`contact-icon-${ch.id}`}
                data-verified="false"
                title={label}
                aria-label={label}
                className={`${iconBtnBase} ${ch.accentClass}`}
              >
                {ch.icon}
              </span>
            );
          })}

          {/* Compact overflow menu in utility bar for secondary channels (Instagram, Facebook, Secondary Phone) */}
          {isUtility && secondaryUtilityChannels.length > 0 && (
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                data-testid="utility-more-channels-trigger"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-expanded={moreOpen}
                aria-label={
                  lang === 'ar'
                    ? 'قنوات تواصل إضافية'
                    : 'More contact channels'
                }
                title={
                  lang === 'ar'
                    ? 'قنوات تواصل إضافية'
                    : 'More contact channels'
                }
                className="h-7 px-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 inline-flex items-center gap-0.5 text-[11px] font-semibold transition-colors"
              >
                <span>{lang === 'ar' ? 'المزيد' : 'More'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {moreOpen && (
                <div
                  data-testid="utility-more-channels-menu"
                  className="absolute top-full mt-1.5 end-0 z-50 w-44 rounded-md bg-[#161922] border border-white/20 shadow-xl p-1.5 space-y-0.5"
                >
                  {secondaryUtilityChannels.map((ch) => {
                    const label =
                      ch.title + (ch.verified ? '' : unconfiguredSuffix);
                    return ch.verified ? (
                      <a
                        key={ch.id}
                        href={ch.href}
                        target={ch.isTel ? undefined : '_blank'}
                        rel={ch.isTel ? undefined : 'noopener noreferrer'}
                        data-testid={`contact-icon-${ch.id}`}
                        data-verified="true"
                        title={label}
                        aria-label={label}
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-[#8E4DEB] hover:text-white transition-colors"
                      >
                        {ch.icon}
                        <span>{ch.shortLabel}</span>
                      </a>
                    ) : (
                      <span
                        key={ch.id}
                        role="link"
                        aria-disabled="true"
                        data-testid={`contact-icon-${ch.id}`}
                        data-verified="false"
                        title={label}
                        aria-label={label}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs text-slate-400 opacity-75 cursor-not-allowed select-none"
                      >
                        {ch.icon}
                        <span>{ch.shortLabel}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

