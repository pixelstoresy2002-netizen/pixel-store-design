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

  const selectedProduct =
    products.find((p) => p.id === routeProductId) ?? products[0];

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
