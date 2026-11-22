import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAdminAuthorization } from '@/lib/admin-authorization';
import { getAuthEnvironmentStatus } from '@/lib/auth-config';
import { getSafeAdminReturnPath } from '@/lib/admin-login-navigation';

export async function getAdminSession() {
  const { authorization, session } = await getAdminAccess();
  return authorization === 'APPROVED' ? session : null;
}

export async function getAdminAccess() {
  if (!getAuthEnvironmentStatus().configured) {
    return { authorization: 'ANONYMOUS' as const, session: null };
  }

  const { getAuth } = await import('@/lib/auth');
  const session = await getAuth().api.getSession({ headers: await headers() });
  const authorization = getAdminAuthorization({
    email: session?.user?.email,
    expiresAt: session?.session?.expiresAt,
  });

  return { authorization, session };
}

export async function requireAdmin(returnPath = '/admin') {
  const session = await getAdminSession();
  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(getSafeAdminReturnPath(returnPath))}`);
  }
  return session;
}
