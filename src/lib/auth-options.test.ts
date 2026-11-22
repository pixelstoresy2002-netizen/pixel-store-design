import assert from 'node:assert/strict';
import test from 'node:test';

import type { PrismaClient } from '../generated/prisma/client';

import { createSharedAuthOptions } from './auth-options.ts';

test('shared auth options load outside Next and preserve the Admin security policy', () => {
  const original = {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    emails: process.env.ADMIN_EMAILS,
  };
  process.env.BETTER_AUTH_SECRET = 'test-secret-at-least-thirty-two-bytes-long';
  process.env.BETTER_AUTH_URL = 'http://localhost:3000';
  process.env.ADMIN_EMAILS = 'admin@example.com';

  try {
    const options = createSharedAuthOptions({} as PrismaClient, { disableSignUp: false });
    assert.equal(options.emailAndPassword.enabled, true);
    assert.equal(options.emailAndPassword.disableSignUp, false);
    assert.equal(options.emailAndPassword.minPasswordLength, 10);
    assert.equal(options.emailAndPassword.maxPasswordLength, 128);
    assert.equal(options.advanced.cookiePrefix, 'pixel-store-admin');
    assert.equal(options.advanced.useSecureCookies, process.env.NODE_ENV === 'production');
    assert.deepEqual(options.plugins, []);
  } finally {
    if (original.secret === undefined) delete process.env.BETTER_AUTH_SECRET;
    else process.env.BETTER_AUTH_SECRET = original.secret;
    if (original.url === undefined) delete process.env.BETTER_AUTH_URL;
    else process.env.BETTER_AUTH_URL = original.url;
    if (original.emails === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = original.emails;
  }
});
