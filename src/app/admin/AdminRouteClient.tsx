'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { useStore } from '../../context/StoreContext';

export default function AdminRouteClient() {
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
    heroSlides,
    promoBanners,
    customerRequests,
    services,
    settings,
    effectiveNowMs,
    handleToggleLanguage,
    handleSaveProduct,
    handleDeleteProduct,
    handleToggleBestSeller,
    handleSaveCategory,
    handleDeleteCategory,
    handleSaveBrand,
    handleDeleteBrand,
    handleSaveUseCaseTag,
    handleDeleteUseCaseTag,
    handleSaveOffer,
    handleDeleteOffer,
    handleSaveHeroSlide,
    handleReorderHeroSlides,
    handleDeleteHeroSlide,
    handleSavePromoBanner,
    handleReorderPromoBanners,
    handleSaveService,
    handleDeleteService,
    handleUpdateRequestStatus,
    handleDeleteCustomerRequest,
    setSettings,
    handleResetDemoData,
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
        heroSlides={heroSlides}
        promoBanners={promoBanners}
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
        onDeleteCategory={handleDeleteCategory}
        onSaveBrand={handleSaveBrand}
        onDeleteBrand={handleDeleteBrand}
        onSaveUseCaseTag={handleSaveUseCaseTag}
        onDeleteUseCaseTag={handleDeleteUseCaseTag}
        onSaveOffer={handleSaveOffer}
        onDeleteOffer={handleDeleteOffer}
        onSaveHeroSlide={handleSaveHeroSlide}
        onReorderHeroSlides={handleReorderHeroSlides}
        onDeleteHeroSlide={handleDeleteHeroSlide}
        onSavePromoBanner={handleSavePromoBanner}
        onReorderPromoBanners={handleReorderPromoBanners}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onUpdateRequestStatus={handleUpdateRequestStatus}
        onDeleteCustomerRequest={handleDeleteCustomerRequest}
        onUpdateSettings={setSettings}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
