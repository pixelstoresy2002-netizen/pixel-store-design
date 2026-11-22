import { requireAdmin } from '@/lib/admin-auth';

import AdminRouteClient from './AdminRouteClient';

export const dynamic = 'force-dynamic';

export default async function AdminRoutePage() {
  await requireAdmin();
  return <AdminRouteClient />;
}
