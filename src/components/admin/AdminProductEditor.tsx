'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Flame,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import {
  AvailabilityStatus,
  Brand,
  Category,
  Language,
  Offer,
  Product,
  ProductCondition,
  UseCaseTag,
} from '../../types/store';
import {
  convertUsdToSyp,
  formatSyp,
  formatUsd,
  getProductGalleryImages,
  MAX_PRODUCT_GALLERY_IMAGES,
  resolveProductPricing,
  VISUAL_KEY_PRESETS,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';

interface AdminProductEditorProps {
  lang: Language;
  product: Product;
  isNew: boolean;
  categories: Category[];
  brands: Brand[];
  useCaseTags: UseCaseTag[];
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  onCancel: () => void;
  onSave: (product: Product) => void;
  onManageOfferForProduct?: (productId: string) => void;
}

export const AdminProductEditor: React.FC<AdminProductEditorProps> = ({
  lang,
  product: initialProduct,
  isNew,
  categories,
  brands,
  useCaseTags,
  offers,
  usdToSypRate,
  nowMs,
  onCancel,
  onSave,
  onManageOfferForProduct,
}) => {
  const [draft, setDraft] = useState<Product>(() => {
    const gallery = getProductGalleryImages(initialProduct);
    return {
      ...initialProduct,
      primaryImage: gallery[0] ?? initialProduct.primaryImage,
      secondaryImage:
        gallery[1] ?? gallery[0] ?? initialProduct.secondaryImage,
      galleryImages: gallery,
      isActive: initialProduct.isActive ?? true,
    };
  });

  const [includeLaptopSpecs, setIncludeLaptopSpecs] = useState<boolean>(
    Boolean(initialProduct.laptopSpecs)
  );
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>(
    VISUAL_KEY_PRESETS[0]?.keys[0] ?? 'laptop-rog-front'
  );
  const [customImageInput, setCustomImageInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const galleryList =
    draft.galleryImages && draft.galleryImages.length > 0
      ? draft.galleryImages
      : [draft.primaryImage];

  const pricing = resolveProductPricing(draft, offers, usdToSypRate, nowMs);

  const syncGallery = (nextGallery: string[]) => {
    const cleaned = nextGallery.map((k) => k.trim()).filter(Boolean);
    const safeGallery =
      cleaned.length > 0
        ? cleaned.slice(0, MAX_PRODUCT_GALLERY_IMAGES)
        : ['laptop-rog-front'];
    setDraft((prev) => ({
      ...prev,
      primaryImage: safeGallery[0],
      secondaryImage: safeGallery[1] ?? safeGallery[0],
      galleryImages: safeGallery,
    }));
  };

  const handleSetPrimaryImage = (idx: number) => {
    if (idx <= 0 || idx >= galleryList.length) return;
    const chosen = galleryList[idx];
    const rest = galleryList.filter((_, i) => i !== idx);
    syncGallery([chosen, ...rest]);
  };

  const handleMoveImage = (idx: number, direction: 'prev' | 'next') => {
    const targetIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= galleryList.length) return;
    const copy = [...galleryList];
    const [item] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, item);
    syncGallery(copy);
  };

  const handleRemoveImage = (idx: number) => {
    if (galleryList.length <= 1) return;
    syncGallery(galleryList.filter((_, i) => i !== idx));
  };

  const handleAddGalleryKey = (keyToAdd: string) => {
    const trimmed = keyToAdd.trim();
    if (!trimmed) return;
    if (galleryList.includes(trimmed)) {
      setValidationError(
        lang === 'ar'
          ? 'هذه الصورة مضافة مسبقاً في معرض المنتج.'
          : 'This image angle is already in the product gallery.'
      );
      return;
    }
    if (galleryList.length >= MAX_PRODUCT_GALLERY_IMAGES) {
      setValidationError(
        lang === 'ar'
          ? 'الحد الأقصى لمعرض المنتج هو 5 صور.'
          : 'Maximum of 5 gallery images reached.'
      );
      return;
    }
    setValidationError(null);
    syncGallery([...galleryList, trimmed]);
  };

  const handleToggleUseCase = (tagId: string) => {
    setDraft((prev) => {
      const exists = prev.useCaseIds.includes(tagId);
      return {
        ...prev,
        useCaseIds: exists
          ? prev.useCaseIds.filter((id) => id !== tagId)
          : [...prev.useCaseIds, tagId],
      };
    });
  };

  const handleAddGenericSpec = () => {
    setDraft((prev) => ({
      ...prev,
      specs: [
        ...prev.specs,
        {
          label: { ar: '', en: '' },
          value: { ar: '', en: '' },
        },
      ],
    }));
  };

  const handleUpdateGenericSpec = (
    idx: number,
    field: 'labelAr' | 'labelEn' | 'valueAr' | 'valueEn',
    val: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      specs: prev.specs.map((spec, i) => {
        if (i !== idx) return spec;
        if (field === 'labelAr') {
          return { ...spec, label: { ...spec.label, ar: val } };
        }
        if (field === 'labelEn') {
          return { ...spec, label: { ...spec.label, en: val } };
        }
        if (field === 'valueAr') {
          return { ...spec, value: { ...spec.value, ar: val } };
        }
        return { ...spec, value: { ...spec.value, en: val } };
      }),
    }));
  };

  const handleRemoveGenericSpec = (idx: number) => {
    setDraft((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.ar.trim() || !draft.name.en.trim()) {
      setValidationError(
        lang === 'ar'
          ? 'يرجى إدخال اسم المنتج بالعربية والإنكليزية.'
          : 'Please enter both Arabic and English product names.'
      );
      return;
    }
    if (!draft.sku.trim()) {
      setValidationError(
        lang === 'ar' ? 'يرجى إدخال رمز المنتج SKU.' : 'Product SKU is required.'
      );
      return;
    }
    if (draft.priceUsd <= 0) {
      setValidationError(
        lang === 'ar'
          ? 'يجب أن يكون السعر الأساسي بالدولار أكبر من الصفر.'
          : 'Base USD price must be greater than zero.'
      );
      return;
    }

    const cleanedSpecs = draft.specs.filter(
      (s) =>
        s.label.ar.trim() ||
        s.label.en.trim() ||
        s.value.ar.trim() ||
        s.value.en.trim()
    );

    const finalProduct: Product = {
      ...draft,
      sku: draft.sku.trim(),
      name: {
        ar: draft.name.ar.trim(),
        en: draft.name.en.trim(),
      },
      description: {
        ar:
          draft.description.ar.trim() ||
          draft.name.ar.trim(),
        en:
          draft.description.en.trim() ||
          draft.name.en.trim(),
      },
      primaryImage: galleryList[0] ?? 'laptop-rog-front',
      secondaryImage: galleryList[1] ?? galleryList[0] ?? 'laptop-rog-front',
      galleryImages: galleryList,
      laptopSpecs: includeLaptopSpecs
        ? draft.laptopSpecs ?? {
            processor: '',
            memory: '',
            storage: '',
            display: '',
          }
        : undefined,
      specs: cleanedSpecs,
      updatedAt: new Date().toISOString(),
    };

    onSave(finalProduct);
  };

  const topCategories = categories.filter((c) => !c.parentId);
  const availableSubcategories = categories.filter(
    (c) => c.parentId === draft.categoryId
  );

  return (
    <div
      data-testid="admin-product-editor"
      className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#111318] text-white text-[10px] font-mono-num font-bold uppercase">
              {isNew
                ? lang === 'ar'
                  ? 'منتج جديد'
                  : 'NEW PRODUCT'
                : draft.sku}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111318]">
              {isNew
                ? lang === 'ar'
                  ? 'إضافة منتج جديد إلى الكتالوج'
                  : 'Create New Catalog Product'
                : lang === 'ar'
                ? 'تعديل بيانات المنتج الكاملة'
                : 'Edit Product Record'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'جميع التعديلات تنعكس فوراً في واجهة المتجر، صفحات الأقسام، ومعرض الصور الخماسي'
              : 'All changes synchronize immediately with storefront cards, category pages, and the 5-angle gallery'}
          </p>
        </div>

        <button
          type="button"
          data-testid="product-editor-back-btn"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#111318] text-xs font-bold text-slate-700 cursor-pointer"
        >
          <BackArrow className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'العودة لجدول المنتجات' : 'Back to Products'}</span>
        </button>
      </div>

      {validationError && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
        >
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: BASIC INFORMATION */}
        <section className="p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111318]">
              {lang === 'ar'
                ? '1. المعلومات الأساسية والوصف (Basic Information)'
                : '1. Basic Information & Bilingual Copy'}
            </h3>
            <span className="text-[11px] font-mono-num text-slate-400">
              ID: {draft.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar'
                  ? 'اسم المنتج (بالعربية) *'
                  : 'Product Name (Arabic) *'}
              </label>
              <input
                type="text"
                required
                data-testid="product-editor-name-ar"
                value={draft.name.ar}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: { ...draft.name, ar: e.target.value },
                  })
                }
                placeholder="مثال: لابتوب ألعاب ASUS ROG Strix G16"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar'
                  ? 'اسم المنتج (بالإنكليزية) *'
                  : 'Product Name (English) *'}
              </label>
              <input
                type="text"
                dir="ltr"
                required
                data-testid="product-editor-name-en"
                value={draft.name.en}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: { ...draft.name, en: e.target.value },
                  })
                }
                placeholder="e.g. ASUS ROG Strix G16 Gaming Laptop"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111318] mb-1">
                SKU *
              </label>
              <input
                type="text"
                dir="ltr"
                required
                data-testid="product-editor-sku"
                value={draft.sku}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    sku: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono-num font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar'
                  ? 'الوصف التفصيلي (بالعربية)'
                  : 'Product Description (Arabic)'}
              </label>
              <textarea
                rows={3}
                data-testid="product-editor-desc-ar"
                value={draft.description.ar}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    description: { ...draft.description, ar: e.target.value },
                  })
                }
                placeholder="وصف واضح لمميزات القطعة أو حالة الجهاز المستعمل..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar'
                  ? 'الوصف التفصيلي (بالإنكليزية)'
                  : 'Product Description (English)'}
              </label>
              <textarea
                rows={3}
                dir="ltr"
                data-testid="product-editor-desc-en"
                value={draft.description.en}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    description: { ...draft.description, en: e.target.value },
                  })
                }
                placeholder="Detailed hardware overview or clean used condition notes..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: CLASSIFICATION & USE-CASE TAGS */}
        <section className="p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111318] border-b border-slate-100 pb-2.5">
            {lang === 'ar'
              ? '2. التصنيف، العلامة التجارية، ووسوم الاستخدام (Classification & Tags)'
              : '2. Classification, Brand & Use-Case Tags'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar' ? 'القسم الرئيسي *' : 'Primary Category *'}
              </label>
              <select
                data-testid="product-editor-category"
                value={draft.categoryId}
                onChange={(e) => {
                  const nextCat = e.target.value;
                  const firstSub = categories.find(
                    (c) => c.parentId === nextCat
                  );
                  setDraft({
                    ...draft,
                    categoryId: nextCat,
                    subcategoryId: firstSub?.id,
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
              >
                {topCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar' ? 'القسم الفرعي' : 'Subcategory'}
              </label>
              <select
                data-testid="product-editor-subcategory"
                value={draft.subcategoryId ?? ''}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    subcategoryId: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="">
                  {lang === 'ar' ? 'بدون قسم فرعي' : 'No Subcategory'}
                </option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar' ? 'العلامة التجارية (Brand) *' : 'Brand *'}
              </label>
              <select
                data-testid="product-editor-brand"
                value={draft.brandId}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    brandId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.country[lang]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Independent Use-Case Tags Assignment */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-[#111318] mb-2">
              {lang === 'ar'
                ? 'وسوم الاستخدام المستقلة (Use-Case Tags — يمكن اختيار أكثر من وسم)'
                : 'Independent Use-Case Tags (Select all applicable workflows)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {useCaseTags.map((tag) => {
                const selected = draft.useCaseIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    data-testid={`product-editor-usecase-${tag.id}`}
                    onClick={() => handleToggleUseCase(tag.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#111318] text-white border-[#111318]'
                        : 'bg-[#F8F7FA] text-slate-700 border-slate-200 hover:border-[#8E4DEB]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selected ? 'bg-[#EF875D]' : 'bg-slate-300'
                      }`}
                    />
                    <span>{tag.name[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: 5-IMAGE GALLERY MANAGER */}
        <section className="p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111318] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#8E4DEB]" />
                <span>
                  {lang === 'ar'
                    ? '3. معرض صور المنتج الخماسي (5-Image Product Gallery)'
                    : '3. Five-Image Product Gallery & Primary Image'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'ar'
                  ? 'الصورة رقم 1 هي الصورة الرئيسية، وتتبدل الصور 1 ← 2 ← 3 ← 4 ← 5 تلقائياً كل ثانية عند تمرير المؤشر على بطاقة المنتج.'
                  : 'Slot #1 is the primary image. Cards cycle smoothly 1 → 2 → 3 → 4 → 5 every 1000ms on hover.'}
              </p>
            </div>
            <span
              data-testid="product-editor-gallery-count"
              className="px-2.5 py-1 rounded bg-[#111318] text-[#EF875D] font-mono-num text-xs font-bold"
            >
              {galleryList.length} / {MAX_PRODUCT_GALLERY_IMAGES}{' '}
              {lang === 'ar' ? 'صور' : 'Images'}
            </span>
          </div>

          {/* 5-Slot Visual Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {galleryList.map((imgKey, idx) => {
              const isPrimary = idx === 0;
              return (
                <div
                  key={`${imgKey}-${idx}`}
                  data-testid={`product-editor-gallery-slot-${idx}`}
                  className={`rounded-xl border-2 p-2.5 flex flex-col justify-between gap-2 bg-[#F8F7FA] ${
                    isPrimary ? 'border-[#8E4DEB]' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded ${
                          isPrimary
                            ? 'bg-[#8E4DEB] text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isPrimary
                          ? lang === 'ar'
                            ? '1 · الرئيسية'
                            : '#1 PRIMARY'
                          : `#${idx + 1} ANGLE`}
                      </span>

                      <div className="flex items-center gap-1" dir="ltr">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'prev')}
                          title="Move earlier"
                          className="p-1 rounded bg-white border border-slate-200 disabled:opacity-35 hover:border-[#8E4DEB] cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === galleryList.length - 1}
                          onClick={() => handleMoveImage(idx, 'next')}
                          title="Move later"
                          className="p-1 rounded bg-white border border-slate-200 disabled:opacity-35 hover:border-[#8E4DEB] cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3 -rotate-90" />
                        </button>
                      </div>
                    </div>

                    <div className="aspect-[4/3] w-full rounded-lg bg-white border border-slate-200 overflow-hidden">
                      <ProductVisual
                        visualKey={imgKey}
                        alt={`Gallery slot ${idx + 1}`}
                      />
                    </div>

                    <div
                      className="text-[10px] font-mono-num text-slate-500 truncate"
                      dir="ltr"
                      title={imgKey}
                    >
                      {imgKey}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200/70">
                    {!isPrimary ? (
                      <button
                        type="button"
                        data-testid={`set-primary-image-${idx}`}
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8E4DEB] hover:underline cursor-pointer"
                      >
                        <Star className="w-3 h-3" />
                        <span>
                          {lang === 'ar' ? 'تعيين كرئيسية' : 'Make Primary'}
                        </span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>
                          {lang === 'ar' ? 'الصورة الأساسية' : 'Primary Cover'}
                        </span>
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={galleryList.length <= 1}
                      data-testid={`remove-gallery-image-${idx}`}
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 rounded text-rose-600 hover:bg-rose-50 disabled:opacity-30 cursor-pointer"
                      title={lang === 'ar' ? 'حذف الصورة' : 'Remove image'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Image Controls (Preset Visual Key or Custom Asset Path/URL) */}
          {galleryList.length < MAX_PRODUCT_GALLERY_IMAGES && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 bg-[#F4F3F7] p-3.5 rounded-xl">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-[#111318] mb-1">
                    {lang === 'ar'
                      ? 'إضافة زاوية تصوير من مكتبة المتجر'
                      : 'Add Studio Hardware Angle from Preset Library'}
                  </label>
                  <select
                    value={selectedPresetKey}
                    onChange={(e) => setSelectedPresetKey(e.target.value)}
                    dir="ltr"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono-num"
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
                <button
                  type="button"
                  data-testid="add-preset-gallery-btn"
                  onClick={() => handleAddGalleryKey(selectedPresetKey)}
                  className="px-3 py-1.5 rounded-lg bg-[#111318] hover:bg-[#8E4DEB] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  {lang === 'ar' ? '+ إضافة للمعرض' : '+ Add Angle'}
                </button>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-[#111318] mb-1">
                    {lang === 'ar'
                      ? 'أو إدخال مسار صورة مخصص (/assets/... أو URL)'
                      : 'Or Add Custom Image Asset URL / Key'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={customImageInput}
                    onChange={(e) => setCustomImageInput(e.target.value)}
                    placeholder="/assets/products/custom-angle.png"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono-num"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleAddGalleryKey(customImageInput);
                    setCustomImageInput('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#8E4DEB] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  {lang === 'ar' ? '+ إضافة رابط' : '+ Add URL'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4 & 5: PRICING (AUTHORITATIVE USD + DERIVED SYP) & CONDITION / AVAILABILITY */}
        <section className="p-4 sm:p-5 rounded-xl bg-[#F4F3F7] border border-slate-200/90 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111318]">
              {lang === 'ar'
                ? '4. التسعير بالدولار، الحالة (NEW/USED)، والتوفر (Pricing & Condition)'
                : '4. Authoritative USD Pricing, Condition & Availability'}
            </h3>
            <span className="text-[11px] font-mono-num text-slate-600" dir="ltr">
              1 USD = {usdToSypRate.toLocaleString('en-US')} SYP
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar'
                  ? 'السعر الأساسي المعتمد (USD $) *'
                  : 'Authoritative Base Price (USD $) *'}
              </label>
              <input
                type="number"
                dir="ltr"
                min={1}
                step="0.01"
                required
                data-testid="product-editor-price-usd"
                value={draft.priceUsd}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    priceUsd: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono-num font-extrabold text-[#111318]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {lang === 'ar'
                  ? 'السعر بالليرة السورية (يُحسب تلقائياً)'
                  : 'Calculated SYP Price (Read-Only)'}
              </label>
              <div
                data-testid="product-editor-calculated-syp"
                className="px-3 py-2 rounded-lg bg-white/80 border border-slate-200 text-sm font-mono-num font-bold text-[#8E4DEB]"
              >
                {formatSyp(
                  convertUsdToSyp(draft.priceUsd, usdToSypRate),
                  lang
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar'
                  ? 'حالة الجهاز (NEW أو USED فقط)'
                  : 'Product Condition (NEW / USED only)'}
              </label>
              <select
                data-testid="product-editor-condition"
                value={draft.condition}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    condition: e.target.value as ProductCondition,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
              >
                <option value="NEW">NEW (جديد بالكرتونة)</option>
                <option value="USED">USED (مستعمل نظيف مفحوص)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111318] mb-1">
                {lang === 'ar' ? 'حالة التوفر' : 'Availability Status'}
              </label>
              <select
                data-testid="product-editor-availability"
                value={draft.availability}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    availability: e.target.value as AvailabilityStatus,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
              >
                <option value="IN_STOCK">IN_STOCK (متوفر جاهز للتسليم)</option>
                <option value="ON_REQUEST">ON_REQUEST (متوفر حسب الطلب)</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK (غير متوفر حالياً)</option>
              </select>
            </div>
          </div>

          {/* Active Offer Association Banner */}
          {pricing.hasActiveOffer && pricing.activeOffer && (
            <div className="p-3 rounded-lg bg-[#111318] text-white flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#EF875D]" />
                <span>
                  {lang === 'ar'
                    ? `هذا المنتج مرتبط بعرض نشط حالياً بسعر ${formatUsd(pricing.effectiveUsd)} بدلاً من ${formatUsd(pricing.originalUsd)} (-${pricing.discountPercent}%)`
                    : `Active promotional offer applied: ${formatUsd(pricing.effectiveUsd)} instead of ${formatUsd(pricing.originalUsd)} (-${pricing.discountPercent}%)`}
                </span>
              </div>
              {onManageOfferForProduct && (
                <button
                  type="button"
                  onClick={() => onManageOfferForProduct(draft.id)}
                  className="px-2.5 py-1 rounded bg-[#D66C9D] text-white text-[11px] font-bold cursor-pointer"
                >
                  {lang === 'ar' ? 'إدارة العرض المؤقت' : 'Manage Timed Offer'}
                </button>
              )}
            </div>
          )}
        </section>

        {/* SECTION 6: SPECIFICATIONS (4-FIELD LAPTOP SPECS + DYNAMIC KEY-VALUE SPECS) */}
        <section className="p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111318] border-b border-slate-100 pb-2.5">
            {lang === 'ar'
              ? '5. المواصفات التقنية (Laptop 4-Field Specs & Hardware Attributes)'
              : '5. Hardware Specifications'}
          </h3>

          {/* Optional 4-Field Laptop Specifications */}
          <div className="p-3.5 rounded-xl bg-[#F8F7FA] border border-slate-200 space-y-3">
            <label className="flex items-center gap-2 text-xs font-extrabold text-[#8E4DEB] cursor-pointer">
              <input
                type="checkbox"
                data-testid="product-editor-laptop-specs-toggle"
                checked={includeLaptopSpecs}
                onChange={(e) => setIncludeLaptopSpecs(e.target.checked)}
                className="rounded text-[#8E4DEB]"
              />
              <span>
                {lang === 'ar'
                  ? 'تفعيل الحقول الأربعة المخصصة للابتوبات (Processor / Memory / Storage / Display)'
                  : 'Enable Dedicated 4-Field Laptop Specifications (Processor, Memory, Storage, Display)'}
              </span>
            </label>

            {includeLaptopSpecs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Processor (المعالج)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.laptopSpecs?.processor ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        laptopSpecs: {
                          processor: e.target.value,
                          memory: draft.laptopSpecs?.memory ?? '',
                          storage: draft.laptopSpecs?.storage ?? '',
                          display: draft.laptopSpecs?.display ?? '',
                        },
                      })
                    }
                    placeholder="e.g. Intel Core i7-14650HX (16 Cores)"
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Memory / RAM (الذاكرة العشوائية)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.laptopSpecs?.memory ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        laptopSpecs: {
                          processor: draft.laptopSpecs?.processor ?? '',
                          memory: e.target.value,
                          storage: draft.laptopSpecs?.storage ?? '',
                          display: draft.laptopSpecs?.display ?? '',
                        },
                      })
                    }
                    placeholder="e.g. 16GB DDR5 5600MHz"
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Storage (التخزين)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.laptopSpecs?.storage ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        laptopSpecs: {
                          processor: draft.laptopSpecs?.processor ?? '',
                          memory: draft.laptopSpecs?.memory ?? '',
                          storage: e.target.value,
                          display: draft.laptopSpecs?.display ?? '',
                        },
                      })
                    }
                    placeholder="e.g. 1TB PCIe 4.0 NVMe M.2 SSD"
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Display (الشاشة)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.laptopSpecs?.display ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        laptopSpecs: {
                          processor: draft.laptopSpecs?.processor ?? '',
                          memory: draft.laptopSpecs?.memory ?? '',
                          storage: draft.laptopSpecs?.storage ?? '',
                          display: e.target.value,
                        },
                      })
                    }
                    placeholder='e.g. 16" QHD+ 240Hz 100% DCI-P3'
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generic Bilingual Specification Rows */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111318]">
                {lang === 'ar'
                  ? 'مواصفات إضافية تظهر في صفحة تفاصيل المنتج (Bilingual Specs Table)'
                  : 'Additional Product Detail Specifications (Bilingual Key/Value)'}
              </label>
              <button
                type="button"
                data-testid="product-editor-add-spec-btn"
                onClick={handleAddGenericSpec}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F4F3F7] hover:bg-[#8E4DEB] hover:text-white text-xs font-bold text-[#111318] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar' ? 'إضافة سطر مواصفات' : 'Add Spec Row'}
                </span>
              </button>
            </div>

            {draft.specs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {lang === 'ar'
                  ? 'لا توجد مواصفات إضافية مسجلة حالياً.'
                  : 'No additional specification rows configured.'}
              </p>
            ) : (
              <div className="space-y-2">
                {draft.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-[#F8F7FA] border border-slate-200"
                  >
                    <input
                      type="text"
                      value={spec.label.ar}
                      onChange={(e) =>
                        handleUpdateGenericSpec(idx, 'labelAr', e.target.value)
                      }
                      placeholder="العنوان (عربي) مثل: كرت الشاشة"
                      className="sm:col-span-3 px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={spec.label.en}
                      onChange={(e) =>
                        handleUpdateGenericSpec(idx, 'labelEn', e.target.value)
                      }
                      placeholder="Label (EN) e.g. Graphics"
                      className="sm:col-span-3 px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                    />
                    <input
                      type="text"
                      value={spec.value.ar}
                      onChange={(e) =>
                        handleUpdateGenericSpec(idx, 'valueAr', e.target.value)
                      }
                      placeholder="القيمة (عربي)"
                      className="sm:col-span-3 px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                    />
                    <div className="sm:col-span-3 flex items-center gap-1.5">
                      <input
                        type="text"
                        dir="ltr"
                        value={spec.value.en}
                        onChange={(e) =>
                          handleUpdateGenericSpec(idx, 'valueEn', e.target.value)
                        }
                        placeholder="Value (EN)"
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGenericSpec(idx)}
                        className="p-1.5 rounded text-rose-600 hover:bg-rose-50 shrink-0 cursor-pointer"
                        aria-label="Remove specification row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: MERCHANDISING & VISIBILITY FLAGS */}
        <section className="p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111318] border-b border-slate-100 pb-2.5">
            {lang === 'ar'
              ? '6. خيارات العرض والتسويق (Merchandising & Visibility Flags)'
              : '6. Merchandising & Storefront Visibility Flags'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7FA] border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                data-testid="product-editor-bestseller"
                checked={draft.isBestSeller}
                onChange={(e) =>
                  setDraft({ ...draft, isBestSeller: e.target.checked })
                }
                className="mt-0.5 rounded text-[#8E4DEB]"
              />
              <div>
                <div className="text-xs font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'الأكثر مبيعاً (Best Seller)'
                    : 'Manual Best Seller Flag'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {lang === 'ar'
                    ? 'يظهر في قسم الأكثر مبيعاً في الرئيسية'
                    : 'Displays in Homepage Best Sellers section'}
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7FA] border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                data-testid="product-editor-newarrival"
                checked={draft.isNewArrival}
                onChange={(e) =>
                  setDraft({ ...draft, isNewArrival: e.target.checked })
                }
                className="mt-0.5 rounded text-[#8E4DEB]"
              />
              <div>
                <div className="text-xs font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'وصل حديثاً (New Arrival)'
                    : 'New Arrival Merchandising'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {lang === 'ar'
                    ? 'يظهر في قسم وصل حديثاً والفلتر الخاص به'
                    : 'Displays in Homepage New Arrivals rail'}
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7FA] border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                data-testid="product-editor-featured"
                checked={draft.isFeatured}
                onChange={(e) =>
                  setDraft({ ...draft, isFeatured: e.target.checked })
                }
                className="mt-0.5 rounded text-[#8E4DEB]"
              />
              <div>
                <div className="text-xs font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'منتج مميز (Featured Priority)'
                    : 'Featured Catalog Priority'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {lang === 'ar'
                    ? 'يمنح أولوية الظهور في الترتيب الافتراضي'
                    : 'Prioritized first in default Featured sort'}
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7FA] border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                data-testid="product-editor-active"
                checked={draft.isActive !== false}
                onChange={(e) =>
                  setDraft({ ...draft, isActive: e.target.checked })
                }
                className="mt-0.5 rounded text-emerald-600"
              />
              <div>
                <div className="text-xs font-bold text-[#111318]">
                  {lang === 'ar'
                    ? 'منشور في المتجر (Visible)'
                    : 'Published on Storefront'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {lang === 'ar'
                    ? 'إلغاء التحديد يخفي المنتج مؤقتاً من المتجر'
                    : 'Uncheck to hide product as draft'}
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {lang === 'ar' ? 'إلغاء التعديلات' : 'Cancel'}
          </button>
          <button
            type="submit"
            data-testid="product-editor-save-btn"
            className="px-6 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7A38D8] text-white text-xs font-bold cursor-pointer"
          >
            {lang === 'ar'
              ? 'حفظ المنتج وتحديث المتجر'
              : 'Save Product & Sync Storefront'}
          </button>
        </div>
      </form>
    </div>
  );
};
