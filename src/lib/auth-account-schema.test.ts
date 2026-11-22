import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const repositoryFile = (...segments: string[]) => resolve(process.cwd(), ...segments);

test('Account uses Better Auth 1.7.12 provider/account identity and removes legacy issuer', () => {
  const schema = readFileSync(repositoryFile('prisma', 'schema.prisma'), 'utf8');
  const accountModel = schema.match(/model Account \{[\s\S]*?\n\}/)?.[0] ?? '';
  const migration = readFileSync(
    repositoryFile('prisma', 'migrations', '20261122000000_remove_legacy_account_issuer', 'migration.sql'),
    'utf8',
  );

  assert.doesNotMatch(accountModel, /\bissuer\b/);
  assert.match(accountModel, /@@unique\(\[providerId, accountId\], map: "account_providerId_accountId_uidx"\)/);
  assert.match(migration, /DROP INDEX "account_issuer_accountId_uidx"/);
  assert.match(migration, /DROP COLUMN "issuer"/);
  assert.match(migration, /CREATE UNIQUE INDEX "account_providerId_accountId_uidx"/);
});
