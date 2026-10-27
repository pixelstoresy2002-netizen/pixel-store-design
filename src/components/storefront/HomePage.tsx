import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Flame,
  Gamepad2,
  Headphones,
  Keyboard,
  Laptop,
  MessageCircle,
  Monitor,
  Mouse,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  Brand,
  Category,
  Language,
  Offer,
  Product,
  StoreSettings,
} from '../../types/store';
import { isOfferActive } from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';
import { CountdownBadge } from './CountdownBadge';
import { ProductCard } from './ProductCard';
import { StorefrontView } from './StoreHeader';

interface HomePageProps {
  lang: Language;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  offers: Offer[];
  settings: StoreSettings;
  nowMs: number;
  onNavigate: (
    view: StorefrontView,
    categoryId?: string,
    subcategoryId?: string,
    useCaseId?: string
  ) => void;
  onSelectProduct: (productId: string) => void;
  onRequestProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  products,
  categories,
  brands,
  offers,
  settings,
  nowMs,
  onNavigate,
  onSelectProduct,
  onRequestProduct,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const heroSlides = [
    {
      id: 'slide-1',
      kicker: {
        ar: 'تجميعات وكروت شاشة الجيل الجديد',
        en: 'NEXT-GEN GPUS & CUSTOM RIGS',
      },
      title: {
        ar: 'قوة الأداء الاحترافي للألعاب والرندر في مكان واحد',
        en: 'Pro-Grade RTX 40-Series Rigs & Gaming Laptops',
      },
      subtitle: {
        ar: 'تجميعات مختبرة بدقة، لابتوبات ROG و Lenovo، وقطع أصلية بكفالة حقيقية في صالة بيكسل ستور.',
        en: 'Stress-tested custom PC builds, ROG & Lenovo laptops, and authentic components backed by Pixel Store warranty.',
      },
      ctaLabel: {
        ar: 'تصفح كروت الشاشة والقطع',
        en: 'Explore PC Components',
      },
      visualKey: 'comp-gpu-front',
      targetView: 'category' as StorefrontView,
      targetCategory: 'pc-components',
      accent: '#8E4DEB',
    },
    {
      id: 'slide-2',
      kicker: {
        ar: 'قسم اللابتوبات الجديدة والمستعملة النظيفة',
        en: 'NEW & CERTIFIED CLEAN USED LAPTOPS',
      },
      title: {
        ar: 'اختر لابتوبك للألعاب أو الهندسة أو الدراسة الجامعية',
        en: 'Laptops Curated for Gaming, Engineering & Study',
      },
      subtitle: {
        ar: 'تشكيلة واسعة من اللابتوبات الجديدة بالكرتونة والمستعملة النظيفة المفحوصة 100% بأسعار مدروسة.',
        en: 'Compare factory-sealed new laptops and A+ grade pre-owned machines inspected by our hardware specialists.',
      },
      ctaLabel: {
        ar: 'استعرض قسم اللابتوبات',
        en: 'Browse All Laptops',
      },
      visualKey: 'laptop-rog-front',
      targetView: 'category' as StorefrontView,
      targetCategory: 'laptops',
      accent: '#D66C9D',
    },
    {
      id: 'slide-3',
      kicker: {
        ar: 'ملحقات الاحتراف والعمل المكتبي',
        en: 'GAMING & ERGONOMIC OFFICE PERIPHERALS',
      },
      title: {
        ar: 'لوحات مفاتيح، ماوسات فائقة الخفة، وسماعات IEM',
        en: 'Mechanical Keyboards, 49g Esports Mice & Hi-Fi IEMs',
      },
      subtitle: {
        ar: 'فرز ذكي حسب الاستخدام: اختر عتاد الألعاب التنافسية (Gaming) أو راحة العمل المكتبي الهادئ (Office).',
        en: 'Shop by use case: tournament-ready optical switches or whisper-quiet ergonomic office peripherals.',
      },
      ctaLabel: {
        ar: 'تصفح الإكسسوارات والملحقات',
        en: 'Shop Peripherals',
      },
      visualKey: 'kb-huntsman-front',
      targetView: 'category' as StorefrontView,
      targetCategory: 'accessories',
      accent: '#EF875D',
    },
  ];

  const currentSlide = heroSlides[activeSlide];

  // Active offers and their products
  const activeOffers = offers.filter((o) => isOfferActive(o, nowMs));
  const offerProducts = activeOffers
    .map((o) => products.find((p) => p.id === o.productId))
    .filter((p): p is Product => Boolean(p));

  // Best Sellers (Admin-controlled manual flag)
  const bestSellerProducts = products.filter((p) => p.isBestSeller).slice(0, 6);

  // New Arrivals
  const newArrivalProducts = products.filter((p) => p.isNewArrival).slice(0, 6);

  // Visual Shortcut Tiles
  const visualCategoryShortcuts = [
    {
      id: 'sc-new-laptops',
      title: { ar: 'لابتوبات جديدة', en: 'New Laptops' },
      sub: { ar: 'كفالة كاملة', en: 'Sealed Warranty' },
      categoryId: 'laptops',
      subcategoryId: 'new-laptops',
      visualKey: 'laptop-rog-front',
      icon: <Laptop className="w-4 h-4 text-[#8E4DEB]" />,
    },
    {
      id: 'sc-used-laptops',
      title: { ar: 'لابتوبات مستعملة', en: 'Used Laptops' },
      sub: { ar: 'نظافة مفحوصة', en: 'Tested Clean' },
      categoryId: 'laptops',
      subcategoryId: 'used-laptops',
      visualKey: 'laptop-thinkpad-front',
      icon: <Laptop className="w-4 h-4 text-[#EF875D]" />,
    },
    {
      id: 'sc-gpus',
      title: { ar: 'كروت الشاشة', en: 'Graphics Cards' },
      sub: { ar: 'RTX & Radeon', en: 'RTX & Radeon' },
      categoryId: 'pc-components',
      subcategoryId: 'graphics-cards',
      visualKey: 'comp-gpu-front',
      icon: <Cpu className="w-4 h-4 text-[#8E4DEB]" />,
    },
    {
      id: 'sc-keyboards',
      title: { ar: 'لوحات المفاتيح', en: 'Keyboards' },
      sub: { ar: 'Gaming & Office', en: 'Gaming & Office' },
      categoryId: 'accessories',
      subcategoryId: 'keyboards',
      visualKey: 'kb-fizz-front',
      icon: <Keyboard className="w-4 h-4 text-[#D66C9D]" />,
    },
    {
      id: 'sc-mice',
      title: { ar: 'الماوسات', en: 'Pro Mice' },
      sub: { ar: 'ألعاب ومكتبي', en: 'Esports & Office' },
      categoryId: 'accessories',
      subcategoryId: 'mice',
      visualKey: 'mouse-superlight-front',
      icon: <Mouse className="w-4 h-4 text-[#8E4DEB]" />,
    },
    {
      id: 'sc-audio',
      title: { ar: 'سماعات و IEM', en: 'Audio & IEM' },
      sub: { ar: 'محيطية واحترافية', en: 'Headsets & IEMs' },
      categoryId: 'audio',
      subcategoryId: 'ALL',
      visualKey: 'audio-iem-front',
      icon: <Headphones className="w-4 h-4 text-[#EF875D]" />,
    },
    {
      id: 'sc-ram-ssd',
      title: { ar: 'رامات وتخزين', en: 'RAM & NVMe SSD' },
      sub: { ar: 'DDR5 & Gen4', en: 'DDR5 & Gen4' },
      categoryId: 'pc-components',
      subcategoryId: 'ram',
      visualKey: 'comp-ram-front',
      icon: <Cpu className="w-4 h-4 text-[#D66C9D]" />,
    },
    {
      id: 'sc-builds',
      title: { ar: 'تجميعات PC', en: 'Custom PC Builds' },
      sub: { ar: 'جاهزة ومختبرة', en: 'Ready & Tested' },
      categoryId: 'pc-builds',
      subcategoryId: 'ALL',
      visualKey: 'build-nebula-front',
      icon: <Monitor className="w-4 h-4 text-[#8E4DEB]" />,
    },
  ];

  return (
    <div className="space-y-10 pb-8">
      {/* SECTION 1: Main Promotional Hero Slider + Two Side Promotional Banners on Desktop */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Main Central/Primary Slider (8 Columns on Desktop) */}
          <div className="lg:col-span-8 relative rounded-xl bg-[#111318] bg-pixel-grid-dark text-white overflow-hidden border border-slate-800 flex flex-col justify-between min-h-[340px] lg:min-h-[390px]">
            <div className="absolute -top-24 -end-24 w-80 h-80 rounded-full bg-[#8E4DEB]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -start-24 w-80 h-80 rounded-full bg-[#D66C9D]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 lg:p-8 items-center flex-1">
              {/* Slide Copy */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#EF875D]">
                  <span className="w-2 h-2 bg-[#8E4DEB]" />
                  <span>{currentSlide.kicker[lang]}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-tight text-white">
                  {currentSlide.title[lang]}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {currentSlide.subtitle[lang]}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate(
                        currentSlide.targetView,
                        currentSlide.targetCategory
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7B39D8] text-white text-xs sm:text-sm font-bold transition-colors shadow-md"
                  >
                    <span>{currentSlide.ctaLabel[lang]}</span>
                    <DirectionalArrow className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('offers')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-colors"
                  >
                    <Flame className="w-4 h-4 text-[#EF875D]" />
                    <span>
                      {lang === 'ar' ? 'تصفح العروض' : 'View Active Deals'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Slide Hardware Visual */}
              <div className="md:col-span-5 flex items-center justify-center">
                <div className="w-full max-w-[280px] aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-[#181B26] p-2">
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <ProductVisual
                      visualKey={currentSlide.visualKey}
                      alt={currentSlide.title[lang]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Controls Bar */}
            <div className="relative z-10 px-6 py-3 bg-black/35 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {heroSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 transition-all rounded-xs ${
                      activeSlide === idx
                        ? 'w-7 bg-[#8E4DEB]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5" dir="ltr">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide(
                      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                    )
                  }
                  aria-label="Previous slide"
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % heroSlides.length)
                  }
                  aria-label="Next slide"
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Two Supporting Side Promotional Banners (4 Columns on Desktop) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Side Promo 1: Custom PC Builds */}
            <div className="relative rounded-xl bg-[#181A24] text-white p-5 border border-slate-800 flex items-center justify-between gap-4 overflow-hidden group">
              <div className="space-y-2 z-10 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D66C9D]">
                  {lang === 'ar' ? 'ورشة بيكسل الاحترافية' : 'PIXEL BUILD STUDIO'}
                </span>
                <h2 className="text-base font-bold leading-snug text-white">
                  {lang === 'ar'
                    ? 'تجميعات PC احترافية جاهزة ومختبرة'
                    : 'Custom Gaming & Creator PC Builds'}
                </h2>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {lang === 'ar'
                    ? 'تنظيم كابلات احترافي + اختبار ضغط حراري شامل'
                    : 'Clean cable routing, BIOS tuning & thermal stress test'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'pc-builds')}
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold text-[#EF875D] hover:text-white transition-colors"
                >
                  <span>
                    {lang === 'ar' ? 'استعرض التجميعات' : 'Explore Builds'}
                  </span>
                  <DirectionalArrow className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-28 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <ProductVisual
                  visualKey="build-nebula-front"
                  alt="Custom PC Build"
                />
              </div>
            </div>

            {/* Side Promo 2: Keyboards & Mice Use-Case Discovery */}
            <div className="relative rounded-xl bg-white text-[#111318] p-5 border border-slate-200/90 flex items-center justify-between gap-4 overflow-hidden hover:border-[#8E4DEB]/60 transition-colors">
              <div className="space-y-2 z-10 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E4DEB]">
                  {lang === 'ar' ? 'فرز ذكي حسب الاستخدام' : 'USE-CASE SELECTOR'}
                </span>
                <h2 className="text-base font-bold leading-snug text-[#111318]">
                  {lang === 'ar'
                    ? 'كيبوردات وماوسات: ألعاب أم عمل مكتبي؟'
                    : 'Keyboards & Mice: Gaming vs. Office'}
                </h2>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {lang === 'ar'
                    ? 'تصفح حسب طبيعة عملك بضغطة واحدة'
                    : 'Filter effortlessly between esports speed and quiet office comfort'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'accessories', 'keyboards')}
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold text-[#8E4DEB] hover:text-[#111318] transition-colors"
                >
                  <span>
                    {lang === 'ar' ? 'جرب الاختيار حسب الاستخدام' : 'Try Use-Case View'}
                  </span>
                  <DirectionalArrow className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-28 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <ProductVisual
                  visualKey="kb-mxkeys-front"
                  alt="Keyboards & Mice"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Main Visual Category Shortcuts (8 High-Density Tiles) */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111318]">
              {lang === 'ar' ? 'تصفح حسب الفئة' : 'Shop by Category'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', 'ALL')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8E4DEB] hover:text-[#111318] transition-colors"
          >
            <span>{lang === 'ar' ? 'عرض الكتالوج الكامل' : 'View Full Catalog'}</span>
            <DirectionalArrow className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {visualCategoryShortcuts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onNavigate('category', item.categoryId, item.subcategoryId)
              }
              className="group flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200/90 hover:border-[#8E4DEB] hover:shadow-xs transition-all text-center"
            >
              <div className="w-full aspect-[4/3] rounded bg-[#F8F7FA] overflow-hidden mb-2.5 border border-slate-100 group-hover:scale-[1.02] transition-transform">
                <ProductVisual
                  visualKey={item.visualKey}
                  alt={item.title[lang]}
                />
              </div>
              <div className="text-xs font-bold text-[#111318] group-hover:text-[#8E4DEB] transition-colors line-clamp-1">
                {item.title[lang]}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {item.sub[lang]}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3: Exclusive Offers Section with Real Countdown Presentation */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="rounded-xl bg-[#111318] text-white p-5 lg:p-6 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#EF875D] uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-[#EF875D]" />
                <span>
                  {lang === 'ar'
                    ? 'عروض محدودة بوقت — تعود لسعرها الأصلي فور انتهاء المؤقت'
                    : 'LIMITED-TIME OFFERS — AUTO-REVERTS WHEN TIMER ENDS'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {lang === 'ar'
                  ? 'العروض الحصرية والتخفيضات الفورية'
                  : 'Exclusive Offers & Flash Markdowns'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {activeOffers[0] && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">
                    {lang === 'ar' ? 'أقرب عرض ينتهي خلال:' : 'Next offer ends in:'}
                  </span>
                  <CountdownBadge
                    endTimeIso={activeOffers[0].endTime}
                    nowMs={nowMs}
                    lang={lang}
                    variant="prominent"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => onNavigate('offers')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D66C9D] hover:bg-[#c5598b] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0"
              >
                <span>
                  {lang === 'ar'
                    ? `كل العروض (${activeOffers.length})`
                    : `All Offers (${activeOffers.length})`}
                </span>
                <DirectionalArrow className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {offerProducts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              {lang === 'ar'
                ? 'انتهت جميع العروض المؤقتة وعادت المنتجات لأسعارها الأساسية في المتجر.'
                : 'All time-limited offers have expired and products have returned to their base USD pricing.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
              {offerProducts.slice(0, 6).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  brands={brands}
                  offers={offers}
                  usdToSypRate={settings.usdToSypRate}
                  nowMs={nowMs}
                  lang={lang}
                  showCountdown={true}
                  onSelectProduct={onSelectProduct}
                  onRequestProduct={onRequestProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Best Sellers Section (Admin-Controlled Product Flag) */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold text-[#8E4DEB] uppercase tracking-wider">
              {lang === 'ar' ? 'مختارات الأكثر طلباً' : 'TOP DEMAND HARDWARE'}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#111318]">
              {lang === 'ar' ? 'الأكثر مبيعاً (Best Sellers)' : 'Best Sellers'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', 'ALL', 'BEST_SELLERS')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-[#8E4DEB] text-xs font-bold text-[#111318] transition-colors"
          >
            <span>{lang === 'ar' ? 'عرض كل الأكثر مبيعاً' : 'See All Best Sellers'}</span>
            <DirectionalArrow className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {bestSellerProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              brands={brands}
              offers={offers}
              usdToSypRate={settings.usdToSypRate}
              nowMs={nowMs}
              lang={lang}
              onSelectProduct={onSelectProduct}
              onRequestProduct={onRequestProduct}
            />
          ))}
        </div>
      </section>

      {/* SECTION 5: Featured Category & Use-Case Merchandising Spotlight */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 lg:p-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D66C9D]">
                {lang === 'ar'
                  ? 'ميزة التسوق الذكي حسب طبيعة الاستخدام'
                  : 'SHOP BY USE CASE'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#111318] mt-0.5">
                {lang === 'ar'
                  ? 'اختر العتاد الأنسب لأسلوبك: ألعاب تنافسية أم عمل مكتبي وهندسي؟'
                  : 'Tailored Hardware Selection: Competitive Gaming vs. Office & Study'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              {lang === 'ar'
                ? 'صممنا فلاتر الاستخدام لتصل مباشرة إلى الكيبورد أو الماوس أو اللابتوب المتوافق مع احتياجك الفعلي.'
                : 'Jump directly into category views pre-filtered for your specific daily workflow.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Use-Case Card 1: Gaming Keyboards & Mice */}
            <div className="rounded-lg bg-[#F4F3F7] p-4 border border-slate-200/80 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8E4DEB]">
                    <Gamepad2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'مخصص للألعاب (Gaming)' : 'Esports & Gaming'}</span>
                  </span>
                  <h3 className="text-base font-bold text-[#111318] mt-1">
                    {lang === 'ar'
                      ? 'كيبوردات ميكانيكية وماوسات Superlight'
                      : 'Mechanical Keyboards & Ultra-Light Mice'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ar'
                      ? 'مفاتيح Red/Optical سريعة وحساسات PAW3395 و HERO 2.'
                      : 'Rapid Trigger optical switches and 4000Hz wireless sensors.'}
                  </p>
                </div>
                <div className="w-20 h-16 rounded bg-white border border-slate-200 shrink-0 overflow-hidden">
                  <ProductVisual visualKey="kb-fizz-front" alt="Gaming Keyboards" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('category', 'accessories', 'keyboards', 'gaming')
                  }
                  className="flex-1 py-2 px-3 rounded bg-[#8E4DEB] text-white text-xs font-bold hover:bg-[#7A38D8] transition-colors text-center"
                >
                  {lang === 'ar' ? 'كيبوردات ألعاب' : 'Gaming Keyboards'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('category', 'accessories', 'mice', 'gaming')
                  }
                  className="flex-1 py-2 px-3 rounded bg-white border border-slate-300 text-[#111318] text-xs font-bold hover:border-[#8E4DEB] transition-colors text-center"
                >
                  {lang === 'ar' ? 'ماوسات ألعاب' : 'Gaming Mice'}
                </button>
              </div>
            </div>

            {/* Use-Case Card 2: Office & Productivity Peripherals */}
            <div className="rounded-lg bg-[#F4F3F7] p-4 border border-slate-200/80 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EF875D]">
                    <Keyboard className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'مكتبي واحترافي (Office)' : 'Office & Ergonomic'}</span>
                  </span>
                  <h3 className="text-base font-bold text-[#111318] mt-1">
                    {lang === 'ar'
                      ? 'سلسلة Logitech MX الهادئة للعمل والبرمجة'
                      : 'Quiet Office Keyboards & Ergonomic Mice'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ar'
                      ? 'كتابة مريحة بدون ضجيج واتصال متعدد حتى 3 أجهزة.'
                      : 'Whisper-quiet switches, MagSpeed scroll wheels, and multi-device pairing.'}
                  </p>
                </div>
                <div className="w-20 h-16 rounded bg-white border border-slate-200 shrink-0 overflow-hidden">
                  <ProductVisual visualKey="mouse-mxmaster-front" alt="Office Mouse" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('category', 'accessories', 'keyboards', 'office')
                  }
                  className="flex-1 py-2 px-3 rounded bg-[#111318] text-white text-xs font-bold hover:bg-[#8E4DEB] transition-colors text-center"
                >
                  {lang === 'ar' ? 'كيبوردات مكتبية' : 'Office Keyboards'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('category', 'accessories', 'mice', 'office')
                  }
                  className="flex-1 py-2 px-3 rounded bg-white border border-slate-300 text-[#111318] text-xs font-bold hover:border-[#8E4DEB] transition-colors text-center"
                >
                  {lang === 'ar' ? 'ماوسات مكتبية' : 'Office Mice'}
                </button>
              </div>
            </div>

            {/* Use-Case Card 3: Laptops by Use-Case */}
            <div className="rounded-lg bg-[#F4F3F7] p-4 border border-slate-200/80 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D66C9D]">
                    <Laptop className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'دليل اللابتوبات الذكي' : 'Laptop Finder'}</span>
                  </span>
                  <h3 className="text-base font-bold text-[#111318] mt-1">
                    {lang === 'ar'
                      ? 'لابتوبات للألعاب، الدراسة، أو الاستخدام اليومي'
                      : 'Laptops for Gaming, Study & Everyday Use'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ar'
                      ? 'قارن بسهولة بين الأجهزة الجديدة بالكرتونة والمستعملة المفحوصة.'
                      : 'Browse brand-new and clean tested used laptops with clear 4-spec summaries.'}
                  </p>
                </div>
                <div className="w-20 h-16 rounded bg-white border border-slate-200 shrink-0 overflow-hidden">
                  <ProductVisual visualKey="laptop-thinkpad-front" alt="Laptops" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('category', 'laptops', 'ALL', 'work-study')
                  }
                  className="flex-1 py-2 px-3 rounded bg-[#D66C9D] text-white text-xs font-bold hover:opacity-95 transition-opacity text-center"
                >
                  {lang === 'ar' ? 'للعمل والدراسة' : 'Work & Study'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('category', 'laptops', 'ALL', 'everyday')
                  }
                  className="flex-1 py-2 px-3 rounded bg-white border border-slate-300 text-[#111318] text-xs font-bold hover:border-[#8E4DEB] transition-colors text-center"
                >
                  {lang === 'ar' ? 'استخدام يومي' : 'Everyday Use'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: New Arrivals Product Section */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D66C9D] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'أحدث الدفعات الواردة' : 'JUST LANDED IN SHOWROOM'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#111318]">
              {lang === 'ar' ? 'وصل حديثاً (New Arrivals)' : 'New Arrivals'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', 'ALL', 'NEW_ARRIVALS')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-[#8E4DEB] text-xs font-bold text-[#111318] transition-colors"
          >
            <span>{lang === 'ar' ? 'عرض كل ما وصل حديثاً' : 'View All New Arrivals'}</span>
            <DirectionalArrow className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {newArrivalProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              brands={brands}
              offers={offers}
              usdToSypRate={settings.usdToSypRate}
              nowMs={nowMs}
              lang={lang}
              onSelectProduct={onSelectProduct}
              onRequestProduct={onRequestProduct}
            />
          ))}
        </div>
      </section>

      {/* SECTION 7: Visually Distinctive Dark Pixel-Themed Promotional Banner */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="relative rounded-xl bg-[#0D0E14] text-white overflow-hidden border border-slate-800 bg-pixel-grid-dark">
          <div className="absolute -top-24 start-1/3 w-96 h-96 rounded-full bg-[#8E4DEB]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-xs font-pixel text-[#EF875D]">
                <span>PIXEL HARDWARE LAB // DAMASCUS</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                {lang === 'ar'
                  ? 'لماذا يثق اللاعبون والمهندسون بمتجر PIXEL STORE؟'
                  : 'Why Gamers & Engineers Choose PIXEL STORE'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {lang === 'ar'
                  ? 'سواء كنت تبحث عن تجميعة ألعاب احترافية، أو لابتوب مستعمل نظيف مفحوص بدقة، أو إكسسوارات أصلية — نقدم لك تسعيراً شفافاً بالدولار والليرة السورية ومتابعة فورية عبر واتساب.'
                  : 'Whether you are commissioning a custom water-cooled rig, buying a certified clean pre-owned laptop, or upgrading your peripherals — enjoy transparent dual USD/SYP pricing and direct WhatsApp specialist support.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                  <Wrench className="w-5 h-5 text-[#8E4DEB] mb-1.5" />
                  <div className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'تجميع وفحص احترافي' : 'Expert Assembly & QC'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'اختبار حرارة وأداء لكل جهاز قبل التسليم'
                      : 'Full thermal & stability testing on every machine'}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#D66C9D] mb-1.5" />
                  <div className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'حالة الأجهزة واضحة (NEW / USED)' : 'Transparent NEW / USED Grading'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'تصنيف صريح وواضح لكل منتج مع كفالة المتجر'
                      : 'Clear condition labeling with honest inspection reports'}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                  <MessageCircle className="w-5 h-5 text-[#EF875D] mb-1.5" />
                  <div className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'طلب مباشر بدون تعقيد' : 'Direct WhatsApp Request'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'اطلب المنتج باسمك ورقمك لنتواصل معك فوراً'
                      : 'Reserve any item in seconds with Name & Phone'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-md rounded-xl overflow-hidden border border-white/15 bg-[#111318] p-4 shadow-2xl">
                <img
                  src="/assets/aistudio/image_92b9c716.png"
                  alt="PIXEL STORE Official Artwork"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover rounded-lg border border-white/10"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {lang === 'ar' ? 'استشارة مجانية للتجميعات' : 'Free Custom Build Consultation'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lang === 'ar' ? 'تواصل مع مهندسي الصالة مباشرة' : 'Chat directly with our hardware builders'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="px-4 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                  >
                    {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Final Compact Contact / Support Strip */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#111318]">
              {lang === 'ar'
                ? 'هل تحتاج مساعدة في اختيار اللابتوب أو التجميعة المناسبة؟'
                : 'Need Help Selecting the Right Laptop or PC Component?'}
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'ar'
                ? `فريق بيكسل ستور متواجد يومياً للرد على استفساراتكم عبر الهاتف وواتساب — ${settings.address.ar}`
                : `Our specialists are available daily via Phone, WhatsApp, and Social Media — ${settings.address.en}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F4F3F7] text-xs font-mono-num font-bold text-[#111318]" dir="ltr">
              <Phone className="w-4 h-4 text-[#8E4DEB]" />
              <span>{settings.phone}</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111318] hover:bg-[#8E4DEB] text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#EF875D]" />
              <span>
                {lang === 'ar' ? 'صفحة التواصل والواتساب' : 'WhatsApp & Social Channels'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
