export function normalizeAdminEmail(value: string) {
  return value.trim().toLowerCase();
}

export function parseAdminEmails(value: string | undefined) {
  return new Set(
    (value ?? '')
      .split(',')
      .map(normalizeAdminEmail)
      .filter(Boolean),
  );
}

export function getAdminEmailSet() {
  return parseAdminEmails(process.env.ADMIN_EMAILS);
}

export function isAllowlistedAdminEmail(email: string | null | undefined) {
  return Boolean(email && getAdminEmailSet().has(normalizeAdminEmail(email)));
}
