'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductDetailPage } from '../../../components/storefront/ProductDetailPage';
import { StorefrontShell } from '../../../components/storefront/StorefrontShell';
import { useStore } from '../../../context/StoreContext';

export default function ProductDetailRoutePage() {
  const params = useParams<{ productId: string }>();
  const routeProductId = decodeURIComponent(params.productId ?? '');

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
    setSelectedProductId,
    handleNavigate,
    handleSelectProduct,
    setRequestModalProduct,
  } = useStore();

  useEffect(() => {
    if (routeProductId) {
      setSelectedProductId(routeProductId);
    }
  }, [routeProductId, setSelectedProductId]);

  const selectedProduct = products.find((p) => p.id === routeProductId);

  if (!selectedProduct) {
    return (
      <StorefrontShell currentView="product" activeCategoryId="ALL">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-xl font-bold text-[#111318]">
            {lang === 'ar' ? 'المنتج غير متاح' : 'Product unavailable'}
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {lang === 'ar'
              ? 'لم يتم العثور على هذا المنتج في الكتالوج الحالي.'
              : 'This product was not found in the current catalog.'}
          </p>
        </section>
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell
      currentView="product"
      activeCategoryId={selectedProduct.categoryId}
    >
      <ProductDetailPage
        product={selectedProduct}
        allProducts={products}
        categories={categories}
        brands={brands}
        useCaseTags={useCaseTags}
        offers={offers}
        usdToSypRate={settings.usdToSypRate}
        nowMs={effectiveNowMs}
        lang={lang}
        themeId={themeId}
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onRequestProduct={(prod) => setRequestModalProduct(prod)}
      />
    </StorefrontShell>
  );
}
