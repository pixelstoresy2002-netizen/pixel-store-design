export const requiredAuthEnvironmentNames = [
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'ADMIN_EMAILS',
] as const;

export type AuthEnvironmentName = (typeof requiredAuthEnvironmentNames)[number];

export type AuthEnvironment = {
  secret: string;
  baseURL: string;
  adminEmails: string;
};

type AuthEnvironmentValues = Record<string, string | undefined>;

function nonempty(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getAuthEnvironmentStatus(
  environment: AuthEnvironmentValues = process.env,
) {
  const missing = requiredAuthEnvironmentNames.filter((name) => !nonempty(environment[name]));
  const baseURL = environment.BETTER_AUTH_URL?.trim();
  const baseURLIsValid = Boolean(baseURL && /^https?:\/\//u.test(baseURL));

  return { missing, baseURLIsValid, configured: missing.length === 0 && baseURLIsValid };
}

export function requireAuthEnvironment(
  environment: AuthEnvironmentValues = process.env,
): AuthEnvironment {
  const status = getAuthEnvironmentStatus(environment);
  if (!status.configured) {
    throw new Error('Better Auth is not configured.');
  }

  return {
    secret: environment.BETTER_AUTH_SECRET!.trim(),
    baseURL: environment.BETTER_AUTH_URL!.trim(),
    adminEmails: environment.ADMIN_EMAILS!.trim(),
  };
}
