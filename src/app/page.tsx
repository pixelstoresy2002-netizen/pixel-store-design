'use client';

import React from 'react';
import { HomePage } from '../components/storefront/HomePage';
import { StorefrontShell } from '../components/storefront/StorefrontShell';
import { useStore } from '../context/StoreContext';

export default function HomeRoutePage() {
  const {
    lang,
    themeId,
    products,
    categories,
    brands,
    offers,
    heroSlides,
    promoBanners,
    settings,
    effectiveNowMs,
    handleNavigate,
    handleSelectProduct,
    setRequestModalProduct,
  } = useStore();

  return (
    <StorefrontShell currentView="home" activeCategoryId="ALL">
      <HomePage
        lang={lang}
        themeId={themeId}
        products={products}
        categories={categories}
        brands={brands}
        offers={offers}
        heroSlides={heroSlides}
        promoBanners={promoBanners}
        settings={settings}
        nowMs={effectiveNowMs}
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onRequestProduct={(prod) => setRequestModalProduct(prod)}
      />
    </StorefrontShell>
  );
}
