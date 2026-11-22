import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAdminAuthorization } from '@/lib/admin-authorization';
import { getAuthEnvironmentStatus } from '@/lib/auth-config';

export async function getAdminSession() {
  if (!getAuthEnvironmentStatus().configured) return null;

  const { getAuth } = await import('@/lib/auth');
  const session = await getAuth().api.getSession({ headers: await headers() });
  const authorization = getAdminAuthorization({
    email: session?.user?.email,
    expiresAt: session?.session?.expiresAt,
  });

  return authorization === 'APPROVED' ? session : null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}
