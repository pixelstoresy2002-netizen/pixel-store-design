import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { Language, Offer, Product } from '../../types/store';
import {
  formatSyp,
  formatUsd,
  resolveProductPricing,
  validateCustomerRequest,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';

interface RequestModalProps {
  product: Product | null;
  offers: Offer[];
  usdToSypRate: number;
  nowMs: number;
  lang: Language;
  onClose: () => void;
  onSubmitRequest: (payload: {
    product: Product;
    customerName: string;
    phoneNumber: string;
    note: string;
    priceUsd: number;
    priceSyp: number;
  }) => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  product,
  offers,
  usdToSypRate,
  nowMs,
  lang,
  onClose,
  onSubmitRequest,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const pricing = resolveProductPricing(product, offers, usdToSypRate, nowMs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCustomerRequest({ customerName, phoneNumber });
    if (!validation.valid) {
      setErrorMsg(
        lang === 'ar'
          ? validation.errorAr ?? 'بيانات غير مكتملة'
          : validation.errorEn ?? 'Invalid input'
      );
      return;
    }

    setErrorMsg(null);
    onSubmitRequest({
      product,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      note: note.trim(),
      priceUsd: pricing.effectiveUsd,
      priceSyp: pricing.effectiveSyp,
    });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111318]/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md my-auto bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Pixel Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8E4DEB] via-[#D66C9D] to-[#EF875D]" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2
              id="request-modal-title"
              className="text-base font-bold text-[#111318]"
            >
              {lang === 'ar'
                ? 'طلب المنتج عبر واتساب'
                : 'Request Product Now'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ar'
                ? 'سيتواصل معك فريق المبيعات مباشرة عبر واتساب لتأكيد الطلب'
                : 'Our team will contact you directly on WhatsApp to confirm availability'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'ar' ? 'إغلاق نافذة الطلب' : 'Close request dialog'}
            className="p-2 rounded-lg text-slate-400 hover:text-[#111318] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Product Summary Strip */}
        <div className="px-5 py-3 bg-[#F4F3F7]/70 border-b border-slate-200/70 flex items-center gap-3">
          <div className="w-16 h-12 rounded bg-white border border-slate-200 shrink-0 overflow-hidden">
            <ProductVisual
              visualKey={product.primaryImage}
              alt={product.name[lang]}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#111318] truncate">
              {product.name[lang]}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="font-mono-num text-sm font-bold text-[#8E4DEB]"
                dir="ltr"
              >
                {formatUsd(pricing.effectiveUsd)}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono-num text-xs text-slate-600">
                {formatSyp(pricing.effectiveSyp, lang)}
              </span>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111318]">
                {lang === 'ar'
                  ? 'تم تسجيل طلبك بنجاح!'
                  : 'Your Request Has Been Recorded!'}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {lang === 'ar'
                  ? `شكراً لك ${customerName}. تم حفظ طلبك في لوحة الإدارة وسيتواصل معك فريق بيكسل ستور عبر الرقم (${phoneNumber}) على واتساب خلال دقائق.`
                  : `Thank you, ${customerName}. Your inquiry is logged in our store system and our team will reach out via WhatsApp at (${phoneNumber}) shortly.`}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-lg bg-[#111318] text-white text-xs font-semibold hover:bg-[#8E4DEB] transition-colors"
              >
                {lang === 'ar' ? 'العودة إلى المتجر' : 'Return to Store'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
              >
                {errorMsg}
              </div>
            )}

            <div>
              <label
                htmlFor="req-customer-name"
                className="block text-xs font-semibold text-[#111318] mb-1.5"
              >
                {lang === 'ar' ? 'الاسم الكامل *' : 'Customer Name *'}
              </label>
              <input
                id="req-customer-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'مثال: أحمد المصري'
                    : 'e.g., Ahmad Al-Masri'
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-[#111318] placeholder:text-slate-400 focus:outline-none focus:border-[#8E4DEB] focus:ring-2 focus:ring-[#8E4DEB]/15"
              />
            </div>

            <div>
              <label
                htmlFor="req-phone-number"
                className="block text-xs font-semibold text-[#111318] mb-1.5"
              >
                {lang === 'ar'
                  ? 'رقم الهاتف (واتساب) *'
                  : 'Phone Number (WhatsApp) *'}
              </label>
              <input
                id="req-phone-number"
                type="tel"
                dir="ltr"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+963 944 000 000"
                className="w-full px-3.5 py-2.5 text-sm font-mono-num rounded-lg border border-slate-300 bg-white text-[#111318] placeholder:text-slate-400 focus:outline-none focus:border-[#8E4DEB] focus:ring-2 focus:ring-[#8E4DEB]/15 text-start"
              />
            </div>

            <div>
              <label
                htmlFor="req-note"
                className="block text-xs font-semibold text-[#111318] mb-1.5"
              >
                {lang === 'ar' ? 'ملاحظة إضافية (اختياري)' : 'Optional Note'}
              </label>
              <textarea
                id="req-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'أي استفسار حول المواصفات أو موعد الاستلام...'
                    : 'Any question about specs, upgrades, or pickup time...'
                }
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#111318] placeholder:text-slate-400 focus:outline-none focus:border-[#8E4DEB] focus:ring-2 focus:ring-[#8E4DEB]/15 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7B39D8] text-white text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'إرسال طلب المنتج' : 'Submit Request'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
