import React from 'react';
import { Clock } from 'lucide-react';
import { Language } from '../../types/store';
import { getRemainingTimeParts } from '../../utils/storeLogic';

interface CountdownBadgeProps {
  endTimeIso: string;
  nowMs: number;
  lang: Language;
  variant?: 'compact' | 'prominent';
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({
  endTimeIso,
  nowMs,
  lang,
  variant = 'compact',
}) => {
  const parts = getRemainingTimeParts(endTimeIso, nowMs);

  if (parts.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
        {lang === 'ar' ? 'انتهى العرض' : 'Offer Ended'}
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  if (variant === 'prominent') {
    const units = [
      { value: pad(parts.days), label: lang === 'ar' ? 'يوم' : 'Days' },
      { value: pad(parts.hours), label: lang === 'ar' ? 'ساعة' : 'Hrs' },
      { value: pad(parts.minutes), label: lang === 'ar' ? 'دقيقة' : 'Min' },
      { value: pad(parts.seconds), label: lang === 'ar' ? 'ثانية' : 'Sec' },
    ];

    return (
      <div
        className="inline-flex items-center gap-1.5"
        dir="ltr"
        aria-label={lang === 'ar' ? 'الوقت المتبقي للعرض' : 'Offer remaining time'}
      >
        {units.map((u, idx) => (
          <React.Fragment key={u.label}>
            <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1 rounded bg-[#111318] border border-white/10 text-white">
              <span className="font-mono-num text-xs font-bold text-[#EF875D] leading-tight">
                {u.value}
              </span>
              <span className="text-[10px] text-slate-300 leading-none mt-0.5">
                {u.label}
              </span>
            </div>
            {idx < units.length - 1 && (
              <span className="font-mono-num text-xs font-bold text-[#D66C9D]">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318] bg-[#F4F3F7] px-2 py-1 rounded border border-slate-200/80"
      title={lang === 'ar' ? 'ينتهي العرض خلال' : 'Ends in'}
    >
      <Clock className="w-3 h-3 text-[#D66C9D] shrink-0" />
      <span className="text-slate-600">
        {lang === 'ar' ? 'ينتهي:' : 'Ends:'}
      </span>
      <span className="font-mono-num font-semibold text-[#111318]" dir="ltr">
        {parts.days > 0 ? `${parts.days}d ` : ''}
        {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
      </span>
    </div>
  );
};
