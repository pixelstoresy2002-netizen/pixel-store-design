import type { Metadata } from 'next';
import React from 'react';
import { StoreProvider } from '../context/StoreContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pixel Store — Electronics & Gaming Hardware',
  description:
    'Interactive bilingual (Arabic RTL / English LTR) e-commerce storefront and admin design prototype for Pixel Store electronics, laptops, custom PC builds, and gaming hardware.',
  openGraph: {
    title: 'Pixel Store — Electronics & Gaming Hardware',
    description:
      'Interactive bilingual (Arabic RTL / English LTR) e-commerce storefront and admin design prototype for Pixel Store electronics, laptops, custom PC builds, and gaming hardware.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pixel Store — Electronics & Gaming Hardware',
    description:
      'Interactive bilingual (Arabic RTL / English LTR) e-commerce storefront and admin design prototype for Pixel Store electronics, laptops, custom PC builds, and gaming hardware.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="contrast"
      data-arabic-font="Cairo"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#ECEAF2] text-[#111318] antialiased selection:bg-[#8E4DEB]/15 selection:text-[#8E4DEB]">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
