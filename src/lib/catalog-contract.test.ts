import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CATALOG_PAGE_SIZE,
  catalogSearchParams,
  filtersFromCatalogSearchParams,
  pageFromCatalogSearchParams,
} from './catalog-contract.ts';

const defaults = {
  searchQuery: '',
  categoryId: 'ALL' as const,
  subcategoryId: 'ALL' as const,
  useCaseId: 'ALL' as const,
  brandIds: [],
  minPriceUsd: 0,
  maxPriceUsd: 5000,
  conditions: [],
  availabilities: [],
  onlyOffers: false,
  onlyBestSellers: false,
  onlyNewArrivals: false,
  sortBy: 'featured' as const,
};

test('catalog JSON contract serializes readable filter values and pagination', () => {
  const params = catalogSearchParams({
    ...defaults,
    searchQuery: 'ROG G16',
    categoryId: 'laptops',
    brandIds: ['asus', 'lenovo'],
    conditions: ['NEW'],
    sortBy: 'price-asc',
  }, 2, CATALOG_PAGE_SIZE);

  assert.equal(params.get('q'), 'ROG G16');
  assert.deepEqual(params.getAll('brand'), ['asus', 'lenovo']);
  assert.deepEqual(params.getAll('condition'), ['NEW']);
  assert.equal(params.get('sort'), 'price-asc');
  assert.equal(params.get('page'), '2');
});

test('catalog URL state round-trips supported filters and rejects unsupported values', () => {
  const params = new URLSearchParams(
    'page=3&q=ThinkPad&category=laptops&brand=lenovo&condition=USED&condition=INVALID&availability=IN_STOCK&sort=newest',
  );
  const filters = filtersFromCatalogSearchParams(params, defaults);

  assert.equal(pageFromCatalogSearchParams(params), 3);
  assert.equal(filters.searchQuery, 'ThinkPad');
  assert.equal(filters.categoryId, 'laptops');
  assert.deepEqual(filters.brandIds, ['lenovo']);
  assert.deepEqual(filters.conditions, ['USED']);
  assert.deepEqual(filters.availabilities, ['IN_STOCK']);
  assert.equal(filters.sortBy, 'newest');
});
