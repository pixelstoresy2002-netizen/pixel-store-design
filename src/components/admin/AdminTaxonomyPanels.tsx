'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  Layers,
  Award,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  FolderTree,
} from 'lucide-react';
import { Category, Brand, UseCaseTag, Product, Language } from '../../types/store';
import { VISUAL_KEY_PRESETS } from '../../utils/storeLogic';
import {
  queryAdminCategories,
  queryAdminBrands,
  queryAdminUseCaseTags,
} from '../../utils/adminQueryContract';

interface AdminCategoriesPanelProps {
  categories: Category[];
  products: Product[];
  useCaseTags: UseCaseTag[];
  lang: Language;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const ICON_OPTIONS = [
  'Laptop',
  'Cpu',
  'Monitor',
  'HardDrive',
  'Headphones',
  'Mouse',
  'Keyboard',
  'Briefcase',
  'Gamepad2',
  'Wrench',
  'Zap',
  'Shield',
  'Layers',
];

export const AdminCategoriesPanel: React.FC<AdminCategoriesPanelProps> = ({
  categories,
  products,
  useCaseTags,
  lang,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [parentFilter, setParentFilter] = useState<'ALL' | 'ROOT' | string>('ALL');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [categories]
  );

  const filteredCategories = useMemo(
    () =>
      queryAdminCategories(
        categories,
        products,
        searchQuery,
        parentFilter === 'ROOT' ? 'ROOT_ONLY' : parentFilter
      ),
    [categories, products, searchQuery, parentFilter]
  );

  // Form state
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formIconKey, setFormIconKey] = useState('Laptop');
  const [formVisualKey, setFormVisualKey] = useState('laptop-pro');
  const [formSortOrder, setFormSortOrder] = useState('10');
  const [formUseCaseIds, setFormUseCaseIds] = useState<string[]>([]);
  const [formIsActive, setFormIsActive] = useState(true);

  const startCreate = (defaultParentId = '') => {
    setDeleteError(null);
    setEditingCategory(null);
    setIsCreating(true);
    setFormNameAr('');
    setFormNameEn('');
    setFormDescAr('');
    setFormDescEn('');
    setFormParentId(defaultParentId);
    setFormIconKey('Laptop');
    setFormVisualKey('laptop-pro');
    setFormSortOrder(String((categories.length + 1) * 10));
    setFormUseCaseIds([]);
    setFormIsActive(true);
  };

  const startEdit = (cat: Category) => {
    setDeleteError(null);
    setIsCreating(false);
    setEditingCategory(cat);
    setFormNameAr(cat.name.ar);
    setFormNameEn(cat.name.en);
    setFormDescAr(cat.description.ar);
    setFormDescEn(cat.description.en);
    setFormParentId(cat.parentId || '');
    setFormIconKey(cat.iconKey || 'Laptop');
    setFormVisualKey(cat.visualKey || 'laptop-pro');
    setFormSortOrder(String(cat.sortOrder ?? 10));
    setFormUseCaseIds(cat.useCaseIds || []);
    setFormIsActive(cat.isActive !== false);
  };

  const closeEditor = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  const toggleUseCaseId = (ucId: string) => {
    setFormUseCaseIds((prev) =>
      prev.includes(ucId) ? prev.filter((id) => id !== ucId) : [...prev, ucId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim() && !formNameEn.trim()) return;

    const id = editingCategory ? editingCategory.id : `cat-${Date.now()}`;
    const slug = (formNameEn || formNameAr)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const saved: Category = {
      id,
      slug: editingCategory?.slug || slug || id,
      name: {
        ar: formNameAr.trim() || formNameEn.trim(),
        en: formNameEn.trim() || formNameAr.trim(),
      },
      description: {
        ar: formDescAr.trim() || formNameAr.trim(),
        en: formDescEn.trim() || formNameEn.trim(),
      },
      iconKey: formIconKey,
      visualKey: formVisualKey,
      parentId: formParentId || undefined,
      useCaseIds: formUseCaseIds,
      sortOrder: Number(formSortOrder) || 0,
      isActive: formIsActive,
    };

    onSaveCategory(saved);
    closeEditor();
  };

  const handleTryDelete = (cat: Category) => {
    setDeleteError(null);
    const childSubcats = categories.filter((c) => c.parentId === cat.id);
    const linkedProducts = products.filter(
      (p) => p.categoryId === cat.id || p.subcategoryId === cat.id
    );

    if (childSubcats.length > 0 || linkedProducts.length > 0) {
      setDeleteError(
        isAr
          ? `لا يمكن حذف "${cat.name.ar}" لأنه مرتبط بـ ${childSubcats.length} قسم فرعي و ${linkedProducts.length} منتج. قم بنقل أو تعديل العناصر المرتبطة أولاً.`
          : `Cannot delete "${cat.name.en}" because it has ${childSubcats.length} subcategories and ${linkedProducts.length} linked products. Reassign them first.`
      );
      return;
    }
    onDeleteCategory(cat.id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              {isAr ? 'إدارة الأقسام الرئيسية والفرعية' : 'Categories & Subcategories Management'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? `إجمالي ${categories.length} قسم (${rootCategories.length} رئيسي، ${categories.length - rootCategories.length} فرعي)`
                : `Total ${categories.length} categories (${rootCategories.length} root, ${categories.length - rootCategories.length} subcategories)`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => startCreate('')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {isAr ? 'إضافة قسم رئيسي' : 'Add Root Category'}
            </button>
            <button
              type="button"
              onClick={() => startCreate(rootCategories[0]?.id || '')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FolderTree className="w-4 h-4" />
              {isAr ? 'إضافة قسم فرعي' : 'Add Subcategory'}
            </button>
          </div>
        </div>

        {/* Search & Hierarchy Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث باسم القسم (عربي / إنجليزي) أو المعرف...' : 'Search category name (AR/EN) or ID...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg ps-9 pe-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="ALL">{isAr ? 'كل المستويات (رئيسي + فرعي)' : 'All Levels (Root + Sub)'}</option>
              <option value="ROOT">{isAr ? 'الأقسام الرئيسية فقط' : 'Root Categories Only'}</option>
              {rootCategories.map((rc) => (
                <option key={rc.id} value={rc.id}>
                  {isAr ? `فرعي من: ${rc.name.ar}` : `Subcategories of: ${rc.name.en}`}
                </option>
              ))}
            </select>
            {(searchQuery || parentFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setParentFilter('ALL');
                }}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title={isAr ? 'إعادة ضبط' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3 text-red-700 text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{deleteError}</span>
          </div>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            className="p-1 hover:bg-red-100 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create / Edit Form */}
      {(isCreating || editingCategory) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-blue-600 rounded-xl p-6 shadow-md space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-black text-slate-900">
              {editingCategory
                ? isAr
                  ? `تعديل القسم: ${editingCategory.name.ar}`
                  : `Edit Category: ${editingCategory.name.en}`
                : isAr
                ? 'إضافة قسم جديد'
                : 'Create New Category'}
            </h4>
            <button
              type="button"
              onClick={closeEditor}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الاسم بالعربية *' : 'Arabic Name *'}
              </label>
              <input
                type="text"
                required
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الاسم بالإنجليزية *' : 'English Name *'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'القسم الأب (اتركه فارغاً لقسم رئيسي)' : 'Parent Category (Empty = Root)'}
              </label>
              <select
                value={formParentId}
                onChange={(e) => setFormParentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="">{isAr ? '— قسم رئيسي (مستوى أول) —' : '— Root Category (Top Level) —'}</option>
                {rootCategories
                  .filter((rc) => rc.id !== editingCategory?.id)
                  .map((rc) => (
                    <option key={rc.id} value={rc.id}>
                      {rc.name[lang]} ({rc.id})
                    </option>
                  ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الوصف بالعربية' : 'Arabic Description'}
              </label>
              <input
                type="text"
                value={formDescAr}
                onChange={(e) => setFormDescAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الوصف بالإنجليزية' : 'English Description'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={formDescEn}
                onChange={(e) => setFormDescEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الأيقونة (Icon Key)' : 'Icon Key'}
              </label>
              <select
                value={formIconKey}
                onChange={(e) => setFormIconKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الصورة التوضيحية (Visual Key)' : 'Visual Key'}
              </label>
              <select
                value={formVisualKey}
                onChange={(e) => setFormVisualKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'ترتيب العرض' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  {isAr ? 'قسم نشط (ظاهر)' : 'Active (Visible)'}
                </label>
              </div>
            </div>
          </div>

          {/* Applicable Use Case Tags */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isAr ? 'وسوم الاستخدام المرتبطة بهذا القسم' : 'Applicable Use-Case Tags'}
            </label>
            <div className="flex flex-wrap gap-2">
              {useCaseTags.map((uc) => {
                const selected = formUseCaseIds.includes(uc.id);
                return (
                  <button
                    key={uc.id}
                    type="button"
                    onClick={() => toggleUseCaseId(uc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    <span>{uc.name[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeEditor}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              {isAr ? 'حفظ القسم' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="p-3.5 font-bold text-start">{isAr ? 'القسم (عربي / EN)' : 'Category (AR / EN)'}</th>
                <th className="p-3.5 font-bold text-start">{isAr ? 'المستوى / الأب' : 'Hierarchy / Parent'}</th>
                <th className="p-3.5 font-bold text-start">{isAr ? 'المنتجات' : 'Products'}</th>
                <th className="p-3.5 font-bold text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="p-3.5 font-bold text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCategories.map((cat) => {
                const parent = cat.parentId ? categories.find((c) => c.id === cat.parentId) : null;
                const count = products.filter(
                  (p) => p.categoryId === cat.id || p.subcategoryId === cat.id
                ).length;
                const subCount = categories.filter((c) => c.parentId === cat.id).length;

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{cat.name.ar}</div>
                      <div className="text-xs text-slate-500" dir="ltr">
                        {cat.name.en} <span className="font-mono text-[11px] text-slate-400">({cat.id})</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {parent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                          {isAr ? `فرعي من: ${parent.name.ar}` : `Sub of: ${parent.name.en}`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {isAr ? `قسم رئيسي (${subCount} فرعي)` : `Root (${subCount} sub)`}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-xs font-bold text-slate-700">
                      {count} {isAr ? 'منتج' : 'items'}
                    </td>
                    <td className="p-3.5">
                      {cat.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Eye className="w-3 h-3" /> {isAr ? 'ظاهر' : 'Visible'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          <EyeOff className="w-3 h-3" /> {isAr ? 'مخفي' : 'Hidden'}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-end">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={isAr ? 'تعديل' : 'Edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTryDelete(cat)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={isAr ? 'حذف آمن' : 'Safe Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-bold">
                    {isAr ? 'لا توجد أقسام مطابقة للبحث' : 'No matching categories found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * BRANDS PANEL
 * ========================================================================== */

interface AdminBrandsPanelProps {
  brands: Brand[];
  products: Product[];
  lang: Language;
  onSaveBrand: (brand: Brand) => void;
  onDeleteBrand: (id: string) => void;
}

export const AdminBrandsPanel: React.FC<AdminBrandsPanelProps> = ({
  brands,
  products,
  lang,
  onSaveBrand,
  onDeleteBrand,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCountryAr, setFormCountryAr] = useState('');
  const [formCountryEn, setFormCountryEn] = useState('');
  const [formFeatured, setFormFeatured] = useState(true);

  const filteredBrands = useMemo(
    () =>
      queryAdminBrands(
        brands,
        products,
        searchQuery,
        featuredFilter === 'ALL'
          ? 'ALL'
          : featuredFilter === 'FEATURED'
          ? 'true'
          : 'false'
      ),
    [brands, products, searchQuery, featuredFilter]
  );

  const startCreate = () => {
    setDeleteError(null);
    setEditingBrand(null);
    setIsCreating(true);
    setFormName('');
    setFormCountryAr('الولايات المتحدة');
    setFormCountryEn('USA');
    setFormFeatured(true);
  };

  const startEdit = (brand: Brand) => {
    setDeleteError(null);
    setIsCreating(false);
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormCountryAr(brand.country.ar);
    setFormCountryEn(brand.country.en);
    setFormFeatured(brand.featured);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const id = editingBrand
      ? editingBrand.id
      : `brand-${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-3)}`;

    onSaveBrand({
      id,
      name: formName.trim(),
      country: {
        ar: formCountryAr.trim() || 'عالمي',
        en: formCountryEn.trim() || 'Global',
      },
      featured: formFeatured,
      isActive: true,
    });
    setIsCreating(false);
    setEditingBrand(null);
  };

  const handleTryDelete = (brand: Brand) => {
    setDeleteError(null);
    const linked = products.filter((p) => p.brandId === brand.id);
    if (linked.length > 0) {
      setDeleteError(
        isAr
          ? `لا يمكن حذف العلامة التجارية "${brand.name}" لوجود ${linked.length} منتج مرتبط بها.`
          : `Cannot delete brand "${brand.name}" because ${linked.length} products are assigned to it.`
      );
      return;
    }
    onDeleteBrand(brand.id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              {isAr ? 'إدارة العلامات التجارية (Brands)' : 'Brands Management'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? `${brands.length} علامة تجارية مسجلة في المتجر`
                : `${brands.length} hardware brands registered`}
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isAr ? 'إضافة علامة تجارية' : 'Add Brand'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث باسم الشركة أو بلد المنشأ...' : 'Search brand name or country...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg ps-9 pe-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as 'ALL' | 'FEATURED' | 'STANDARD')}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          >
            <option value="ALL">{isAr ? 'كل العلامات التجارية' : 'All Brands'}</option>
            <option value="FEATURED">{isAr ? 'المميزة في الرئيسية فقط' : 'Featured Only'}</option>
            <option value="STANDARD">{isAr ? 'غير المميزة' : 'Non-Featured'}</option>
          </select>
        </div>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3 text-red-700 text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{deleteError}</span>
          </div>
          <button type="button" onClick={() => setDeleteError(null)} className="p-1 hover:bg-red-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {(isCreating || editingBrand) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-blue-600 rounded-xl p-5 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-black text-slate-900">
              {editingBrand
                ? isAr
                  ? `تعديل العلامة التجارية: ${editingBrand.name}`
                  : `Edit Brand: ${editingBrand.name}`
                : isAr
                ? 'إضافة علامة تجارية جديدة'
                : 'Add New Brand'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingBrand(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'اسم العلامة التجارية *' : 'Brand Name *'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. ASUS / Lenovo"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'بلد المنشأ (عربي)' : 'Country (AR)'}
              </label>
              <input
                type="text"
                value={formCountryAr}
                onChange={(e) => setFormCountryAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'بلد المنشأ (إنجليزي)' : 'Country (EN)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={formCountryEn}
                onChange={(e) => setFormCountryEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              {isAr ? 'إظهار ضمن العلامات التجارية المميزة' : 'Featured Brand on Storefront'}
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingBrand(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                {isAr ? 'حفظ العلامة' : 'Save Brand'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => {
          const count = products.filter((p) => p.brandId === brand.id).length;
          return (
            <div
              key={brand.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-slate-900" dir="ltr">
                    {brand.name}
                  </span>
                  {brand.featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {isAr ? 'مميزة' : 'Featured'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {brand.country[lang]} •{' '}
                  <span className="font-bold text-slate-700">
                    {count} {isAr ? 'منتج' : 'products'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(brand)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={isAr ? 'تعديل' : 'Edit'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTryDelete(brand)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={isAr ? 'حذف آمن' : 'Safe Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * USE-CASE TAGS PANEL
 * ========================================================================== */

interface AdminUseCasesPanelProps {
  useCaseTags: UseCaseTag[];
  categories: Category[];
  products: Product[];
  lang: Language;
  onSaveUseCaseTag: (tag: UseCaseTag) => void;
  onDeleteUseCaseTag: (id: string) => void;
}

export const AdminUseCasesPanel: React.FC<AdminUseCasesPanelProps> = ({
  useCaseTags,
  categories,
  products,
  lang,
  onSaveUseCaseTag,
  onDeleteUseCaseTag,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTag, setEditingTag] = useState<UseCaseTag | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSubAr, setFormSubAr] = useState('');
  const [formSubEn, setFormSubEn] = useState('');
  const [formAccentColor, setFormAccentColor] = useState<'purple' | 'pink' | 'coral'>('purple');
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [formSortOrder, setFormSortOrder] = useState('10');

  const rootCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);

  const filteredTags = useMemo(
    () => queryAdminUseCaseTags(useCaseTags, searchQuery),
    [useCaseTags, searchQuery]
  );

  const startCreate = () => {
    setEditingTag(null);
    setIsCreating(true);
    setFormNameAr('');
    setFormNameEn('');
    setFormSubAr('');
    setFormSubEn('');
    setFormAccentColor('purple');
    setFormCategories(['laptops']);
    setFormSortOrder(String((useCaseTags.length + 1) * 10));
  };

  const startEdit = (tag: UseCaseTag) => {
    setIsCreating(false);
    setEditingTag(tag);
    setFormNameAr(tag.name.ar);
    setFormNameEn(tag.name.en);
    setFormSubAr(tag.subtitle.ar);
    setFormSubEn(tag.subtitle.en);
    setFormAccentColor(tag.accentColor || 'purple');
    setFormCategories(tag.applicableCategories || []);
    setFormSortOrder(String(tag.sortOrder ?? 10));
  };

  const toggleApplicableCat = (catId: string) => {
    setFormCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim() && !formNameEn.trim()) return;
    const id = editingTag ? editingTag.id : `uc-${Date.now()}`;

    onSaveUseCaseTag({
      id,
      name: {
        ar: formNameAr.trim() || formNameEn.trim(),
        en: formNameEn.trim() || formNameAr.trim(),
      },
      subtitle: {
        ar: formSubAr.trim() || formNameAr.trim(),
        en: formSubEn.trim() || formNameEn.trim(),
      },
      accentColor: formAccentColor,
      visualKey: editingTag?.visualKey || 'usecase-gaming',
      applicableCategories: formCategories,
      sortOrder: Number(formSortOrder) || 10,
      isActive: true,
    });
    setIsCreating(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {isAr ? 'إدارة وسوم الاستخدام (Use-Case Tags)' : 'Use-Case Tags Management'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'تصنيفات أفقية مستقلة عن الأقسام لتسهيل اختيار الجهاز حسب طبيعة العمل (هندسة، ألعاب، دراسة...)'
                : 'Cross-cutting merchandising tags independent of categories (Gaming, Engineering, Study...)'}
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {isAr ? 'إضافة وسم استخدام' : 'Add Use-Case Tag'}
          </button>
        </div>

        <div className="relative pt-2 border-t border-slate-100">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في وسوم الاستخدام...' : 'Search use-case tags...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg ps-9 pe-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {(isCreating || editingTag) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-blue-600 rounded-xl p-5 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-black text-slate-900">
              {editingTag
                ? isAr
                  ? `تعديل الوسم: ${editingTag.name.ar}`
                  : `Edit Use-Case Tag: ${editingTag.name.en}`
                : isAr
                ? 'إضافة وسم استخدام جديد'
                : 'Create New Use-Case Tag'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTag(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'اسم الوسم (عربي) *' : 'Tag Name (AR) *'}
              </label>
              <input
                type="text"
                required
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'اسم الوسم (إنجليزي) *' : 'Tag Name (EN) *'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'وصف مختصر (عربي)' : 'Subtitle (AR)'}
              </label>
              <input
                type="text"
                value={formSubAr}
                onChange={(e) => setFormSubAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'وصف مختصر (إنجليزي)' : 'Subtitle (EN)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={formSubEn}
                onChange={(e) => setFormSubEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-700">
                {isAr ? 'الأقسام المرتبطة بهذا الوسم:' : 'Applicable Root Categories:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {rootCategories.map((rc) => {
                  const active = formCategories.includes(rc.id);
                  return (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => toggleApplicableCat(rc.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        active
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {rc.name[lang]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingTag(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                {isAr ? 'حفظ الوسم' : 'Save Tag'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => {
          const count = products.filter((p) => p.useCaseIds.includes(tag.id)).length;
          return (
            <div
              key={tag.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-black text-slate-900 text-sm">{tag.name.ar}</div>
                  <div className="text-xs font-semibold text-slate-500" dir="ltr">
                    {tag.name.en}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{tag.subtitle[lang]}</p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 shrink-0">
                  {count} {isAr ? 'منتج' : 'items'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">{tag.id}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(tag)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteUseCaseTag(tag.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
