'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogPage } from '../../components/storefront/CatalogPage';
import { StorefrontShell } from '../../components/storefront/StorefrontShell';
import { DEFAULT_FILTERS, useStore } from '../../context/StoreContext';

function CatalogContent() {
  const searchParams = useSearchParams();
  const {
    lang,
    themeId,
    products,
    categories,
    brands,
    useCaseTags,
    offers,
    settings,
    effectiveNowMs,
    filters,
    updateFilters,
    resetFilters,
    handleNavigate,
    handleSelectProduct,
    setRequestModalProduct,
  } = useStore();

  const bestSellersParam = searchParams.get('bestSellers');
  const newArrivalsParam = searchParams.get('newArrivals');
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');

  useEffect(() => {
    if (bestSellersParam === '1') {
      updateFilters({
        ...DEFAULT_FILTERS,
        onlyBestSellers: true,
      });
    } else if (newArrivalsParam === '1') {
      updateFilters({
        ...DEFAULT_FILTERS,
        onlyNewArrivals: true,
      });
    } else if (categoryParam) {
      updateFilters({
        categoryId: categoryParam,
      });
    } else if (queryParam !== null) {
      updateFilters({
        searchQuery: queryParam,
      });
    }
  }, [
    bestSellersParam,
    newArrivalsParam,
    categoryParam,
    queryParam,
    updateFilters,
  ]);

  return (
    <StorefrontShell currentView="shop" activeCategoryId={filters.categoryId}>
      <CatalogPage
        mode="shop"
        lang={lang}
        themeId={themeId}
        products={products}
        categories={categories}
        brands={brands}
        useCaseTags={useCaseTags}
        offers={offers}
        usdToSypRate={settings.usdToSypRate}
        nowMs={effectiveNowMs}
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onRequestProduct={(prod) => setRequestModalProduct(prod)}
      />
    </StorefrontShell>
  );
}

export default function CatalogRoutePage() {
  return (
    <Suspense fallback={null}>
      <CatalogContent />
    </Suspense>
  );
}
