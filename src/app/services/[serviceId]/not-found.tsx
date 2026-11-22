'use client';

import Link from 'next/link';

import { useStore } from '../../../context/StoreContext';

export default function ServiceNotFound() {
  const { lang } = useStore();

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-[760px] items-center px-4 py-10 sm:px-6">
      <section className="w-full rounded-xl border-2 border-[#111318] bg-white p-6 text-center shadow-xs sm:p-8">
        <p className="font-mono-num text-xs font-bold tracking-[0.2em] text-[#8E4DEB]">404</p>
        <h1 className="mt-2 text-xl font-extrabold text-[#111318] sm:text-2xl">
          {lang === 'ar' ? 'الخدمة المطلوبة غير موجودة' : 'Service Not Found'}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          {lang === 'ar'
            ? 'قد يكون رابط الخدمة غير صحيح أو أن هذه الخدمة لم تعد متاحة.'
            : 'This service link may be incorrect, or the service is no longer available.'}
        </p>
        <Link
          href="/services"
          className="mt-5 inline-flex rounded-lg bg-[#111318] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#8E4DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E4DEB]"
        >
          {lang === 'ar' ? 'العودة إلى الخدمات' : 'Browse Services'}
        </Link>
      </section>
    </main>
  );
}
