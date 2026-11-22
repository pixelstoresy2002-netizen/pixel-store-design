import 'server-only';

import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

import { createSharedAuthOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

type AuthOptions = {
  disableSignUp?: boolean;
};

export function createAuthOptions(
  { disableSignUp = true }: AuthOptions = {},
) {
  return createSharedAuthOptions(prisma, {
    disableSignUp,
    plugins: [nextCookies()],
  });
}

/** Lazily initializes Better Auth so an unconfigured local checkout fails closed. */
export function getAuth() {
  return betterAuth(createAuthOptions());
}
