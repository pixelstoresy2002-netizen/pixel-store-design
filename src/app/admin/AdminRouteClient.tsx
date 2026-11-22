'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { useStore } from '../../context/StoreContext';
import { authClient } from '../../lib/auth-client';

export default function AdminRouteClient() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [signOutError, setSignOutError] = React.useState(false);
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
    isMockMode,
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
        isMockMode={isMockMode}
        services={services}
        settings={settings}
        nowMs={effectiveNowMs}
        onToggleLanguage={handleToggleLanguage}
        onBackToStorefront={() => router.push('/')}
        isSigningOut={isSigningOut}
        signOutError={signOutError}
        onSignOut={() => {
          if (isSigningOut) return;
          setSignOutError(false);
          setIsSigningOut(true);
          void authClient.signOut()
            .then(({ error }) => {
              if (error) {
                setSignOutError(true);
                return;
              }
              router.replace('/admin/login');
              router.refresh();
            })
            .catch(() => setSignOutError(true))
            .finally(() => setIsSigningOut(false));
        }}
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
