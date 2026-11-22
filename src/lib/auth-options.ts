import { prismaAdapter } from '@better-auth/prisma-adapter';
import type { BetterAuthPlugin } from 'better-auth';

import type { PrismaClient } from '../generated/prisma/client';
import { requireAuthEnvironment } from './auth-config.ts';

export type SharedAuthOptions = {
  disableSignUp?: boolean;
  plugins?: BetterAuthPlugin[];
};

/**
 * Shared by the Next.js server entry point and the interactive Node CLI.
 * Next-only cookie integration is supplied by the caller rather than imported
 * here, so this module remains safe to load through tsx under plain Node.js.
 */
export function createSharedAuthOptions(
  prisma: PrismaClient,
  { disableSignUp = true, plugins = [] }: SharedAuthOptions = {},
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
    plugins,
  };
}
