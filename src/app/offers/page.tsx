'use client';

import React from 'react';
import { OffersPage } from '../../components/storefront/OffersPage';
import { StorefrontShell } from '../../components/storefront/StorefrontShell';
import { useStore } from '../../context/StoreContext';

export default function OffersRoutePage() {
  const {
    lang,
    products,
    brands,
    offers,
    settings,
    effectiveNowMs,
    simulateExpiredOffers,
    setSimulateExpiredOffers,
    handleNavigate,
    handleSelectProduct,
    setRequestModalProduct,
  } = useStore();

  return (
    <StorefrontShell currentView="offers" activeCategoryId="ALL">
      <OffersPage
        lang={lang}
        products={products}
        brands={brands}
        offers={offers}
        usdToSypRate={settings.usdToSypRate}
        nowMs={effectiveNowMs}
        simulateExpiredOffers={simulateExpiredOffers}
        onToggleSimulateExpired={() =>
          setSimulateExpiredOffers((prev) => !prev)
        }
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onRequestProduct={(prod) => setRequestModalProduct(prod)}
      />
    </StorefrontShell>
  );
}
