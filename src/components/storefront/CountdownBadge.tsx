'use client';

import React from 'react';
import { Language } from '../../types/store';
import { getRemainingTimeParts } from '../../utils/storeLogic';

interface CountdownBadgeProps {
  endTimeIso: string;
  nowMs: number;
  lang: Language;
  variant?: 'compact' | 'prominent';
}

/**
 * Unified Pixel-themed dark countdown timer used across Featured Offers,
 * secondary offer cards, product cards, and Product Detail offer banners.
 * Uses the Featured Offer 4-unit structure (Days : Hrs : Min : Sec) as the
 * single visual reference, scaled proportionally for compact vs prominent cards.
 */
export const CountdownBadge: React.FC<CountdownBadgeProps> = ({
  endTimeIso,
  nowMs,
  lang,
  variant = 'compact',
}) => {
  const parts = getRemainingTimeParts(endTimeIso, nowMs);

  if (parts.expired) {
    return (
      <span
        data-testid={`countdown-expired-${variant}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500"
      >
        {lang === 'ar' ? 'انتهى العرض' : 'Offer Ended'}
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  const units = [
    { key: 'days', value: pad(parts.days), label: lang === 'ar' ? 'يوم' : 'Days' },
    { key: 'hours', value: pad(parts.hours), label: lang === 'ar' ? 'ساعة' : 'Hrs' },
    { key: 'minutes', value: pad(parts.minutes), label: lang === 'ar' ? 'دقيقة' : 'Min' },
    { key: 'seconds', value: pad(parts.seconds), label: lang === 'ar' ? 'ثانية' : 'Sec' },
  ];

  const isProminent = variant === 'prominent';

  const containerClass = isProminent
    ? 'inline-flex items-center gap-1 sm:gap-1.5 max-w-full'
    : 'inline-flex items-center gap-0.5 sm:gap-1 max-w-full';

  const unitBoxClass = isProminent
    ? 'flex flex-col items-center justify-center min-w-[38px] sm:min-w-[42px] px-1.5 sm:px-2 py-1 rounded bg-[#111318] border border-white/10 text-white shrink-0'
    : 'flex flex-col items-center justify-center min-w-[30px] sm:min-w-[34px] px-1 sm:px-1.5 py-0.5 rounded bg-[#111318] border border-white/10 text-white shrink-0';

  const digitClass = isProminent
    ? 'font-mono-num text-xs font-bold text-[#EF875D] leading-tight'
    : 'font-mono-num text-[10px] sm:text-[11px] font-bold text-[#EF875D] leading-tight';

  const labelClass = isProminent
    ? 'text-[9.5px] sm:text-[10px] text-slate-300 leading-none mt-0.5 whitespace-nowrap'
    : 'text-[8.5px] sm:text-[9px] text-slate-300 leading-none mt-0.5 whitespace-nowrap';

  const separatorClass = isProminent
    ? 'font-mono-num text-xs font-bold text-[#D66C9D] select-none'
    : 'font-mono-num text-[10px] font-bold text-[#D66C9D] select-none';

  return (
    <div
      data-testid={`countdown-badge-${variant}`}
      data-variant={variant}
      className={containerClass}
      dir="ltr"
      aria-label={
        lang === 'ar' ? 'الوقت المتبقي للعرض' : 'Offer remaining time'
      }
    >
      {units.map((u, idx) => (
        <React.Fragment key={u.key}>
          <div data-testid={`countdown-unit-${u.key}`} className={unitBoxClass}>
            <span className={digitClass}>{u.value}</span>
            <span className={labelClass}>{u.label}</span>
          </div>
          {idx < units.length - 1 && (
            <span className={separatorClass} aria-hidden="true">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
