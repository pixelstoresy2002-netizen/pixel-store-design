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
    products,
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

  // Ensure initial render before useEffect uses the URL categoryId directly
  const effectiveFilters: FilterState =
    filters.categoryId === routeCategoryId
      ? filters
      : {
          ...filters,
          categoryId: routeCategoryId,
          subcategoryId: 'ALL',
          useCaseId: routeUseCase !== 'ALL' ? routeUseCase : filters.useCaseId,
        };

  const handleCategoryFilterUpdate = (next: Partial<FilterState>) => {
    updateFilters(next);
    if (next.categoryId !== undefined) {
      if (next.categoryId === 'ALL') {
        router.push('/catalog');
      } else if (next.categoryId !== routeCategoryId) {
        router.push(`/category/${encodeURIComponent(next.categoryId)}`);
      }
    } else if (
      next.subcategoryId !== undefined &&
      next.subcategoryId !== 'ALL'
    ) {
      router.push(
        `/category/${encodeURIComponent(effectiveFilters.categoryId)}/${encodeURIComponent(next.subcategoryId)}`
      );
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
        products={products}
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
