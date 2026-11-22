import assert from 'node:assert/strict';
import test from 'node:test';

import { parseAdminEmails } from './admin-allowlist.ts';
import { getAdminAuthorization } from './admin-authorization.ts';
import { getAuthEnvironmentStatus } from './auth-config.ts';

test('auth configuration remains fail-closed until every required value exists', () => {
  assert.deepEqual(getAuthEnvironmentStatus({}), {
    missing: ['BETTER_AUTH_SECRET', 'BETTER_AUTH_URL', 'ADMIN_EMAILS'],
    baseURLIsValid: false,
    configured: false,
  });
  assert.equal(getAuthEnvironmentStatus({
    BETTER_AUTH_SECRET: 'secret',
    BETTER_AUTH_URL: 'https://store.example',
    ADMIN_EMAILS: 'admin@example.com',
  }).configured, true);
});

test('allowlist parsing normalizes email addresses without allowing blanks', () => {
  assert.deepEqual(
    [...parseAdminEmails(' Admin@Example.com, ,second@example.com,admin@example.com')],
    ['admin@example.com', 'second@example.com'],
  );
});

test('admin authorization denies anonymous, expired, and non-allowlisted sessions', () => {
  const original = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = 'approved@example.com';
  const now = new Date('2026-11-21T12:00:00.000Z');

  assert.equal(getAdminAuthorization(null, now), 'ANONYMOUS');
  assert.equal(getAdminAuthorization({ email: 'approved@example.com', expiresAt: '2026-11-21T11:59:59.000Z' }, now), 'EXPIRED');
  assert.equal(getAdminAuthorization({ email: 'other@example.com', expiresAt: '2026-11-21T13:00:00.000Z' }, now), 'NOT_ALLOWLISTED');
  assert.equal(getAdminAuthorization({ email: 'APPROVED@example.com', expiresAt: '2026-11-21T13:00:00.000Z' }, now), 'APPROVED');

  if (original === undefined) delete process.env.ADMIN_EMAILS;
  else process.env.ADMIN_EMAILS = original;
});
