'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ServicesPage } from '../../../components/storefront/ServicesPage';
import { StorefrontShell } from '../../../components/storefront/StorefrontShell';
import { useStore } from '../../../context/StoreContext';

function ServiceDetailRouteContent() {
  const params = useParams<{ serviceId: string }>();
  const router = useRouter();
  const routeServiceId = decodeURIComponent(params.serviceId ?? 'ALL');

  const {
    lang,
    services,
    settings,
    setSelectedServiceId,
    handleNavigate,
  } = useStore();

  // Resolve by either id (e.g. "service-cooling") or slug (e.g. "cooling-solutions")
  const matchedService = services.find(
    (s) => s.id === routeServiceId || s.slug === routeServiceId
  );
  const resolvedServiceId = matchedService ? matchedService.id : routeServiceId;

  useEffect(() => {
    setSelectedServiceId(resolvedServiceId);
  }, [resolvedServiceId, setSelectedServiceId]);

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
      selectedServiceIdOverride={resolvedServiceId}
    >
      <ServicesPage
        lang={lang}
        services={services}
        selectedServiceId={resolvedServiceId}
        settings={settings}
        onSelectService={handleSelectService}
        onNavigate={handleNavigate}
      />
    </StorefrontShell>
  );
}

export default function ServiceDetailRoutePage() {
  return (
    <Suspense fallback={null}>
      <ServiceDetailRouteContent />
    </Suspense>
  );
}
