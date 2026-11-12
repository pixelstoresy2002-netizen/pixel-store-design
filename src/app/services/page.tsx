'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServicesPage } from '../../components/storefront/ServicesPage';
import { StorefrontShell } from '../../components/storefront/StorefrontShell';
import { useStore } from '../../context/StoreContext';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceParam = searchParams.get('service') ?? 'ALL';

  const {
    lang,
    services,
    settings,
    setSelectedServiceId,
    handleNavigate,
  } = useStore();

  useEffect(() => {
    setSelectedServiceId(serviceParam);
  }, [serviceParam, setSelectedServiceId]);

  const effectiveServiceId =
    serviceParam !== 'ALL' ? serviceParam : 'ALL';

  const handleSelectService = (srvId: string | 'ALL') => {
    setSelectedServiceId(srvId);
    if (srvId === 'ALL') {
      router.push('/services');
    } else {
      router.push(`/services/${encodeURIComponent(srvId)}`);
    }
  };

  return (
    <StorefrontShell
      currentView="services"
      activeCategoryId="ALL"
      selectedServiceIdOverride={effectiveServiceId}
    >
      <ServicesPage
        lang={lang}
        services={services}
        selectedServiceId={effectiveServiceId}
        settings={settings}
        onSelectService={handleSelectService}
        onNavigate={handleNavigate}
      />
    </StorefrontShell>
  );
}

export default function ServicesRoutePage() {
  return (
    <Suspense fallback={null}>
      <ServicesContent />
    </Suspense>
  );
}
