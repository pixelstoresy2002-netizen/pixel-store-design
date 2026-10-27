import React from 'react';
import { Brand, Language, Offer, Product } from '../../types/store';
import {
  formatSyp,
  formatUsd,
  resolveProductPricing,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';
import { CountdownBadge } from './CountdownBadge';

interface ProductCardProps {
  product: Product;
  brands: Brand[];
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  lang: Language;
  showCountdown?: boolean;
  onSelectProduct: (productId: string) => void;
  onRequestProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  brands,
  offers,
  usdToSypRate,
  nowMs,
  lang,
  showCountdown = false,
  onSelectProduct,
  onRequestProduct,
}) => {
  const brand = brands.find((b) => b.id === product.brandId);
  const pricing = resolveProductPricing(product, offers, usdToSypRate, nowMs);

  // Determine single top status tag (Zero-Pill / No Badge Spam rule: max 1 tag)
  let topTagText = '';
  let topTagTone = 'bg-[#111318] text-white';

  if (pricing.hasActiveOffer) {
    topTagText =
      lang === 'ar'
        ? `خصم ${pricing.discountPercent}%`
        : `-${pricing.discountPercent}% OFF`;
    topTagTone = 'bg-[#D66C9D] text-white';
  } else if (product.condition === 'USED') {
    topTagText = lang === 'ar' ? 'مستعمل نظيف' : 'USED';
    topTagTone = 'bg-[#EF875D] text-[#111318]';
  } else if (product.isBestSeller) {
    topTagText = lang === 'ar' ? 'الأكثر مبيعاً' : 'BEST SELLER';
    topTagTone = 'bg-[#8E4DEB] text-white';
  } else if (product.isNewArrival) {
    topTagText = lang === 'ar' ? 'وصل حديثاً' : 'NEW ARRIVAL';
    topTagTone = 'bg-[#111318] text-white';
  }

  const availabilityLabel =
    product.availability === 'IN_STOCK'
      ? lang === 'ar'
        ? 'متوفر'
        : 'In Stock'
      : product.availability === 'ON_REQUEST'
      ? lang === 'ar'
        ? 'حسب الطلب'
        : 'On Request'
      : lang === 'ar'
      ? 'غير متوفر'
      : 'Out of Stock';

  const conditionLabel =
    product.condition === 'NEW'
      ? lang === 'ar'
        ? 'جديد'
        : 'NEW'
      : lang === 'ar'
      ? 'مستعمل'
      : 'USED';

  return (
    <article
      className="group relative flex flex-col bg-white rounded-lg border border-slate-200/90 hover:border-[#8E4DEB]/60 transition-all duration-150 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Image Container with smooth desktop hover transition from primary to secondary image */}
      <button
        type="button"
        onClick={() => onSelectProduct(product.id)}
        aria-label={product.name[lang]}
        className="relative w-full aspect-[4/3] bg-[#F8F7FA] overflow-hidden text-start focus-visible:outline-2 focus-visible:outline-[#8E4DEB]"
      >
        {/* Primary Image */}
        <div className="absolute inset-0 transition-opacity duration-200 ease-out group-hover:opacity-0">
          <ProductVisual
            visualKey={product.primaryImage}
            alt={product.name[lang]}
          />
        </div>
        {/* Secondary Image (Revealed on pointer hover) */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
          <ProductVisual
            visualKey={product.secondaryImage}
            alt={`${product.name[lang]} - 2`}
          />
        </div>

        {/* Single Top Tag */}
        {topTagText && (
          <span
            className={`absolute top-2.5 start-2.5 px-2 py-0.5 text-[11px] font-bold tracking-tight rounded-sm ${topTagTone}`}
          >
            {topTagText}
          </span>
        )}

        {/* Subtle Secondary View Indicator on Hover */}
        <span className="absolute bottom-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[#111318]/80 text-white text-[10px] font-mono-num px-1.5 py-0.5 rounded-sm pointer-events-none">
          2/2
        </span>
      </button>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3 justify-between gap-2.5">
        <div>
          {/* Clean Unboxed Metadata Line (Brand · Condition · Availability) */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 uppercase tracking-tight">
              {brand?.name ?? 'PIXEL'}
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={
                product.condition === 'USED'
                  ? 'text-[#D96B38] font-medium'
                  : 'text-slate-600'
              }
            >
              {conditionLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={
                product.availability === 'OUT_OF_STOCK'
                  ? 'text-rose-600 font-medium'
                  : 'text-emerald-700 font-medium'
              }
            >
              {availabilityLabel}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-[13.5px] font-semibold text-[#111318] leading-snug line-clamp-2 min-h-[2.6em]">
            <button
              type="button"
              onClick={() => onSelectProduct(product.id)}
              className="text-start hover:text-[#8E4DEB] transition-colors focus-visible:outline-none"
            >
              {product.name[lang]}
            </button>
          </h3>
        </div>

        {/* Optional Offer Countdown */}
        {showCountdown && pricing.activeOffer && (
          <div className="pt-0.5">
            <CountdownBadge
              endTimeIso={pricing.activeOffer.endTime}
              nowMs={nowMs}
              lang={lang}
              variant="compact"
            />
          </div>
        )}

        {/* Dual Price Hierarchy + Action */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            {/* USD Primary Price */}
            <div className="flex items-baseline gap-1.5" dir="ltr">
              <span className="font-mono-num text-base font-bold text-[#111318]">
                {formatUsd(pricing.effectiveUsd)}
              </span>
              {pricing.hasActiveOffer && (
                <span className="font-mono-num text-xs text-slate-400 line-through">
                  {formatUsd(pricing.originalUsd)}
                </span>
              )}
            </div>
            {/* Converted SYP Price */}
            <div className="font-mono-num text-[11px] font-medium text-slate-500 mt-0.5">
              {formatSyp(pricing.effectiveSyp, lang)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRequestProduct(product)}
            disabled={product.availability === 'OUT_OF_STOCK'}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
              product.availability === 'OUT_OF_STOCK'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#F4F3F7] text-[#111318] hover:bg-[#8E4DEB] hover:text-white active:scale-[0.99]'
            }`}
          >
            {lang === 'ar' ? 'اطلب الآن' : 'Request'}
          </button>
        </div>
      </div>
    </article>
  );
};
