'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ServicesPage } from '../../../components/storefront/ServicesPage';
import { StorefrontShell } from '../../../components/storefront/StorefrontShell';
import { useStore } from '../../../context/StoreContext';

export function ServiceDetailClient({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const {
    lang,
    services,
    settings,
    setSelectedServiceId,
    handleNavigate,
  } = useStore();

  useEffect(() => {
    setSelectedServiceId(serviceId);
  }, [serviceId, setSelectedServiceId]);

  const handleSelectService = (nextServiceId: string | 'ALL') => {
    setSelectedServiceId(nextServiceId);
    router.push(
      nextServiceId === 'ALL'
        ? '/services'
        : `/services/${encodeURIComponent(nextServiceId)}`,
    );
  };

  return (
    <StorefrontShell
      currentView="services"
      activeCategoryId="ALL"
      selectedServiceIdOverride={serviceId}
    >
      <ServicesPage
        lang={lang}
        services={services}
        selectedServiceId={serviceId}
        settings={settings}
        onSelectService={handleSelectService}
        onNavigate={handleNavigate}
      />
    </StorefrontShell>
  );
}
