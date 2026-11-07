'use client';

import React, { useMemo } from 'react';
import { Clock, Flame, RotateCcw, Sparkles, TimerOff } from 'lucide-react';
import {
  Brand,
  Language,
  Offer,
  Product,
} from '../../types/store';
import {
  formatSyp,
  formatUsd,
  getProductGalleryImages,
  isOfferActive,
  resolveProductPricing,
} from '../../utils/storeLogic';
import { CountdownBadge } from './CountdownBadge';
import {
  ProductGalleryStage,
  useProductHoverGallery,
} from './ProductGalleryHover';
import { StorefrontView } from './StoreHeader';

interface OfferCardItemProps {
  offer: Offer;
  product: Product;
  brand?: Brand;
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  lang: Language;
  isFeaturedCard: boolean;
  onSelectProduct: (productId: string) => void;
  onRequestProduct: (product: Product) => void;
}

const OfferCardItem: React.FC<OfferCardItemProps> = ({
  offer,
  product,
  brand,
  offers,
  usdToSypRate,
  nowMs,
  lang,
  isFeaturedCard,
  onSelectProduct,
  onRequestProduct,
}) => {
  const pricing = resolveProductPricing(product, offers, usdToSypRate, nowMs);
  const galleryImages = useMemo(
    () => getProductGalleryImages(product),
    [product]
  );
  const { activeIndex, isHovering, handleMouseEnter, handleMouseLeave } =
    useProductHoverGallery(galleryImages);

  return (
    <article
      data-testid={`offer-card-${offer.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-lg bg-white border transition-all overflow-hidden flex flex-col justify-between ${
        isFeaturedCard
          ? 'border-2 border-[#111318] shadow-xs'
          : 'border-slate-200/90 hover:border-[#8E4DEB]'
      }`}
    >
      <div>
        {/* Compact Top Offer Strip */}
        <div className="px-3 py-2 bg-[#111318] text-white flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF875D] truncate">
            <Flame className="w-3 h-3 fill-[#EF875D] shrink-0" />
            <span className="truncate">{offer.badgeText[lang]}</span>
          </span>
          <span className="font-mono-num text-[11px] font-extrabold px-1.5 py-0.5 rounded-xs bg-[#D66C9D] text-white shrink-0">
            -{pricing.discountPercent}%
          </span>
        </div>

        {/* Compact Product Visual Container with 5-Image Automatic Hover Cycling */}
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="relative w-full h-36 sm:h-40 bg-[#F8F7FA] border-b border-slate-100 overflow-hidden flex items-center justify-center group cursor-pointer"
        >
          <ProductGalleryStage
            images={galleryImages}
            activeIndex={activeIndex}
            isHovering={isHovering}
            productName={product.name[lang]}
            showCounterBadge={true}
          />
        </button>

        {/* Compact Offer & Product Metadata */}
        <div className="p-3 sm:p-3.5 space-y-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
            <span className="font-bold text-[#8E4DEB] uppercase shrink-0">
              {brand?.name}
            </span>
            <span>·</span>
            <span className="truncate">{offer.title[lang]}</span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-[#111318] leading-snug line-clamp-2 min-h-[2.5em]">
            <button
              type="button"
              onClick={() => onSelectProduct(product.id)}
              className="text-start hover:text-[#8E4DEB] transition-colors cursor-pointer"
            >
              {product.name[lang]}
            </button>
          </h3>

          {/* Unified Countdown Timer */}
          <div className="pt-0.5">
            <CountdownBadge
              endTimeIso={offer.endTime}
              nowMs={nowMs}
              lang={lang}
              variant="compact"
            />
          </div>
        </div>
      </div>

      {/* Compact Pricing + Request CTA */}
      <div className="px-3 sm:px-3.5 py-2.5 border-t border-slate-100 bg-[#FAF9FC] flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5" dir="ltr">
            <span className="font-mono-num text-base sm:text-lg font-extrabold text-[#111318]">
              {formatUsd(pricing.effectiveUsd)}
            </span>
            <span className="font-mono-num text-[11px] text-slate-400 line-through">
              {formatUsd(pricing.originalUsd)}
            </span>
          </div>
          <div className="font-mono-num text-[11px] font-semibold text-[#8E4DEB] truncate">
            {formatSyp(pricing.effectiveSyp, lang)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRequestProduct(product)}
          className="px-3 py-1.5 rounded bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {lang === 'ar' ? 'اطلب العرض' : 'Request Deal'}
        </button>
      </div>
    </article>
  );
};

interface OffersPageProps {
  lang: Language;
  products: Product[];
  brands: Brand[];
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  simulateExpiredOffers: boolean;
  onToggleSimulateExpired: () => void;
  onNavigate: (view: StorefrontView, categoryId?: string) => void;
  onSelectProduct: (productId: string) => void;
  onRequestProduct: (product: Product) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  lang,
  products,
  brands,
  offers,
  usdToSypRate,
  nowMs,
  simulateExpiredOffers,
  onToggleSimulateExpired,
  onNavigate,
  onSelectProduct,
  onRequestProduct,
}) => {
  const activeOffers = offers.filter((o) => isOfferActive(o, nowMs));
  const exclusiveOffers = activeOffers.filter((o) => o.isExclusive);
  const regularOffers = activeOffers.filter((o) => !o.isExclusive);

  const renderOfferCard = (offer: Offer, isFeaturedCard: boolean) => {
    const product = products.find((p) => p.id === offer.productId);
    if (!product) return null;

    const brand = brands.find((b) => b.id === product.brandId);

    return (
      <OfferCardItem
        key={offer.id}
        offer={offer}
        product={product}
        brand={brand}
        offers={offers}
        usdToSypRate={usdToSypRate}
        nowMs={nowMs}
        lang={lang}
        isFeaturedCard={isFeaturedCard}
        onSelectProduct={onSelectProduct}
        onRequestProduct={onRequestProduct}
      />
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-8">
      {/* Hero Banner for Offers & Exclusive Promotions */}
      <div className="relative rounded-lg bg-[#111318] bg-pixel-grid-dark text-white p-6 lg:p-8 border border-slate-800 overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#EF875D] uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-[#EF875D]" />
              <span>
                {lang === 'ar'
                  ? 'مركز العروض والتخفيضات المؤقتة — PIXEL OFFERS'
                  : 'PIXEL STORE — TIME-LIMITED OFFERS & EXCLUSIVE DEALS'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'ar'
                ? 'عروض حصرية بأسعار استثنائية لفترة محدودة'
                : 'Exclusive Hardware Deals & Flash Markdowns'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'جميع العروض مرتبطة بمؤقت زمني دقيق. عند انتهاء وقت العرض، يختفي العرض تلقائياً من هذه الصفحة ويعود المنتج إلى سعره الأساسي بالدولار في الكتالوج العام.'
                : 'Every promotion is governed by a live start and end window. When an offer expires, it automatically leaves this page and the product reverts to its base USD price in the catalog.'}
            </p>
          </div>

          {/* Internal Development Only: Protected behind explicit ?dev_offer_sim=1 flag (Hidden from Client Preview) */}
          {typeof window !== 'undefined' &&
            new URLSearchParams(window.location.search).get(
              'dev_offer_sim'
            ) === '1' && (
              <div
                data-testid="dev-offer-expiry-simulator"
                className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2.5 shrink-0 max-w-sm"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#EF875D]">
                  <Clock className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'معاينة سلوك انتهاء العروض (Dev Only)'
                      : 'Expired-Offer Behavior Simulator (Dev Only)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'اختبر كيف تختفي العروض المنتهية تلقائياً وتعود المنتجات لسعرها الأصلي في الكتالوج:'
                    : 'Test how expired offers automatically disappear and revert to regular USD pricing:'}
                </p>
                <button
                  type="button"
                  onClick={onToggleSimulateExpired}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors ${
                    simulateExpiredOffers
                      ? 'bg-[#EF875D] text-[#111318]'
                      : 'bg-[#8E4DEB] hover:bg-[#7A38D8] text-white'
                  }`}
                >
                  {simulateExpiredOffers ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ar'
                          ? 'إعادة تفعيل العروض الحية (Restore Active Offers)'
                          : 'Restore Active Offers'}
                      </span>
                    </>
                  ) : (
                    <>
                      <TimerOff className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ar'
                          ? 'محاكاة انتهاء وقت العروض (Simulate Expiry)'
                          : 'Simulate Offer Expiration (+5 Days)'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
        </div>
      </div>

      {activeOffers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#EF875D] mx-auto flex items-center justify-center">
            <TimerOff className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h2 className="text-lg font-bold text-[#111318]">
              {lang === 'ar'
                ? 'انتهت جميع العروض المؤقتة حالياً'
                : 'All Time-Limited Offers Have Expired'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'تم إخفاء العروض المنتهية تلقائياً وعادت جميع المنتجات إلى أسعارها الأساسية بالدولار (USD) في الكتالوج العام.'
                : 'Expired offers have been automatically removed from this listing, and all products have reverted to their regular base USD price in the catalog.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onToggleSimulateExpired}
              className="px-4 py-2.5 rounded-lg bg-[#8E4DEB] text-white text-xs font-bold"
            >
              {lang === 'ar'
                ? 'إعادة تشغيل العروض النشطة'
                : 'Restore Active Offers'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('shop', 'ALL')}
              className="px-4 py-2.5 rounded-lg bg-[#111318] text-white text-xs font-bold"
            >
              {lang === 'ar'
                ? 'تصفح المنتجات بالسعر الأساسي'
                : 'Browse Catalog at Base Price'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Exclusive Offers Spotlight */}
          {exclusiveOffers.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D66C9D]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#111318]">
                  {lang === 'ar'
                    ? 'العروض الحصرية الكبرى (Exclusive Offers)'
                    : 'Featured Exclusive Offers'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exclusiveOffers.map((offer) => renderOfferCard(offer, true))}
              </div>
            </section>
          )}

          {/* Active Weekly & Flash Offers */}
          {regularOffers.length > 0 && (
            <section className="space-y-3.5">
              <h2 className="text-base sm:text-lg font-bold text-[#111318]">
                {lang === 'ar'
                  ? 'عروض الأسبوع والملحقات'
                  : 'Active Weekly Hardware Deals'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularOffers.map((offer) => renderOfferCard(offer, false))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
