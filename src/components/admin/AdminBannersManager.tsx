'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  BannerDestinationView,
  Category,
  HeroSlide,
  Language,
  PromoBanner,
} from '../../types/store';
import { VISUAL_KEY_PRESETS } from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';

interface AdminBannersManagerProps {
  lang: Language;
  heroSlides: HeroSlide[];
  promoBanners: PromoBanner[];
  categories: Category[];
  onSaveHeroSlide: (slide: HeroSlide) => void;
  onReorderHeroSlides: (slides: HeroSlide[]) => void;
  onDeleteHeroSlide: (slideId: string) => void;
  onSavePromoBanner: (banner: PromoBanner) => void;
  onReorderPromoBanners: (banners: PromoBanner[]) => void;
  onNotify: (msgAr: string, msgEn: string) => void;
}

export const AdminBannersManager: React.FC<AdminBannersManagerProps> = ({
  lang,
  heroSlides,
  promoBanners,
  categories,
  onSaveHeroSlide,
  onReorderHeroSlides,
  onDeleteHeroSlide,
  onSavePromoBanner,
  onReorderPromoBanners,
  onNotify,
}) => {
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  const sortedSlides = [...heroSlides].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const sortedBanners = [...promoBanners].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const topCategories = categories.filter((c) => !c.parentId);

  const handleMoveSlide = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sortedSlides.length) return;
    const copy = [...sortedSlides];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    onReorderHeroSlides(copy);
    onNotify('تم تحديث ترتيب شرائح العرض الرئيسية', 'Hero slides order updated');
  };

  const handleMoveBanner = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sortedBanners.length) return;
    const copy = [...sortedBanners];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    onReorderPromoBanners(copy);
    onNotify('تم تحديث ترتيب البنرات الجانبية', 'Promo banners order updated');
  };

  return (
    <div className="space-y-6" data-testid="admin-banners-panel">
      {/* SECTION 1: HERO CAROUSEL SLIDES (5 SLIDES) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base font-extrabold text-[#111318]">
              {lang === 'ar'
                ? 'شرائح العرض الرئيسية في الصفحة الرئيسية (Hero Carousel Slides)'
                : 'Homepage Hero Carousel Slides'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ar'
                ? 'تحكم في العناوين (عربي/إنكليزي)، الصور، أزرار التوجيه، وترتيب الظهور للشرائح الخمس المتحركة'
                : 'Manage bilingual titles, subtitles, CTA links, hardware visuals, display order, and visibility'}
            </p>
          </div>
          <button
            type="button"
            data-testid="admin-add-hero-slide-btn"
            onClick={() =>
              setEditingSlide({
                id: `slide-${Date.now()}`,
                kicker: {
                  ar: 'قسم مميز في بيكسل ستور',
                  en: 'FEATURED HARDWARE SHOWCASE',
                },
                title: {
                  ar: '',
                  en: '',
                },
                subtitle: {
                  ar: '',
                  en: '',
                },
                ctaLabel: {
                  ar: 'تصفح القسم',
                  en: 'Explore Category',
                },
                visualKey: 'laptop-rog-front',
                targetView: 'category',
                targetCategory: 'laptops',
                accent: '#8E4DEB',
                sortOrder: sortedSlides.length + 1,
                isActive: true,
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {lang === 'ar' ? 'إضافة شريحة جديدة' : 'Add Hero Slide'}
            </span>
          </button>
        </div>

        {/* Hero Slide Editor Modal/Form */}
        {editingSlide && (
          <form
            data-testid="admin-hero-slide-editor"
            onSubmit={(e) => {
              e.preventDefault();
              onSaveHeroSlide(editingSlide);
              setEditingSlide(null);
              onNotify(
                'تم حفظ شريحة العرض وتحديث الصفحة الرئيسية',
                'Hero slide saved & synced to homepage'
              );
            }}
            className="p-5 rounded-xl border-2 border-[#8E4DEB] bg-[#FAF9FC] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-sm font-extrabold text-[#111318]">
                {lang === 'ar' ? 'تحرير شريحة العرض' : 'Edit Hero Slide'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-xs font-bold text-slate-500 hover:text-[#111318] cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'الشارة العلوية (Kicker — عربي)'
                    : 'Kicker Badge (Arabic)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.kicker.ar}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      kicker: { ...editingSlide.kicker, ar: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'الشارة العلوية (Kicker — إنكليزي)'
                    : 'Kicker Badge (English)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={editingSlide.kicker.en}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      kicker: { ...editingSlide.kicker, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'العنوان الرئيسي للشريحة (عربي) *'
                    : 'Slide Main Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  data-testid="hero-slide-title-ar"
                  value={editingSlide.title.ar}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      title: { ...editingSlide.title, ar: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'العنوان الرئيسي للشريحة (إنكليزي) *'
                    : 'Slide Main Title (English) *'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  data-testid="hero-slide-title-en"
                  value={editingSlide.title.en}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      title: { ...editingSlide.title, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'النص التوضيحي الفرعي (عربي)'
                    : 'Slide Subtitle (Arabic)'}
                </label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitle.ar}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      subtitle: {
                        ...editingSlide.subtitle,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'النص التوضيحي الفرعي (إنكليزي)'
                    : 'Slide Subtitle (English)'}
                </label>
                <textarea
                  rows={2}
                  dir="ltr"
                  value={editingSlide.subtitle.en}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      subtitle: {
                        ...editingSlide.subtitle,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar' ? 'نص الزر (عربي)' : 'CTA Label (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.ctaLabel.ar}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      ctaLabel: {
                        ...editingSlide.ctaLabel,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar' ? 'نص الزر (إنكليزي)' : 'CTA Label (EN)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={editingSlide.ctaLabel.en}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      ctaLabel: {
                        ...editingSlide.ctaLabel,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar' ? 'وجهة الرابط' : 'Target View'}
                </label>
                <select
                  value={editingSlide.targetView}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      targetView: e.target.value as BannerDestinationView,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                >
                  <option value="category">Category Page (صفحة قسم)</option>
                  <option value="shop">All Products Catalog (الكتالوج)</option>
                  <option value="offers">Exclusive Offers (العروض)</option>
                  <option value="services">Technical Services (الخدمات)</option>
                  <option value="contact">Contact Us (تواصل معنا)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar' ? 'القسم المستهدف' : 'Target Category'}
                </label>
                <select
                  value={editingSlide.targetCategory ?? ''}
                  disabled={editingSlide.targetView !== 'category'}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      targetCategory: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold disabled:opacity-50"
                >
                  {topCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-1">
              <div>
                <label className="block text-xs font-bold text-[#111318] mb-1">
                  {lang === 'ar'
                    ? 'الصورة المعروضة (Hardware Visual)'
                    : 'Slide Hardware Visual Key'}
                </label>
                <select
                  value={editingSlide.visualKey}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      visualKey: e.target.value,
                    })
                  }
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono-num"
                >
                  {VISUAL_KEY_PRESETS.map((grp) => (
                    <optgroup key={grp.group} label={grp.group}>
                      {grp.keys.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-[#111318] pt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingSlide.isActive}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      isActive: e.target.checked,
                    })
                  }
                  className="rounded text-[#8E4DEB]"
                />
                <span>
                  {lang === 'ar'
                    ? 'شريحة نشطة ومعروضة في الرئيسية'
                    : 'Active & Visible on Homepage'}
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  data-testid="save-hero-slide-btn"
                  className="px-5 py-2 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ الشريحة' : 'Save Slide'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Slides List */}
        <div className="space-y-3">
          {sortedSlides.map((slide, idx) => (
            <div
              key={slide.id}
              data-testid={`admin-hero-slide-row-${slide.id}`}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                slide.isActive
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50 border-slate-200/70 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-20 h-14 rounded-lg bg-[#111318] border border-slate-300 overflow-hidden shrink-0">
                  <ProductVisual
                    visualKey={slide.visualKey}
                    alt={slide.title[lang]}
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#111318] text-[#EF875D] font-mono-num text-[10px] font-bold">
                      #{idx + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        slide.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {slide.isActive
                        ? lang === 'ar'
                          ? 'ظاهرة'
                          : 'Active'
                        : lang === 'ar'
                        ? 'مخفية'
                        : 'Hidden'}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8E4DEB]">
                      {slide.kicker[lang]}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#111318] line-clamp-1">
                    {slide.title[lang]}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {slide.subtitle[lang]}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveSlide(idx, 'up')}
                  className="p-1.5 rounded border border-slate-200 hover:border-[#8E4DEB] disabled:opacity-35 cursor-pointer"
                  title={lang === 'ar' ? 'تحريك لأعلى' : 'Move Up'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedSlides.length - 1}
                  onClick={() => handleMoveSlide(idx, 'down')}
                  className="p-1.5 rounded border border-slate-200 hover:border-[#8E4DEB] disabled:opacity-35 cursor-pointer"
                  title={lang === 'ar' ? 'تحريك لأسفل' : 'Move Down'}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSaveHeroSlide({ ...slide, isActive: !slide.isActive });
                    onNotify(
                      'تم تحديث حالة ظهور الشريحة',
                      'Slide visibility updated'
                    );
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-200 hover:border-[#111318] text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  {slide.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إخفاء' : 'Hide'}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إظهار' : 'Show'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  data-testid={`edit-hero-slide-${slide.id}`}
                  onClick={() => setEditingSlide({ ...slide })}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#111318] hover:bg-[#8E4DEB] text-white text-[11px] font-bold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                </button>

                {sortedSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteHeroSlide(slide.id);
                      onNotify('تم حذف الشريحة', 'Hero slide deleted');
                    }}
                    className="p-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer"
                    title={lang === 'ar' ? 'حذف الشريحة' : 'Delete Slide'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SECONDARY PROMOTIONAL SIDE BANNERS (2 STACKED BANNERS) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-[#111318]">
            {lang === 'ar'
              ? 'البنرات الترويجية الجانبية (Secondary Promotional Banners)'
              : 'Secondary Side Promotional Banners'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'ar'
              ? 'البطاقتان الترويجيتان بجوار السلايدر الرئيسي (قسم التجميع الاحترافي + الفرز حسب الاستخدام)'
              : 'The two promotional cards displayed alongside the Hero Carousel on the homepage'}
          </p>
        </div>

        {editingBanner && (
          <form
            data-testid="admin-promo-banner-editor"
            onSubmit={(e) => {
              e.preventDefault();
              onSavePromoBanner(editingBanner);
              setEditingBanner(null);
              onNotify(
                'تم حفظ البنر الترويجي بنجاح',
                'Promotional banner updated'
              );
            }}
            className="p-5 rounded-xl border-2 border-[#D66C9D] bg-[#FAF9FC] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="text-sm font-extrabold text-[#111318]">
                {lang === 'ar' ? 'تحرير البنر الجانبي' : 'Edit Side Banner'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="text-xs font-bold text-slate-500 hover:text-[#111318] cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'الشارة العلوية (عربي)' : 'Kicker (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.kicker.ar}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      kicker: { ...editingBanner.kicker, ar: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'الشارة العلوية (إنكليزي)' : 'Kicker (EN)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={editingBanner.kicker.en}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      kicker: { ...editingBanner.kicker, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'عنوان البنر (عربي) *' : 'Banner Title (AR) *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title.ar}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      title: { ...editingBanner.title, ar: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar'
                    ? 'عنوان البنر (إنكليزي) *'
                    : 'Banner Title (EN) *'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={editingBanner.title.en}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      title: { ...editingBanner.title, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'الوصف المختصر (عربي)' : 'Subtitle (AR)'}
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle.ar}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      subtitle: {
                        ...editingBanner.subtitle,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'الوصف المختصر (إنكليزي)' : 'Subtitle (EN)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={editingBanner.subtitle.en}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      subtitle: {
                        ...editingBanner.subtitle,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'نص الرابط (عربي)' : 'CTA Text (AR)'}
                </label>
                <input
                  type="text"
                  value={editingBanner.ctaLabel.ar}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      ctaLabel: {
                        ...editingBanner.ctaLabel,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'نص الرابط (إنكليزي)' : 'CTA Text (EN)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={editingBanner.ctaLabel.en}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      ctaLabel: {
                        ...editingBanner.ctaLabel,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {lang === 'ar' ? 'القسم المستهدف' : 'Target Category'}
                </label>
                <select
                  value={editingBanner.targetCategory ?? 'pc-builds'}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      targetCategory: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                >
                  {topCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D66C9D] text-white text-xs font-bold cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ البنر' : 'Save Banner'}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedBanners.map((banner, idx) => (
            <div
              key={banner.id}
              data-testid={`admin-promo-banner-card-${banner.id}`}
              className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3 bg-[#F8F7FA]"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-16 h-14 rounded bg-[#111318] border border-slate-300 overflow-hidden shrink-0">
                  <ProductVisual
                    visualKey={banner.visualKey}
                    alt={banner.title[lang]}
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-[#8E4DEB]">
                    {banner.kicker[lang]}
                  </span>
                  <div className="text-xs font-extrabold text-[#111318] line-clamp-1">
                    {banner.title[lang]}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {banner.subtitle[lang]}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveBanner(idx, 'up')}
                  className="p-1.5 rounded bg-white border border-slate-200 disabled:opacity-35 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedBanners.length - 1}
                  onClick={() => handleMoveBanner(idx, 'down')}
                  className="p-1.5 rounded bg-white border border-slate-200 disabled:opacity-35 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  data-testid={`edit-promo-banner-${banner.id}`}
                  onClick={() => setEditingBanner({ ...banner })}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#111318] hover:bg-[#8E4DEB] text-white text-[11px] font-bold cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
