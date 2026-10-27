import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  HardDrive,
  MemoryStick,
  MessageCircle,
  Monitor,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Brand,
  Category,
  Language,
  Offer,
  Product,
  UseCaseTag,
} from '../../types/store';
import {
  formatSyp,
  formatUsd,
  resolveProductPricing,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';
import { CountdownBadge } from './CountdownBadge';
import { ProductCard } from './ProductCard';
import { StorefrontView } from './StoreHeader';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  lang: Language;
  onNavigate: (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string,
    useCaseId?: string
  ) => void;
  onSelectProduct: (productId: string) => void;
  onRequestProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  categories,
  brands,
  useCaseTags,
  offers,
  usdToSypRate,
  nowMs,
  lang,
  onNavigate,
  onSelectProduct,
  onRequestProduct,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState<0 | 1>(0);

  const brand = brands.find((b) => b.id === product.brandId);
  const category = categories.find((c) => c.id === product.categoryId);
  const subcategory = categories.find((c) => c.id === product.subcategoryId);
  const pricing = resolveProductPricing(product, offers, usdToSypRate, nowMs);

  const productUseCases = useCaseTags.filter((u) =>
    product.useCaseIds.includes(u.id)
  );

  const galleryKeys = [product.primaryImage, product.secondaryImage];
  const activeVisualKey = galleryKeys[selectedImageIdx] ?? product.primaryImage;

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.subcategoryId === product.subcategoryId ||
          p.categoryId === product.categoryId)
    )
    .slice(0, 6);

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 space-y-8">
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <nav
          className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#8E4DEB]"
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          {category && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('category', category.id)}
                className="hover:text-[#8E4DEB]"
              >
                {category.name[lang]}
              </button>
              <span>/</span>
            </>
          )}
          {subcategory && (
            <>
              <button
                type="button"
                onClick={() =>
                  onNavigate('category', category?.id ?? 'ALL', subcategory.id)
                }
                className="hover:text-[#8E4DEB]"
              >
                {subcategory.name[lang]}
              </button>
              <span>/</span>
            </>
          )}
          <span className="font-semibold text-[#111318] truncate max-w-xs">
            {product.name[lang]}
          </span>
        </nav>

        <button
          type="button"
          onClick={() =>
            onNavigate(
              'category',
              product.categoryId,
              product.subcategoryId ?? 'ALL'
            )
          }
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E4DEB] hover:text-[#111318] transition-colors"
        >
          <BackIcon className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'العودة إلى القسم' : 'Back to Category'}</span>
        </button>
      </div>

      {/* Main Product Showcase Module */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Image Gallery (5 Columns) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative aspect-[4/3] w-full rounded-xl bg-[#F8F7FA] border border-slate-200/80 overflow-hidden">
            <ProductVisual
              visualKey={activeVisualKey}
              alt={product.name[lang]}
            />
            {pricing.hasActiveOffer && (
              <span className="absolute top-3 start-3 px-2.5 py-1 rounded bg-[#D66C9D] text-white text-xs font-bold">
                {lang === 'ar'
                  ? `خصم حصري ${pricing.discountPercent}%`
                  : `Save ${pricing.discountPercent}%`}
              </span>
            )}
          </div>

          {/* Image Thumbnails */}
          <div className="flex items-center gap-3">
            {galleryKeys.map((vKey, idx) => {
              const isSelected = selectedImageIdx === idx;
              return (
                <button
                  key={vKey}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx as 0 | 1)}
                  aria-label={
                    lang === 'ar'
                      ? `صورة المنتج ${idx + 1}`
                      : `Product Angle ${idx + 1}`
                  }
                  className={`w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-[#8E4DEB] ring-2 ring-[#8E4DEB]/20'
                      : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <ProductVisual
                    visualKey={vKey}
                    alt={`${product.name[lang]} thumbnail ${idx + 1}`}
                  />
                </button>
              );
            })}
            <div className="text-xs text-slate-400 ps-2">
              {selectedImageIdx === 0
                ? lang === 'ar'
                  ? 'الواجهة الأمامية (1/2)'
                  : 'Primary Studio Angle (1/2)'
                : lang === 'ar'
                ? 'زاوية التفصيل والمنفذ (2/2)'
                : 'Secondary Detail Angle (2/2)'}
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase / Request & Specification Module (7 Columns) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Unboxed Metadata Header: Brand · SKU · Condition · Availability */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-bold text-[#8E4DEB] uppercase tracking-wider">
              {brand?.name ?? 'PIXEL STORE'}
            </span>
            <span>·</span>
            <span className="font-mono-num text-slate-500" dir="ltr">
              SKU: {product.sku}
            </span>
            <span>·</span>
            <span
              className={`font-bold ${
                product.condition === 'NEW'
                  ? 'text-[#111318]'
                  : 'text-[#D96B38]'
              }`}
            >
              {product.condition === 'NEW'
                ? lang === 'ar'
                  ? 'الحالة: جديد (NEW)'
                  : 'Condition: NEW'
                : lang === 'ar'
                ? 'الحالة: مستعمل نظيف (USED)'
                : 'Condition: USED'}
            </span>
            <span>·</span>
            <span
              className={`font-bold ${
                product.availability === 'IN_STOCK'
                  ? 'text-emerald-700'
                  : product.availability === 'ON_REQUEST'
                  ? 'text-amber-700'
                  : 'text-rose-600'
              }`}
            >
              {product.availability === 'IN_STOCK'
                ? lang === 'ar'
                  ? 'متوفر في الصالة'
                  : 'In Stock'
                : product.availability === 'ON_REQUEST'
                ? lang === 'ar'
                  ? 'متوفر حسب الطلب'
                  : 'Available On Request'
                : lang === 'ar'
                ? 'غير متوفر حالياً'
                : 'Out of Stock'}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111318] leading-snug">
            {product.name[lang]}
          </h1>

          {/* Active Offer Banner & Countdown if Applicable */}
          {pricing.hasActiveOffer && pricing.activeOffer && (
            <div className="p-3.5 rounded-xl bg-[#111318] text-white flex flex-wrap items-center justify-between gap-3 border border-[#D66C9D]/40">
              <div>
                <div className="text-xs font-bold text-[#EF875D]">
                  {pricing.activeOffer.title[lang]}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {lang === 'ar'
                    ? 'ينتهي السعر المخفض ويعود للسعر الأساسي عند انتهاء الوقت:'
                    : 'Special offer price reverts to base USD price when countdown ends:'}
                </div>
              </div>
              <CountdownBadge
                endTimeIso={pricing.activeOffer.endTime}
                nowMs={nowMs}
                lang={lang}
                variant="prominent"
              />
            </div>
          )}

          {/* Dual Pricing Box (USD Primary + Converted SYP) */}
          <div className="p-4 rounded-xl bg-[#F4F3F7] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">
                {lang === 'ar'
                  ? 'السعر النهائي (دولار أمريكي / ليرة سورية):'
                  : 'Price (USD Base & Converted SYP):'}
              </div>
              <div className="flex items-baseline gap-2.5" dir="ltr">
                <span className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#111318]">
                  {formatUsd(pricing.effectiveUsd)}
                </span>
                {pricing.hasActiveOffer && (
                  <span className="font-mono-num text-sm text-slate-400 line-through">
                    {formatUsd(pricing.originalUsd)}
                  </span>
                )}
              </div>
              <div className="font-mono-num text-sm font-bold text-[#8E4DEB] mt-1">
                {formatSyp(pricing.effectiveSyp, lang)}
              </div>
            </div>

            {/* Primary Request Now CTA */}
            <div className="flex flex-col sm:items-end gap-1.5">
              <button
                type="button"
                disabled={product.availability === 'OUT_OF_STOCK'}
                onClick={() => onRequestProduct(product)}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  product.availability === 'OUT_OF_STOCK'
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#8E4DEB] hover:bg-[#7A38D8] text-white active:scale-[0.99]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'اطلب الآن (Request Now)' : 'Request Now'}
                </span>
              </button>
              <span className="text-[11px] text-slate-500">
                {lang === 'ar'
                  ? 'حجز وتأكيد مباشر عبر واتساب بدون تعقيد'
                  : 'Direct reservation & follow-up via WhatsApp'}
              </span>
            </div>
          </div>

          {/* Concise Description */}
          <p className="text-sm text-slate-700 leading-relaxed">
            {product.description[lang]}
          </p>

          {/* Lightweight 4-Field Laptop Specifications (Requirement #12.D) */}
          {product.laptopSpecs && (
            <div className="space-y-2.5">
              <h2 className="text-xs font-bold text-[#111318] uppercase tracking-wider">
                {lang === 'ar'
                  ? 'المواصفات الأساسية للابتوب'
                  : 'Key Laptop Specifications'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-slate-200/80 flex items-start gap-2.5">
                  <Cpu className="w-4 h-4 text-[#8E4DEB] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500">
                      {lang === 'ar' ? 'المعالج (Processor)' : 'Processor'}
                    </div>
                    <div className="text-xs font-bold text-[#111318] mt-0.5" dir="ltr">
                      {product.laptopSpecs.processor}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-slate-200/80 flex items-start gap-2.5">
                  <MemoryStick className="w-4 h-4 text-[#D66C9D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500">
                      {lang === 'ar' ? 'الذاكرة العشوائية (Memory)' : 'Memory (RAM)'}
                    </div>
                    <div className="text-xs font-bold text-[#111318] mt-0.5" dir="ltr">
                      {product.laptopSpecs.memory}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-slate-200/80 flex items-start gap-2.5">
                  <HardDrive className="w-4 h-4 text-[#EF875D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500">
                      {lang === 'ar' ? 'التخزين (Storage)' : 'Storage'}
                    </div>
                    <div className="text-xs font-bold text-[#111318] mt-0.5" dir="ltr">
                      {product.laptopSpecs.storage}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-slate-200/80 flex items-start gap-2.5">
                  <Monitor className="w-4 h-4 text-[#8E4DEB] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500">
                      {lang === 'ar' ? 'الشاشة (Display)' : 'Display'}
                    </div>
                    <div className="text-xs font-bold text-[#111318] mt-0.5" dir="ltr">
                      {product.laptopSpecs.display}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generic Relevant Specifications Table */}
          {product.specs.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-[#111318] uppercase tracking-wider">
                {lang === 'ar' ? 'تفاصيل إضافية' : 'Technical Specifications'}
              </h2>
              <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {product.specs.map((sp, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2.5 flex items-center justify-between gap-4 text-xs bg-white"
                  >
                    <span className="font-medium text-slate-500">
                      {sp.label[lang]}
                    </span>
                    <span className="font-bold text-[#111318] text-end">
                      {sp.value[lang]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicable Use-Case Tags */}
          {productUseCases.length > 0 && (
            <div className="pt-2 flex items-center flex-wrap gap-2">
              <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8E4DEB]" />
                <span>
                  {lang === 'ar' ? 'مناسب لـ:' : 'Recommended Use Cases:'}
                </span>
              </span>
              {productUseCases.map((uc) => (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() =>
                    onNavigate(
                      'category',
                      product.categoryId,
                      product.subcategoryId ?? 'ALL',
                      uc.id
                    )
                  }
                  className="text-xs font-bold text-[#8E4DEB] hover:underline"
                >
                  {uc.name[lang]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#111318]">
            {lang === 'ar' ? 'منتجات مشابهة قد تهمك' : 'Related Products'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
            {relatedProducts.map((rp) => (
              <ProductCard
                key={rp.id}
                product={rp}
                brands={brands}
                offers={offers}
                usdToSypRate={usdToSypRate}
                nowMs={nowMs}
                lang={lang}
                onSelectProduct={onSelectProduct}
                onRequestProduct={onRequestProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
