import 'server-only';

import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

import { requireAuthEnvironment } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

type AuthOptions = {
  disableSignUp?: boolean;
  includeNextCookies?: boolean;
};

export function createAuthOptions(
  { disableSignUp = true, includeNextCookies = true }: AuthOptions = {},
) {
  const environment = requireAuthEnvironment();
  return {
    secret: environment.secret,
    baseURL: environment.baseURL,
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      disableSignUp,
      minPasswordLength: 10,
      maxPasswordLength: 128,
    },
    advanced: {
      cookiePrefix: 'pixel-store-admin',
      useSecureCookies: process.env.NODE_ENV === 'production',
    },
    plugins: includeNextCookies ? [nextCookies()] : [],
  };
}

/** Lazily initializes Better Auth so an unconfigured local checkout fails closed. */
export function getAuth() {
  return betterAuth(createAuthOptions());
}
