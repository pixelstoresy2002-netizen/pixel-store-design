'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CatalogPage } from '../../../../components/storefront/CatalogPage';
import { StorefrontShell } from '../../../../components/storefront/StorefrontShell';
import { useStore } from '../../../../context/StoreContext';
import { FilterState } from '../../../../types/store';

function SubcategoryContent() {
  const params = useParams<{ categoryId: string; subcategoryId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeCategoryId = decodeURIComponent(params.categoryId ?? 'ALL');
  const routeSubcategoryId = decodeURIComponent(params.subcategoryId ?? 'ALL');
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
      subcategoryId: routeSubcategoryId,
      useCaseId: routeUseCase !== 'ALL' ? routeUseCase : prev.useCaseId,
    }));
  }, [routeCategoryId, routeSubcategoryId, routeUseCase, setFilters]);

  const effectiveFilters: FilterState =
    filters.categoryId === routeCategoryId &&
    filters.subcategoryId === routeSubcategoryId
      ? filters
      : {
          ...filters,
          categoryId: routeCategoryId,
          subcategoryId: routeSubcategoryId,
          useCaseId: routeUseCase !== 'ALL' ? routeUseCase : filters.useCaseId,
        };

  const handleSubcategoryFilterUpdate = (next: Partial<FilterState>) => {
    updateFilters(next);
    if (next.categoryId !== undefined) {
      if (next.categoryId === 'ALL') {
        router.push('/catalog');
      } else {
        router.push(`/category/${encodeURIComponent(next.categoryId)}`);
      }
    } else if (next.subcategoryId !== undefined) {
      if (next.subcategoryId === 'ALL') {
        router.push(
          `/category/${encodeURIComponent(effectiveFilters.categoryId)}`
        );
      } else if (next.subcategoryId !== routeSubcategoryId) {
        router.push(
          `/category/${encodeURIComponent(effectiveFilters.categoryId)}/${encodeURIComponent(next.subcategoryId)}`
        );
      }
    }
  };

  const handleSubcategoryResetFilters = () => {
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
        onUpdateFilters={handleSubcategoryFilterUpdate}
        onResetFilters={handleSubcategoryResetFilters}
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onRequestProduct={(prod) => setRequestModalProduct(prod)}
      />
    </StorefrontShell>
  );
}

export default function SubcategoryRoutePage() {
  return (
    <Suspense fallback={null}>
      <SubcategoryContent />
    </Suspense>
  );
}
