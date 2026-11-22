import type { AdminAuthorizationResult } from './admin-authorization';

export function adminApiAuthorizationStatus(
  authorization: AdminAuthorizationResult,
): 401 | 403 | null {
  if (authorization === 'APPROVED') return null;
  return authorization === 'NOT_ALLOWLISTED' ? 403 : 401;
}
