'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogPage } from '../../components/storefront/CatalogPage';
import { StorefrontShell } from '../../components/storefront/StorefrontShell';
import { DEFAULT_FILTERS, useStore } from '../../context/StoreContext';
import { filtersFromCatalogSearchParams, pageFromCatalogSearchParams } from '../../lib/catalog-contract';

function CatalogContent() {
  const searchParams = useSearchParams();
  const {
    lang,
    themeId,
    catalogProducts,
    catalogPagination,
    catalogIsLoading,
    catalogError,
    retryCatalog,
    categories,
    brands,
    useCaseTags,
    offers,
    settings,
    effectiveNowMs,
    filters,
    updateFilters,
    resetFilters,
    setCatalogPage,
    handleNavigate,
    handleSelectProduct,
    setRequestModalProduct,
  } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    updateFilters(filtersFromCatalogSearchParams(params, DEFAULT_FILTERS));
    setCatalogPage(pageFromCatalogSearchParams(params), { syncHistory: false });
  }, [
    searchParams,
    updateFilters,
    setCatalogPage,
  ]);

  return (
    <StorefrontShell currentView="shop" activeCategoryId={filters.categoryId}>
      <CatalogPage
        mode="shop"
        lang={lang}
        themeId={themeId}
        products={catalogProducts}
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
        remoteCatalog
        catalogPagination={catalogPagination}
        catalogIsLoading={catalogIsLoading}
        catalogError={catalogError}
        onRetryCatalog={retryCatalog}
        onCatalogPageChange={setCatalogPage}
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
