'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { useStore } from '../../context/StoreContext';

export default function AdminRoutePage() {
  const router = useRouter();
  const {
    lang,
    themeId,
    fontId,
    products,
    categories,
    brands,
    useCaseTags,
    offers,
    customerRequests,
    services,
    settings,
    effectiveNowMs,
    handleToggleLanguage,
    handleSaveProduct,
    handleDeleteProduct,
    handleToggleBestSeller,
    handleSaveCategory,
    handleSaveBrand,
    handleSaveUseCaseTag,
    handleSaveOffer,
    handleDeleteOffer,
    handleSaveService,
    handleDeleteService,
    handleUpdateRequestStatus,
    setSettings,
  } = useStore();

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
      <AdminDashboard
        lang={lang}
        themeId={themeId}
        fontId={fontId}
        products={products}
        categories={categories}
        brands={brands}
        useCaseTags={useCaseTags}
        offers={offers}
        customerRequests={customerRequests}
        services={services}
        settings={settings}
        nowMs={effectiveNowMs}
        onToggleLanguage={handleToggleLanguage}
        onBackToStorefront={() => router.push('/')}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleBestSeller={handleToggleBestSeller}
        onSaveCategory={handleSaveCategory}
        onSaveBrand={handleSaveBrand}
        onSaveUseCaseTag={handleSaveUseCaseTag}
        onSaveOffer={handleSaveOffer}
        onDeleteOffer={handleDeleteOffer}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onUpdateRequestStatus={handleUpdateRequestStatus}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
