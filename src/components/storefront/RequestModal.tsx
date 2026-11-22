'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { Language, Offer, Product } from '../../types/store';
import {
  formatSyp,
  formatUsd,
  resolveProductPricing,
  validateCustomerRequest,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';
import type { CustomerInterestResult } from '../../actions/submit-customer-interest';
import {
  getDialogTabTargetIndex,
  shouldCloseDialogForKey,
} from '../../lib/dialog-focus';

const FOCUSABLE_DIALOG_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

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
  }) => Promise<CustomerInterestResult>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const returnButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const submissionInFlightRef = useRef(false);
  const submissionSequenceRef = useRef(0);
  const productId = product?.id;

  useLayoutEffect(() => {
    if (!productId) return;

    setCustomerName('');
    setPhoneNumber('');
    setNote('');
    setErrorMsg(null);
    setSubmitted(false);
    setIsSubmitting(false);
    submissionInFlightRef.current = false;
    submissionSequenceRef.current += 1;
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const frame = window.requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      submissionSequenceRef.current += 1;
      submissionInFlightRef.current = false;
      const trigger = triggerRef.current;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [productId]);

  useEffect(() => {
    if (submitted) returnButtonRef.current?.focus();
  }, [submitted]);

  useEffect(() => {
    if (!productId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [productId]);

  const handleClose = useCallback(() => {
    if (submissionInFlightRef.current) return;
    setCustomerName('');
    setPhoneNumber('');
    setNote('');
    setErrorMsg(null);
    setSubmitted(false);
    onClose();
  }, [onClose]);

  if (!product) return null;

  const pricing = resolveProductPricing(product, offers, usdToSypRate, nowMs);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (shouldCloseDialogForKey(event.key)) {
      event.preventDefault();
      handleClose();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = dialogRef.current
      ? Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_DIALOG_SELECTOR))
      : [];
    const activeIndex = focusable.indexOf(document.activeElement as HTMLElement);
    const targetIndex = getDialogTabTargetIndex(
      focusable.length,
      activeIndex,
      event.shiftKey,
    );
    if (targetIndex === null) return;

    event.preventDefault();
    focusable[targetIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionInFlightRef.current) return;
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
    submissionInFlightRef.current = true;
    const submissionSequence = ++submissionSequenceRef.current;
    setIsSubmitting(true);
    try {
      const result = await onSubmitRequest({
        product,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        note: note.trim(),
        // Display prices are retained for mock mode only. The server action
        // always re-reads product, offer, and exchange-rate values.
        priceUsd: pricing.effectiveUsd,
        priceSyp: pricing.effectiveSyp,
      });
      if (submissionSequence !== submissionSequenceRef.current) return;
      if (result.status === 'success') {
        setSubmitted(true);
        return;
      }
      setErrorMsg(
        lang === 'ar'
          ? result.status === 'duplicate'
            ? 'تم استلام طلب مماثل مؤخراً. يرجى الانتظار قبل الإرسال مرة أخرى.'
            : result.status === 'validation-error'
              ? 'يرجى مراجعة الاسم ورقم الهاتف ثم المحاولة مرة أخرى.'
              : result.status === 'unavailable'
                ? 'لم يعد هذا المنتج متاحاً للطلب. يرجى اختيار منتج آخر.'
            : 'تعذر تسجيل الطلب حالياً. يرجى المحاولة لاحقاً.'
          : result.status === 'duplicate'
            ? 'A matching request was received recently. Please wait before submitting again.'
            : result.status === 'validation-error'
              ? 'Please check your name and phone number, then try again.'
              : result.status === 'unavailable'
                ? 'This product is no longer available to request. Please choose another product.'
            : 'Your request could not be recorded right now. Please try again later.'
      );
    } catch {
      if (submissionSequence !== submissionSequenceRef.current) return;
      setErrorMsg(
        lang === 'ar'
          ? 'تعذر تسجيل الطلب حالياً. يرجى المحاولة لاحقاً.'
          : 'Your request could not be recorded right now. Please try again later.'
      );
    } finally {
      if (submissionSequence === submissionSequenceRef.current) {
        submissionInFlightRef.current = false;
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111318]/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
      aria-describedby="request-modal-description"
      tabIndex={-1}
      onKeyDown={handleDialogKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
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
            <p id="request-modal-description" className="text-xs text-slate-500 mt-0.5">
              {lang === 'ar'
                ? 'أرسل طلبك وسيتواصل معك المتجر عبر واتساب.'
                : 'Submit your request and the store will contact you via WhatsApp.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label={lang === 'ar' ? 'إغلاق نافذة الطلب' : 'Close request dialog'}
            className="p-2 rounded-lg text-slate-400 hover:text-[#111318] hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-[#8E4DEB] disabled:cursor-not-allowed disabled:opacity-50"
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
                  ? `شكراً لك ${customerName}. تم استلام طلبك وسيتواصل معك المتجر عبر الرقم (${phoneNumber}) على واتساب.`
                  : `Thank you, ${customerName}. Your request has been submitted and the store will contact you via WhatsApp at (${phoneNumber}).`}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                ref={returnButtonRef}
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-lg bg-[#111318] text-white text-xs font-semibold hover:bg-[#8E4DEB] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E4DEB]"
              >
                {lang === 'ar' ? 'العودة إلى المتجر' : 'Return to Store'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate aria-busy={isSubmitting}>
            {errorMsg && (
              <div
                role="alert"
                id="request-modal-error"
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
                ref={nameInputRef}
                type="text"
                required
                value={customerName}
                aria-invalid={Boolean(errorMsg)}
                aria-describedby={errorMsg ? 'request-modal-error' : undefined}
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
                aria-invalid={Boolean(errorMsg)}
                aria-describedby={errorMsg ? 'request-modal-error' : undefined}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+963 9XX XXX XXX"
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
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-[#8E4DEB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#8E4DEB] hover:bg-[#7B39D8] text-white text-xs font-bold transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E4DEB] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? lang === 'ar'
                      ? 'جارٍ الإرسال...'
                      : 'Submitting...'
                    : lang === 'ar'
                      ? 'إرسال طلب المنتج'
                      : 'Submit Request'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
