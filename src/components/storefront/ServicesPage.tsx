'use client';

import React from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  Gauge,
  ShieldCheck,
  Snowflake,
  Sparkles,
  ThermometerSnowflake,
  Wrench,
} from 'lucide-react';
import { Language, StoreService, StoreSettings } from '../../types/store';
import { ContactIconsBar } from './ContactIconsBar';
import { StorefrontView } from './StoreHeader';

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
  const activeServices = services.filter((s) => s.isActive);
  const focusedService =
    selectedServiceId !== 'ALL'
      ? activeServices.find((s) => s.id === selectedServiceId) || null
      : null;

  const renderServiceIcon = (iconKey: StoreService['iconKey'], className = 'w-6 h-6') => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
      {/* Compact Header & Service Switcher Tabs */}
      <div className="rounded-xl bg-white border-2 border-[#111318] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-[#8E4DEB] transition-colors font-semibold"
              >
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => onSelectService('ALL')}
                className={`transition-colors font-semibold ${
                  !focusedService ? 'text-[#111318]' : 'hover:text-[#8E4DEB]'
                }`}
              >
                {lang === 'ar' ? 'الخدمات الفنية والصيانة' : 'Technical Services'}
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
              onClick={() => onSelectService('ALL')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-[#111318] text-[#111318] hover:text-white text-xs font-bold transition-colors self-start md:self-auto"
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
            onClick={() => onSelectService('ALL')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              !focusedService
                ? 'bg-[#111318] text-white border-[#111318] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111318]'
            }`}
          >
            {lang === 'ar' ? 'جميع الخدمات المعتمدة' : 'All Store Services'}
          </button>

          {activeServices.map((srv) => {
            const isSelected = focusedService?.id === srv.id;
            const isCooling = srv.id === 'service-cooling' || srv.iconKey === 'cooling';
            return (
              <button
                key={srv.id}
                type="button"
                data-testid={`service-tab-${srv.id}`}
                onClick={() => onSelectService(srv.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
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

      {/* Focused Single Service Detail View (e.g., Cooling Solutions) */}
      {focusedService ? (
        <div className="space-y-6" data-testid={`service-detail-${focusedService.id}`}>
          {/* Service Hero Banner */}
          <div className="rounded-xl bg-[#111318] text-white border-2 border-[#111318] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 pixel-grid-bg opacity-25 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#EF875D]" />
                      <span>{focusedService.turnaroundNote[lang]}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {focusedService.title[lang]}
                </h2>

                <p className="text-sm sm:text-base text-slate-200 font-semibold leading-relaxed">
                  {focusedService.subtitle[lang]}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {focusedService.description[lang]}
                </p>
              </div>

              <div className="lg:col-span-4">
                <div className="rounded-xl bg-[#1A1D26] border border-white/15 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#EF875D] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {lang === 'ar'
                        ? 'ما الذي تتضمنه الخدمة؟'
                        : 'Service Quality Guarantee'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {(focusedService.checklist || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item[lang]}</span>
                      </li>
                    ))}
                  </ul>
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
                        {lang === 'ar' ? `المرحلة ${index + 1}` : `Stage ${index + 1}`}
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

          {/* Illustrative Before vs. After Thermal Maintenance Overview Card (for Cooling Service) */}
          {focusedService.thermalBenchmark && (
            <div
              data-testid="thermal-benchmark-comparison"
              className="rounded-xl bg-white border-2 border-[#111318] p-5 sm:p-6 space-y-5 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E4DEB]">
                    <Activity className="w-4 h-4" />
                    <span>
                      {lang === 'ar'
                        ? 'مقارنة توضيحية لحالة التبريد (قبل وبعد الصيانة — محتوى تجريبي)'
                        : 'Illustrative Thermal Status Comparison (Before vs. After — Demo Content)'}
                    </span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#111318] mt-0.5">
                    {focusedService.thermalBenchmark.deviceModel[lang]}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                  <Snowflake className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'ar'
                      ? 'تحسين تدفق الهواء واستقرار الأداء'
                      : 'Airflow & Thermal Stability Renewal'}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE CARD */}
                <div className="rounded-xl bg-rose-50/70 border-2 border-rose-200 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ar'
                          ? 'الأعراض الشائعة قبل الصيانة (Before)'
                          : 'Typical Symptoms Before Servicing'}
                      </span>
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-rose-700">
                      {lang === 'ar' ? 'إجهاد حراري مرتفع' : 'High Thermal Stress'}
                    </span>
                  </div>

                  {/* Illustrative Thermal Load Bar */}
                  <div className="w-full h-3 rounded-full bg-rose-200 overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full"
                      style={{ width: '88%' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-rose-200/80">
                      <span className="block text-slate-500">
                        {lang === 'ar' ? 'استقرار الأداء تحت الضغط:' : 'Load Stability:'}
                      </span>
                      <span className="font-bold text-rose-700">
                        {lang === 'ar'
                          ? 'احتمالية اختناق حراري (Throttling)'
                          : focusedService.thermalBenchmark.sustainedClockBefore}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-rose-200/80">
                      <span className="block text-slate-500">
                        {lang === 'ar' ? 'حالة التهوية والمراوح:' : 'Airflow & Fan State:'}
                      </span>
                      <span className="font-bold text-slate-800">
                        {focusedService.thermalBenchmark.fanNoiseBefore[lang]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AFTER CARD */}
                <div className="rounded-xl bg-emerald-50/70 border-2 border-emerald-300 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold">
                      <Snowflake className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ar'
                          ? 'النتيجة المستهدفة بعد الصيانة (After)'
                          : 'Target Outcome After Servicing'}
                      </span>
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-700">
                      {lang === 'ar' ? 'تبريد متوازن ومستقر' : 'Balanced Thermal Flow'}
                    </span>
                  </div>

                  {/* Illustrative Thermal Load Bar */}
                  <div className="w-full h-3 rounded-full bg-emerald-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: '58%' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80">
                      <span className="block text-slate-500">
                        {lang === 'ar' ? 'استقرار الأداء تحت الضغط:' : 'Load Stability:'}
                      </span>
                      <span className="font-bold text-emerald-700">
                        {lang === 'ar'
                          ? 'استقرار أفضل للتردد أثناء العمل والألعاب'
                          : focusedService.thermalBenchmark.sustainedClockAfter}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80">
                      <span className="block text-slate-500">
                        {lang === 'ar' ? 'حالة التهوية والمراوح:' : 'Airflow & Fan State:'}
                      </span>
                      <span className="font-bold text-slate-800">
                        {focusedService.thermalBenchmark.fanNoiseAfter[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Direct Service Contact CTA Block (Never a Request Product button) */}
          {renderDirectServiceContactBlock(focusedService)}
        </div>
      ) : (
        /* Full Services Directory Overview */
        <div className="space-y-6" data-testid="services-directory-grid">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {activeServices.map((srv) => {
              const isCooling = srv.id === 'service-cooling' || srv.iconKey === 'cooling';
              return (
                <div
                  key={srv.id}
                  data-testid={`service-card-${srv.id}`}
                  className={`rounded-xl bg-white border-2 transition-all flex flex-col justify-between p-5 shadow-xs ${
                    isCooling
                      ? 'border-[#8E4DEB] ring-2 ring-[#8E4DEB]/15'
                      : 'border-[#111318]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                          isCooling
                            ? 'bg-[#8E4DEB] text-white border-[#111318]'
                            : 'bg-[#111318] text-white border-[#111318]'
                        }`}
                      >
                        {renderServiceIcon(srv.iconKey, 'w-6 h-6')}
                      </div>

                      {srv.badge && (
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-[#111318] border border-slate-200 text-[11px] font-bold">
                          {srv.badge[lang]}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-lg font-extrabold text-[#111318] leading-snug">
                        {srv.title[lang]}
                      </h2>
                      <p className="text-xs font-semibold text-[#8E4DEB] leading-relaxed">
                        {srv.subtitle[lang]}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {srv.description[lang]}
                      </p>
                    </div>

                    {/* Key Highlights List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {srv.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#8E4DEB] shrink-0 mt-0.5" />
                          <span className="font-semibold">{hl.title[lang]}</span>
                        </div>
                      ))}
                    </div>

                    {srv.thermalBenchmark && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <Gauge className="w-4 h-4 text-emerald-600" />
                          <span>
                            {lang === 'ar'
                              ? 'محور الخدمة:'
                              : 'Service Focus:'}
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

                  {/* Card Footer: Open Detailed View + Direct Contact Icons */}
                  <div className="pt-4 mt-5 border-t border-slate-200 space-y-3">
                    <button
                      type="button"
                      data-testid={`open-service-detail-${srv.id}`}
                      onClick={() => onSelectService(srv.id)}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#111318] hover:bg-[#8E4DEB] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {lang === 'ar'
                          ? 'عرض تفاصيل الخدمة ومراحل التنفيذ'
                          : 'View Service Details & Protocol'}
                      </span>
                      {lang === 'ar' ? (
                        <ArrowLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
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
