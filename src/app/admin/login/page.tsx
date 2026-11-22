import { redirect } from 'next/navigation';

import { getAdminAccess } from '@/lib/admin-auth';
import { getSafeAdminReturnPath } from '@/lib/admin-login-navigation';

import AdminLoginForm from './AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const nextPath = getSafeAdminReturnPath((await searchParams).next);
  let isApproved = false;

  try {
    const access = await getAdminAccess();
    isApproved = access.authorization === 'APPROVED';
  } catch {
    // The form remains available so the owner can correct local configuration.
  }
  if (isApproved) redirect(nextPath);

  return <AdminLoginForm nextPath={nextPath} />;
}
