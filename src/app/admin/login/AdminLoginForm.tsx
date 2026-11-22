'use client';

import React, { useState } from 'react';
import { LockKeyhole, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { PixelLogo } from '@/components/visuals/PixelLogo';

interface AdminLoginFormProps {
  nextPath: string;
}

export default function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [isArabic, setIsArabic] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = isArabic;

  return (
    <main
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F4F3F7] px-4 py-10 sm:px-6 flex items-center justify-center"
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <PixelLogo variant="light" size="sm" />
          <button
            type="button"
            onClick={() => setIsArabic((value) => !value)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:border-[#8E4DEB] hover:text-[#8E4DEB] focus-visible:outline-2 focus-visible:outline-[#8E4DEB]"
          >
            {isAr ? 'English' : 'العربية'}
          </button>
        </div>

        <div className="mt-7">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8E4DEB]/10 text-[#8E4DEB]">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mt-3 text-xl font-extrabold text-[#111318]">
            {isAr ? 'تسجيل دخول الإدارة' : 'Admin sign in'}
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {isAr
              ? 'استخدم بيانات حساب الإدارة المعتمد للوصول إلى لوحة التحكم.'
              : 'Use your approved administrator account to access the dashboard.'}
          </p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (isSubmitting) return;

            setError(null);
            setIsSubmitting(true);
            try {
              const { error: signInError } = await authClient.signIn.email({
                email: email.trim(),
                password,
              });
              if (signInError) {
                setError(isAr
                  ? 'تعذر تسجيل الدخول. تحقق من بيانات حساب الإدارة وحاول مرة أخرى.'
                  : 'Sign-in failed. Check your administrator credentials and try again.');
                return;
              }

              router.replace(nextPath);
              router.refresh();
            } catch {
              setError(isAr
                ? 'تعذر تسجيل الدخول حالياً. حاول مرة أخرى.'
                : 'Sign-in is temporarily unavailable. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <label className="block text-sm font-bold text-slate-800">
            {isAr ? 'البريد الإلكتروني' : 'Email address'}
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              dir="ltr"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#111318] outline-none transition focus:border-[#8E4DEB] focus:ring-2 focus:ring-[#8E4DEB]/20"
            />
          </label>
          <label className="block text-sm font-bold text-slate-800">
            {isAr ? 'كلمة المرور' : 'Password'}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              dir="ltr"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#111318] outline-none transition focus:border-[#8E4DEB] focus:ring-2 focus:ring-[#8E4DEB]/20"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold leading-5 text-rose-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#8E4DEB] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#7A38D8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E4DEB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {isSubmitting
              ? isAr ? 'جارٍ تسجيل الدخول…' : 'Signing in…'
              : isAr ? 'تسجيل الدخول' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] leading-5 text-slate-500">
          {isAr
            ? 'لا يتوفر إنشاء حسابات عامة. تواصل مع مالك المتجر عند الحاجة إلى وصول الإدارة.'
            : 'Public registration is unavailable. Contact the store owner if you need Admin access.'}
        </p>
      </section>
    </main>
  );
}
