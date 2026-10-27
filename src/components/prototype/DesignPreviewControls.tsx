import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { ArabicFontId, DesignThemeId, Language } from '../../types/store';
import {
  ARABIC_FONT_OPTIONS,
  DEFAULT_ARABIC_FONT_ID,
  DEFAULT_THEME_ID,
  DESIGN_THEME_OPTIONS,
  formatDesignSelectionSummary,
} from '../../utils/storeLogic';

/**
 * PROTOTYPE-ONLY COMPONENT: DesignPreviewControls
 * Temporary interactive client-preview control for comparing 3 design themes
 * and 6 Arabic font families before final Next.js production implementation.
 * Safe to remove in one step once the client approves a final direction.
 */
interface DesignPreviewControlsProps {
  lang: Language;
  themeId: DesignThemeId;
  fontId: ArabicFontId;
  onSelectTheme: (theme: DesignThemeId) => void;
  onSelectFont: (font: ArabicFontId) => void;
  onReset: () => void;
  variant?: 'navbar-dark' | 'navbar-light' | 'mobile-inline';
}

export const DesignPreviewControls: React.FC<DesignPreviewControlsProps> = ({
  lang,
  themeId,
  fontId,
  onSelectTheme,
  onSelectFont,
  onReset,
  variant = 'navbar-dark',
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectionSummary = formatDesignSelectionSummary(themeId, fontId);
  const isDefault =
    themeId === DEFAULT_THEME_ID && fontId === DEFAULT_ARABIC_FONT_ID;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleCopySelection = async () => {
    try {
      await navigator.clipboard.writeText(selectionSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const renderPanelContent = () => (
    <div className="space-y-4 text-start">
      {/* Header & Reset */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-[#111318]">
            {lang === 'ar'
              ? 'خيارات التصميم والخطوط (معاينة العميل)'
              : 'Design & Font Playground (Client Preview)'}
          </div>
          <div
            className="font-mono-num text-[11px] text-slate-500 mt-0.5"
            dir="ltr"
          >
            {selectionSummary}
          </div>
        </div>
        {variant !== 'mobile-inline' && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={lang === 'ar' ? 'إغلاق خيارات التصميم' : 'Close Design Options'}
            className="p-1 rounded text-slate-400 hover:text-[#111318] hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 1. Theme Selector (3 Distinct Directions) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {lang === 'ar'
              ? '1. الاتجاه البصري والتخطيط (Theme)'
              : '1. Visual Direction & Layout Theme'}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {DESIGN_THEME_OPTIONS.map((t) => {
            const active = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                data-testid={`theme-option-${t.id}`}
                onClick={() => onSelectTheme(t.id)}
                aria-pressed={active}
                className={`w-full p-2.5 rounded-lg border text-start transition-colors flex items-start justify-between gap-2 ${
                  active
                    ? 'bg-[#111318] border-[#111318] text-white'
                    : 'bg-slate-50/80 border-slate-200/90 text-[#111318] hover:border-[#8E4DEB]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>{lang === 'ar' ? t.nameAr : t.nameEn}</span>
                    {t.id === 'hybrid' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                          active
                            ? 'bg-white/15 text-slate-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {lang === 'ar' ? 'الافتراضي' : 'Default'}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 leading-snug ${
                      active ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {lang === 'ar' ? t.descAr : t.descEn}
                  </p>
                </div>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    active
                      ? 'bg-[#8E4DEB] text-white'
                      : 'border border-slate-300'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Arabic Font Selector (6 Authentic Fonts with Live Sample) */}
      <div className="space-y-2">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {lang === 'ar'
            ? '2. الخط العربي (6 خطوط حقيقية للمقارنة)'
            : '2. Arabic Typography (6 Real Fonts)'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pe-0.5">
          {ARABIC_FONT_OPTIONS.map((f) => {
            const active = fontId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                data-testid={`font-option-${f.id}`}
                onClick={() => onSelectFont(f.id)}
                aria-pressed={active}
                className={`p-2 rounded-lg border text-start transition-colors flex flex-col justify-between gap-1 ${
                  active
                    ? 'bg-[#8E4DEB]/10 border-[#8E4DEB] text-[#111318]'
                    : 'bg-white border-slate-200 text-[#111318] hover:border-slate-300'
                }`}
              >
                <div className="w-full flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-[#111318]">
                    {f.name}
                  </span>
                  {active && (
                    <Check className="w-3.5 h-3.5 text-[#8E4DEB] shrink-0" />
                  )}
                </div>
                <div
                  dir="rtl"
                  style={{ fontFamily: f.cssFamily }}
                  className={`${f.previewClass} text-xs text-slate-700 leading-snug truncate w-full`}
                >
                  اكتشف أحدث المنتجات والعروض
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Footer Actions: Copy Current Selection & Reset */}
      <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          type="button"
          data-testid="design-copy-btn"
          onClick={handleCopySelection}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F4F3F7] hover:bg-slate-200 text-[#111318] text-xs font-semibold transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">
                {lang === 'ar' ? 'تم نسخ الاختيار!' : 'Selection Copied!'}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#8E4DEB]" />
              <span>
                {lang === 'ar'
                  ? 'نسخ الاختيار لإرساله'
                  : 'Copy Selection'}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          data-testid="design-reset-btn"
          disabled={isDefault}
          onClick={onReset}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            isDefault
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-[#111318] hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'الافتراضي' : 'Reset Default'}</span>
        </button>
      </div>
    </div>
  );

  if (variant === 'mobile-inline') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3.5">
        {renderPanelContent()}
      </div>
    );
  }

  const buttonClasses =
    variant === 'navbar-light'
      ? 'px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 text-xs font-medium'
      : 'px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 text-xs font-medium';

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        data-testid="design-preview-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${buttonClasses}`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#EF875D]" />
        <span>{lang === 'ar' ? 'خيارات التصميم' : 'Design Options'}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={lang === 'ar' ? 'خيارات التصميم' : 'Design Options'}
          className="absolute end-0 mt-2 w-[340px] sm:w-[390px] rounded-xl bg-white text-[#111318] border border-slate-200 shadow-xl p-4 z-50"
        >
          {renderPanelContent()}
        </div>
      )}
    </div>
  );
};
