import assert from 'node:assert/strict';
import test from 'node:test';

import { adminApiAuthorizationStatus } from './admin-api-authorization.ts';
import {
  adminCustomerRequestUpdateData,
  adminCustomerRequestUpdateSchema,
  adminCustomerRequestListInputFromSearchParams,
  adminCustomerRequestPagination,
  normalizeAdminCustomerRequestListInput,
} from './admin-request-contract.ts';
import { mapCustomerRequestForAdmin } from './data/admin-contract.ts';

test('admin inbox normalizes pagination, filtering, and empty result metadata', () => {
  const input = normalizeAdminCustomerRequestListInput(
    adminCustomerRequestListInputFromSearchParams(new URLSearchParams('page=0&limit=1000&status=NEW&q=%20Ada%20')),
  );
  assert.deepEqual(input, { page: 1, limit: 50, skip: 0, status: 'NEW', q: 'Ada' });
  assert.deepEqual(adminCustomerRequestPagination(0, input.page, input.limit), {
    page: 1, limit: 50, total: 0, totalPages: 1,
  });
});

test('admin inbox serializes historical BigInt snapshots without recalculation', () => {
  const item = mapCustomerRequestForAdmin({
    id: 'request', customerName: 'Ada', customerPhone: '+963900000000', note: 'Need details', adminNotes: null,
    productId: 'product', productNameArSnapshot: 'منتج', productNameEnSnapshot: 'Product', productSkuSnapshot: 'SKU',
    usdPriceCentsSnapshot: 123_45, usdRateSnapshot: 12_000, sypPriceSnapshot: 1_481_400n,
    status: 'NEW', createdAt: new Date('2026-11-22T10:00:00.000Z'), updatedAt: new Date('2026-11-22T10:00:00.000Z'),
  });
  assert.equal(item.sypPriceSnapshot, '1481400');
  assert.equal(item.usdPriceCentsSnapshot, 12345);
});

test('admin API authorization is fail-closed for anonymous and non-allowlisted users', () => {
  assert.equal(adminApiAuthorizationStatus('ANONYMOUS'), 401);
  assert.equal(adminApiAuthorizationStatus('EXPIRED'), 401);
  assert.equal(adminApiAuthorizationStatus('NOT_ALLOWLISTED'), 403);
  assert.equal(adminApiAuthorizationStatus('APPROVED'), null);
});

test('admin request mutations validate editable fields and retain immutable snapshots', () => {
  const id = '9bc1a813-652a-42c1-a452-22313d416e7d';
  const expectedUpdatedAt = '2026-11-22T10:00:00.000Z';
  const statusInput = adminCustomerRequestUpdateSchema.parse({
    id,
    expectedUpdatedAt,
    status: 'CONTACTED',
  });
  const contactedAt = new Date('2026-11-22T11:00:00.000Z');
  assert.deepEqual(
    adminCustomerRequestUpdateData(statusInput, 'NEW', {}, contactedAt),
    { status: 'CONTACTED', contactedAt },
  );

  const clearNoteInput = adminCustomerRequestUpdateSchema.parse({
    id,
    expectedUpdatedAt,
    adminNotes: '   ',
  });
  assert.deepEqual(
    adminCustomerRequestUpdateData(clearNoteInput, 'CONTACTED', { contactedAt }, contactedAt),
    { adminNotes: null },
  );

  assert.equal(adminCustomerRequestUpdateSchema.safeParse({
    id,
    expectedUpdatedAt,
    usdPriceCentsSnapshot: 1,
  }).success, false);
  assert.equal(adminCustomerRequestUpdateSchema.safeParse({
    id,
    expectedUpdatedAt,
  }).success, false);
});
