'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  Gauge,
  Images,
  ShieldCheck,
  Snowflake,
  Sparkles,
  ThermometerSnowflake,
  Wrench,
} from 'lucide-react';
import { Language, StoreService, StoreSettings } from '../../types/store';
import { getServiceGalleryImages } from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';
import { ContactIconsBar } from './ContactIconsBar';
import {
  ProductGalleryStage,
  useProductHoverGallery,
} from './ProductGalleryHover';
import { StorefrontView } from './StoreHeader';

const ServiceCardCover: React.FC<{
  images: string[];
  alt: string;
}> = ({ images, alt }) => {
  const { activeIndex, isHovering, handleMouseEnter, handleMouseLeave } =
    useProductHoverGallery(images);
  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ProductGalleryStage
        images={images}
        activeIndex={activeIndex}
        isHovering={isHovering}
        productName={alt}
        showCounterBadge={false}
      />
    </div>
  );
};

interface ServicesPageProps {
  lang: Language;
  services: StoreService[];
  selectedServiceId: string | 'ALL';
  settings: StoreSettings;
  onSelectService: (serviceId: string | 'ALL') => void;
  onNavigate: (view: StorefrontView, param?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  lang,
  services,
  selectedServiceId,
  settings,
  onSelectService,
  onNavigate,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);

  const activeServices = services.filter((s) => s.isActive);
  const focusedService =
    selectedServiceId !== 'ALL'
      ? activeServices.find((s) => s.id === selectedServiceId) || null
      : null;

  const handleSelectServiceWithReset = (serviceId: string | 'ALL') => {
    setSelectedImageIdx(0);
    onSelectService(serviceId);
  };

  const renderServiceIcon = (
    iconKey: StoreService['iconKey'],
    className = 'w-6 h-6'
  ) => {
    switch (iconKey) {
      case 'cooling':
        return <Snowflake className={className} />;
      case 'maintenance':
        return <Wrench className={className} />;
      case 'cameras':
        return <Camera className={className} />;
      default:
        return <Cpu className={className} />;
    }
  };

  const getAngleCaption = (idx: number): string => {
    const captionsAr = [
      'المنظور الرئيسي للتجهيز الفني',
      'معاينة تفصيلية للمكونات والتبريد',
      'بروتوكول الاستبدال والتركيب الدقيق',
      'اختبار الأداء والقياسات الفنية',
      'التحقق النهائي وضمان الجودة',
    ];
    const captionsEn = [
      'Primary Workshop & Setup View',
      'Component & Thermal Inspection',
      'Precision Replacement & Installation',
      'Performance & Telemetry Testing',
      'Final Quality & Stability Verification',
    ];
    return lang === 'ar'
      ? captionsAr[idx] ?? captionsAr[0]
      : captionsEn[idx] ?? captionsEn[0];
  };

  const renderDirectServiceContactBlock = (service?: StoreService) => {
    const prefill = service
      ? lang === 'ar'
        ? `مرحباً Pixel Store، أرغب بالاستفسار أو حجز خدمة: ${service.title.ar}`
        : `Hello Pixel Store, I would like to inquire about or book: ${service.title.en}`
      : lang === 'ar'
      ? 'مرحباً Pixel Store، أرغب بالاستفسار عن الخدمات الفنية والصيانة.'
      : 'Hello Pixel Store, I would like to inquire about technical services.';

    return (
      <div
        data-testid="service-direct-contact-cta"
        className="rounded-xl bg-[#111318] text-white border-2 border-[#111318] p-5 sm:p-6 shadow-md relative overflow-hidden"
      >
        <div className="absolute inset-0 pixel-grid-bg opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EF875D] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar'
                  ? 'حجز مباشر واستشارة فنية بدون انتظار'
                  : 'Direct Service Booking & Technical Consultation'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {lang === 'ar'
                ? 'تواصل مباشر لحجز الخدمة أو الاستشارة الفنية'
                : 'Contact Us Directly to Book This Service or Consult an Engineer'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'تحدث مباشرة مع مهندسي الصيانة في Pixel Store عبر الرقم الرئيسي أو قنوات التواصل الفوري لتحديد موعد فحص جهازك أو استلامه.'
                : 'Speak directly with Pixel Store hardware engineers via our primary phone line or instant messaging channels to schedule your diagnostic.'}
            </p>
          </div>

          <div className="shrink-0">
            <ContactIconsBar
              settings={settings}
              lang={lang}
              variant="cta-dark"
              showPrimaryPhone={true}
              showIconChannels={false}
              whatsappPrefillText={prefill}
            />
          </div>
        </div>
      </div>
    );
  };

  const focusedGalleryKeys = focusedService
    ? getServiceGalleryImages(focusedService)
    : [];
  const safeSelectedIdx =
    selectedImageIdx >= 0 && selectedImageIdx < focusedGalleryKeys.length
      ? selectedImageIdx
      : 0;
  const activeVisualKey =
    focusedGalleryKeys[safeSelectedIdx] ??
    focusedService?.primaryImage ??
    '/assets/services/cooling-1.svg';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
      {/* Compact Header & Service Switcher Tabs */}
      <div className="rounded-xl bg-white border-2 border-[#111318] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-[#8E4DEB] transition-colors font-semibold cursor-pointer"
              >
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => handleSelectServiceWithReset('ALL')}
                className={`transition-colors font-semibold cursor-pointer ${
                  !focusedService ? 'text-[#111318]' : 'hover:text-[#8E4DEB]'
                }`}
              >
                {lang === 'ar'
                  ? 'الخدمات الفنية والصيانة'
                  : 'Technical Services'}
              </button>
              {focusedService && (
                <>
                  <span>/</span>
                  <span className="text-[#8E4DEB] font-bold">
                    {focusedService.title[lang]}
                  </span>
                </>
              )}
            </nav>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111318]">
                {focusedService
                  ? focusedService.title[lang]
                  : lang === 'ar'
                  ? 'قسم الخدمات الفنية، التبريد الاحترافي، وأنظمة المراقبة'
                  : 'Technical Services, Thermal Engineering & Security Solutions'}
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-[#8E4DEB]/10 text-[#8E4DEB] border border-[#8E4DEB]/25 text-xs font-bold">
                {lang === 'ar'
                  ? `${activeServices.length} خدمات متخصصة`
                  : `${activeServices.length} Specialized Services`}
              </span>
            </div>
          </div>

          {focusedService && (
            <button
              type="button"
              data-testid="back-to-all-services-btn"
              onClick={() => handleSelectServiceWithReset('ALL')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-[#111318] text-[#111318] hover:text-white text-xs font-bold transition-colors self-start md:self-auto cursor-pointer"
            >
              {lang === 'ar' ? (
                <ArrowRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5" />
              )}
              <span>
                {lang === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
              </span>
            </button>
          )}
        </div>

        {/* Interactive Service Navigation Pills */}
        <div className="pt-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            data-testid="service-tab-ALL"
            onClick={() => handleSelectServiceWithReset('ALL')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              !focusedService
                ? 'bg-[#111318] text-white border-[#111318] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111318]'
            }`}
          >
            {lang === 'ar' ? 'جميع الخدمات المعتمدة' : 'All Store Services'}
          </button>

          {activeServices.map((srv) => {
            const isSelected = focusedService?.id === srv.id;
            const isCooling =
              srv.id === 'service-cooling' || srv.iconKey === 'cooling';
            return (
              <button
                key={srv.id}
                type="button"
                data-testid={`service-tab-${srv.id}`}
                onClick={() => handleSelectServiceWithReset(srv.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#8E4DEB] text-white border-[#8E4DEB] shadow-xs'
                    : isCooling
                    ? 'bg-sky-50 text-sky-900 border-sky-200 hover:border-sky-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111318]'
                }`}
              >
                {renderServiceIcon(srv.iconKey, 'w-3.5 h-3.5')}
                <span>{srv.title[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused Single Service Detail View (Dedicated Service Detail Experience with 5-Image Gallery) */}
      {focusedService ? (
        <div
          className="space-y-6"
          data-testid={`service-detail-${focusedService.id}`}
        >
          {/* Main Service Showcase Module (Product-Detail-Caliber 2-Column Layout) */}
          <div className="rounded-xl bg-white border-2 border-[#111318] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start shadow-xs">
            {/* Column 1: Dedicated 5-Image Service Gallery (5 Columns on Desktop) */}
            <div
              className="lg:col-span-5 space-y-3"
              data-testid="service-detail-gallery"
            >
              {/* Main Gallery Stage */}
              <div
                data-testid="service-detail-main-image"
                className="relative aspect-[4/3] w-full rounded-xl bg-[#F8F7FA] border-2 border-[#111318] overflow-hidden select-none"
              >
                <ProductVisual
                  visualKey={activeVisualKey}
                  alt={`${focusedService.title[lang]} — ${getAngleCaption(
                    safeSelectedIdx
                  )}`}
                />

                {/* Top Badge Overlay */}
                <span className="absolute top-3 start-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111318]/90 text-white text-[11px] font-bold z-10">
                  <Images className="w-3.5 h-3.5 text-[#EF875D]" />
                  <span className="font-mono-num">
                    {safeSelectedIdx + 1} / {focusedGalleryKeys.length}
                  </span>
                </span>

                {/* Prev / Next Gallery Controls */}
                {focusedGalleryKeys.length > 1 && (
                  <div className="absolute bottom-3 end-3 z-10">
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <button
                        type="button"
                        data-testid="service-gallery-prev"
                        onClick={() =>
                          setSelectedImageIdx(
                            (prev) =>
                              (prev - 1 + focusedGalleryKeys.length) %
                              focusedGalleryKeys.length
                          )
                        }
                        aria-label={
                          lang === 'ar' ? 'الصورة السابقة' : 'Previous service image'
                        }
                        className="w-8 h-8 rounded-lg bg-[#111318]/85 hover:bg-[#8E4DEB] text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        data-testid="service-gallery-next"
                        onClick={() =>
                          setSelectedImageIdx(
                            (prev) => (prev + 1) % focusedGalleryKeys.length
                          )
                        }
                        aria-label={
                          lang === 'ar' ? 'الصورة التالية' : 'Next service image'
                        }
                        className="w-8 h-8 rounded-lg bg-[#111318]/85 hover:bg-[#8E4DEB] text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Caption Pill */}
                <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded bg-[#111318]/85 text-white text-[11px] font-semibold max-w-[70%] truncate pointer-events-none">
                  {getAngleCaption(safeSelectedIdx)}
                </div>
              </div>

              {/* 5-Thumbnail Selector Strip */}
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                  {focusedGalleryKeys.map((vKey, idx) => {
                    const isSelected = safeSelectedIdx === idx;
                    return (
                      <button
                        key={`${vKey}-${idx}`}
                        type="button"
                        data-testid={`service-thumbnail-${idx}`}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedImageIdx(idx)}
                        aria-label={
                          lang === 'ar'
                            ? `صورة الخدمة ${idx + 1}`
                            : `Service Gallery Image ${idx + 1}`
                        }
                        className={`w-full aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#8E4DEB] ring-2 ring-[#8E4DEB]/25'
                            : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-[#111318]'
                        }`}
                      >
                        <ProductVisual
                          visualKey={vKey}
                          alt={`${focusedService.title[lang]} thumbnail ${idx + 1}`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-0.5">
                  <span>
                    {lang === 'ar'
                      ? `معرض مراحل الخدمة (${safeSelectedIdx + 1}/${
                          focusedGalleryKeys.length
                        })`
                      : `Service Workshop Gallery (${safeSelectedIdx + 1}/${
                          focusedGalleryKeys.length
                        })`}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8E4DEB]">
                    {getAngleCaption(safeSelectedIdx)}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Service Overview, Summary, Detailed Description, Quality Guarantee & Direct Inquiry CTA (7 Columns on Desktop) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badges & Turnaround Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#8E4DEB] text-white text-xs font-bold">
                  {renderServiceIcon(focusedService.iconKey, 'w-3.5 h-3.5')}
                  <span>
                    {focusedService.badge
                      ? focusedService.badge[lang]
                      : lang === 'ar'
                      ? 'خدمة احترافية معتمدة'
                      : 'Certified Technical Service'}
                  </span>
                </span>
                {focusedService.turnaroundNote && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F4F3F7] text-[#111318] border border-slate-200 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#EF875D]" />
                    <span>{focusedService.turnaroundNote[lang]}</span>
                  </span>
                )}
                {focusedService.startingPriceNote &&
                  focusedService.startingPriceNote[lang] && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {focusedService.startingPriceNote[lang]}
                    </span>
                  )}
              </div>

              {/* Service Title & Main Summary */}
              <div className="space-y-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111318] leading-tight">
                  {focusedService.title[lang]}
                </h2>

                <p className="text-sm sm:text-base text-[#8E4DEB] font-bold leading-relaxed">
                  {focusedService.summary?.[lang] ||
                    focusedService.subtitle[lang]}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h3 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider">
                    {lang === 'ar'
                      ? 'نظرة عامة ووصف تفصيلي للخدمة'
                      : 'Detailed Service Overview & Scope'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {focusedService.description[lang]}
                  </p>
                </div>
              </div>

              {/* Service Scope & Included Steps Checklist */}
              <div className="rounded-xl bg-[#F8F7FA] border border-slate-200/90 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#111318] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#8E4DEB]" />
                  <span>
                    {lang === 'ar'
                      ? 'نقاط الفحص والخطوات المشمولة في الخدمة'
                      : 'Service Scope & Included Steps'}
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(focusedService.checklist || []).map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Direct Service Inquiry Action Box */}
              <div className="rounded-xl bg-[#111318] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#EF875D]">
                    {lang === 'ar'
                      ? 'استشارة فنية وحجز موعد صيانة'
                      : 'Direct Engineering Consultation & Booking'}
                  </div>
                  <div className="text-xs text-slate-300">
                    {lang === 'ar'
                      ? 'تواصل مع قسم الصيانة للاستفسار عن جهازك أو تحديد موعد الفحص.'
                      : 'Reach our hardware lab directly to discuss your device or book a slot.'}
                  </div>
                </div>
                <div className="shrink-0">
                  <ContactIconsBar
                    settings={settings}
                    lang={lang}
                    variant="cta-dark"
                    showPrimaryPhone={true}
                    showIconChannels={false}
                    whatsappPrefillText={
                      lang === 'ar'
                        ? `مرحباً Pixel Store، أرغب بالاستفسار أو حجز خدمة: ${focusedService.title.ar}`
                        : `Hello Pixel Store, I would like to inquire about or book: ${focusedService.title.en}`
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Technical Workflow Cards */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-[#111318] flex items-center gap-2">
              <ThermometerSnowflake className="w-5 h-5 text-[#8E4DEB]" />
              <span>
                {lang === 'ar'
                  ? 'مراحل العمل الفني والتقني بالتفصيل'
                  : 'Detailed Technical Stages & Engineering Protocol'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focusedService.highlights.map((hl, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white border-2 border-[#111318] p-5 flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#111318] text-white font-mono-num text-sm font-extrabold">
                        0{index + 1}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {lang === 'ar'
                          ? `المرحلة ${index + 1}`
                          : `Stage ${index + 1}`}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#111318] leading-snug">
                      {hl.title[lang]}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {hl.description[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Service Contact CTA Block */}
          {renderDirectServiceContactBlock(focusedService)}
        </div>
      ) : (
        /* Full Services Directory Overview with Cover Images on Every Service Card */
        <div className="space-y-6" data-testid="services-directory-grid">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {activeServices.map((srv) => {
              const isCooling =
                srv.id === 'service-cooling' || srv.iconKey === 'cooling';
              const srvGallery = getServiceGalleryImages(srv);
              return (
                <Link
                  key={srv.id}
                  data-testid={`service-card-${srv.id}`}
                  href={`/services/${encodeURIComponent(srv.id)}`}
                  aria-label={
                    lang === 'ar'
                      ? `عرض تفاصيل خدمة ${srv.title[lang]}`
                      : `View details for ${srv.title[lang]}`
                  }
                  className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E4DEB]"
                >
                  <article
                    className={`flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white border-2 transition-all shadow-xs group ${
                      isCooling
                        ? 'border-[#8E4DEB] ring-2 ring-[#8E4DEB]/15'
                        : 'border-[#111318]'
                    }`}
                  >
                    <div>
                    {/* Service Cover Image Area (Supports 5-Image Hover Cycling) */}
                    <div
                      data-testid={`service-card-cover-${srv.id}`}
                      className="relative aspect-[16/10] w-full bg-[#F8F7FA] border-b-2 border-[#111318] overflow-hidden"
                    >
                      <ServiceCardCover
                        images={srvGallery}
                        alt={srv.title[lang]}
                      />

                      {/* Floating Icon & Badge Overlay */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
                        <span
                          className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 shadow-xs ${
                            isCooling
                              ? 'bg-[#8E4DEB] text-white border-[#111318]'
                              : 'bg-[#111318] text-white border-white/20'
                          }`}
                        >
                          {renderServiceIcon(srv.iconKey, 'w-4 h-4')}
                        </span>

                        {srv.badge && (
                          <span className="px-2.5 py-1 rounded bg-[#111318]/90 text-white border border-white/15 text-[11px] font-bold">
                            {srv.badge[lang]}
                          </span>
                        )}
                      </div>

                      {/* 5-Image Gallery Count Indicator */}
                      <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded bg-[#111318]/80 text-white text-[10px] font-mono-num font-bold inline-flex items-center gap-1 z-20 pointer-events-none">
                        <Images className="w-3 h-3 text-[#EF875D]" />
                        <span>{srvGallery.length}</span>
                      </span>
                    </div>

                    {/* Service Card Body */}
                    <div className="p-5 space-y-3.5">
                      <div className="space-y-1.5">
                        <h2 className="text-lg font-extrabold text-[#111318] group-hover:text-[#8E4DEB] leading-snug">
                          {srv.title[lang]}
                        </h2>
                        <p className="text-xs font-semibold text-[#8E4DEB] leading-relaxed">
                          {srv.summary?.[lang] || srv.subtitle[lang]}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {srv.description[lang]}
                        </p>
                      </div>

                      {/* Key Highlights List */}
                      <div className="space-y-2 pt-2.5 border-t border-slate-100">
                        {srv.highlights.map((hl, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#8E4DEB] shrink-0 mt-0.5" />
                            <span className="font-semibold">
                              {hl.title[lang]}
                            </span>
                          </div>
                        ))}
                      </div>

                      {srv.thermalBenchmark && (
                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <Gauge className="w-4 h-4 text-emerald-600" />
                            <span>
                              {lang === 'ar' ? 'محور الخدمة:' : 'Service Focus:'}
                            </span>
                          </span>
                          <span className="font-extrabold text-emerald-700">
                            {lang === 'ar'
                              ? 'تنظيف التبريد وتجديد المعجون الحراري'
                              : 'Airflow & TIM Renewal'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Open Detailed View */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100">
                    <span
                      data-testid={`open-service-detail-${srv.id}`}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#111318] group-hover:bg-[#8E4DEB] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {lang === 'ar'
                          ? 'عرض تفاصيل الخدمة ومعرض الصور'
                          : 'View Service Details & 5-Image Gallery'}
                      </span>
                      {lang === 'ar' ? (
                        <ArrowLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Direct Contact CTA Block at bottom of Services Directory */}
          {renderDirectServiceContactBlock()}
        </div>
      )}
    </div>
  );
};
