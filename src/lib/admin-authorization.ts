import { isAllowlistedAdminEmail } from './admin-allowlist.ts';

export type AdminAuthorizationResult =
  | 'ANONYMOUS'
  | 'EXPIRED'
  | 'NOT_ALLOWLISTED'
  | 'APPROVED';

export interface AdminSessionIdentity {
  email?: string | null;
  expiresAt?: Date | string | null;
}

export function getAdminAuthorization(
  session: AdminSessionIdentity | null | undefined,
  now = new Date(),
): AdminAuthorizationResult {
  if (!session?.email) return 'ANONYMOUS';
  if (session.expiresAt && new Date(session.expiresAt).getTime() <= now.getTime()) {
    return 'EXPIRED';
  }
  return isAllowlistedAdminEmail(session.email) ? 'APPROVED' : 'NOT_ALLOWLISTED';
}
