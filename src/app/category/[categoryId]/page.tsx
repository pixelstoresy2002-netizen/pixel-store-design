'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CatalogPage } from '../../../components/storefront/CatalogPage';
import { StorefrontShell } from '../../../components/storefront/StorefrontShell';
import { useStore } from '../../../context/StoreContext';
import { FilterState } from '../../../types/store';

function CategoryContent() {
  const params = useParams<{ categoryId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeCategoryId = decodeURIComponent(params.categoryId ?? 'ALL');
  const routeUseCase = searchParams.get('useCase') ?? 'ALL';

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
    setFilters,
    updateFilters,
    resetFilters,
    setCatalogPage,
    handleNavigate,
    handleSelectProduct,
    setRequestModalProduct,
  } = useStore();

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryId: routeCategoryId,
      subcategoryId: 'ALL',
      useCaseId: routeUseCase !== 'ALL' ? routeUseCase : prev.useCaseId,
    }));
  }, [routeCategoryId, routeUseCase, setFilters]);

  // Ensure initial render before useEffect uses the URL categoryId and clears subcategoryId
  const effectiveFilters: FilterState = {
    ...filters,
    categoryId: routeCategoryId,
    subcategoryId: 'ALL',
    useCaseId: routeUseCase !== 'ALL' ? routeUseCase : filters.useCaseId,
  };

  const handleCategoryFilterUpdate = (next: Partial<FilterState>) => {
    updateFilters(next);
    const targetCategoryId = next.categoryId ?? effectiveFilters.categoryId;

    if (next.categoryId === 'ALL') {
      router.push('/catalog');
      return;
    }

    if (next.subcategoryId !== undefined) {
      if (next.subcategoryId === 'ALL') {
        if (targetCategoryId !== routeCategoryId) {
          router.push(`/category/${encodeURIComponent(targetCategoryId)}`);
        }
      } else {
        router.push(
          `/category/${encodeURIComponent(targetCategoryId)}/${encodeURIComponent(next.subcategoryId)}`
        );
      }
      return;
    }

    if (next.categoryId !== undefined && next.categoryId !== routeCategoryId) {
      router.push(`/category/${encodeURIComponent(next.categoryId)}`);
    }
  };

  const handleCategoryResetFilters = () => {
    resetFilters();
    router.push('/catalog');
  };

  return (
    <StorefrontShell
      currentView="category"
      activeCategoryId={effectiveFilters.categoryId}
    >
      <CatalogPage
        mode="category"
        lang={lang}
        themeId={themeId}
        products={catalogProducts}
        categories={categories}
        brands={brands}
        useCaseTags={useCaseTags}
        offers={offers}
        usdToSypRate={settings.usdToSypRate}
        nowMs={effectiveNowMs}
        filters={effectiveFilters}
        onUpdateFilters={handleCategoryFilterUpdate}
        onResetFilters={handleCategoryResetFilters}
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

export default function CategoryRoutePage() {
  return (
    <Suspense fallback={null}>
      <CategoryContent />
    </Suspense>
  );
}
