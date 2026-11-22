export const DEFAULT_ADMIN_RETURN_PATH = '/admin';

/** Only local Admin paths may be used after a successful sign-in. */
export function getSafeAdminReturnPath(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !value.startsWith('/admin') || value.startsWith('//') || value.includes('\\')) {
    return DEFAULT_ADMIN_RETURN_PATH;
  }

  const target = new URL(value, 'http://pixel-store.local');
  if (target.origin !== 'http://pixel-store.local' || target.pathname === '/admin/login') {
    return DEFAULT_ADMIN_RETURN_PATH;
  }

  return `${target.pathname}${target.search}${target.hash}`;
}
