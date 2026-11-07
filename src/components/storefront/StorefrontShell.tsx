'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { RequestModal } from './RequestModal';
import { StoreFooter } from './StoreFooter';
import { StorefrontView, StoreHeader } from './StoreHeader';

interface StorefrontShellProps {
  currentView: StorefrontView;
  activeCategoryId?: string | 'ALL';
  selectedServiceIdOverride?: string | 'ALL';
  children: React.ReactNode;
}

export const StorefrontShell: React.FC<StorefrontShellProps> = ({
  currentView,
  activeCategoryId,
  selectedServiceIdOverride,
  children,
}) => {
  const {
    lang,
    themeId,
    settings,
    categories,
    filters,
    selectedServiceId,
    activeOffersCount,
    pendingRequestsCount,
    requestModalProduct,
    offers,
    effectiveNowMs,
    handleToggleLanguage,
    handleNavigate,
    handleSearchSubmit,
    setRequestModalProduct,
    handleSubmitCustomerRequest,
  } = useStore();

  const pageSurfaceClass =
    themeId === 'contrast'
      ? 'bg-[#ECEAF2] bg-pixel-subtle text-[#111318]'
      : 'bg-[#F4F3F7] bg-pixel-subtle text-[#111318]';

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col ${pageSurfaceClass}`}
    >
      <StoreHeader
        lang={lang}
        themeId={themeId}
        settings={settings}
        categories={categories}
        currentView={currentView}
        activeCategoryId={activeCategoryId ?? filters.categoryId}
        selectedServiceId={selectedServiceIdOverride ?? selectedServiceId}
        searchQuery={filters.searchQuery}
        activeOffersCount={activeOffersCount}
        pendingRequestsCount={pendingRequestsCount}
        onToggleLanguage={handleToggleLanguage}
        onNavigate={handleNavigate}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1">{children}</main>

      <StoreFooter
        lang={lang}
        settings={settings}
        categories={categories}
        onNavigate={handleNavigate}
      />

      <RequestModal
        product={requestModalProduct}
        offers={offers}
        usdToSypRate={settings.usdToSypRate}
        nowMs={effectiveNowMs}
        lang={lang}
        onClose={() => setRequestModalProduct(null)}
        onSubmitRequest={handleSubmitCustomerRequest}
      />
    </div>
  );
};
