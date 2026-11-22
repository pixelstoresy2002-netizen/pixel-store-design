import { notFound } from 'next/navigation';

import { getServiceDetailByRouteIdentifier } from '../../../lib/data/content-queries';
import { normalizeServiceRouteIdentifier } from '../../../lib/service-route';
import { ServiceDetailClient } from './ServiceDetailClient';

export default async function ServiceDetailRoutePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId: routeParam } = await params;
  const identifier = normalizeServiceRouteIdentifier(routeParam);
  if (!identifier) notFound();

  const service = await getServiceDetailByRouteIdentifier(identifier);
  if (!service) notFound();

  return <ServiceDetailClient serviceId={service.id} />;
}
