import type { FilterState } from '@/types/store';

export const CATALOG_PAGE_SIZE = 20;

export interface CatalogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function appendMany(params: URLSearchParams, name: string, values: string[]) {
  for (const value of values) {
    if (value) params.append(name, value);
  }
}

/** Builds the public catalog query used by the interactive storefront. */
export function catalogSearchParams(filters: FilterState, page = 1, limit = CATALOG_PAGE_SIZE) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (filters.searchQuery.trim()) params.set('q', filters.searchQuery.trim());
  if (filters.categoryId !== 'ALL') params.set('category', filters.categoryId);
  if (filters.subcategoryId !== 'ALL') params.set('subcategory', filters.subcategoryId);
  if (filters.useCaseId !== 'ALL') params.set('useCase', filters.useCaseId);
  appendMany(params, 'brand', filters.brandIds);
  appendMany(params, 'condition', filters.conditions);
  appendMany(params, 'availability', filters.availabilities);
  if (filters.minPriceUsd > 0) params.set('minPriceUsd', String(filters.minPriceUsd));
  if (filters.maxPriceUsd < 5000) params.set('maxPriceUsd', String(filters.maxPriceUsd));
  if (filters.onlyBestSellers) params.set('bestSeller', '1');
  if (filters.onlyNewArrivals) params.set('newArrival', '1');
  if (filters.onlyOffers) params.set('onlyOffers', '1');
  if (filters.sortBy !== 'featured') params.set('sort', filters.sortBy);
  return params;
}

export function catalogUrl(filters: FilterState, page = 1, limit = CATALOG_PAGE_SIZE) {
  return `/api/catalog?${catalogSearchParams(filters, page, limit).toString()}`;
}

export function catalogHistoryUrl(filters: FilterState, page = 1) {
  return `/catalog?${catalogSearchParams(filters, page).toString()}`;
}

function list(params: URLSearchParams, name: string) {
  return params.getAll(name).filter(Boolean);
}

/** Converts a readable catalog URL back to the approved client filter model. */
export function filtersFromCatalogSearchParams(
  params: URLSearchParams,
  defaults: FilterState,
): FilterState {
  const sort = params.get('sort');
  const parsedMin = Number(params.get('minPriceUsd'));
  const parsedMax = Number(params.get('maxPriceUsd'));
  return {
    ...defaults,
    searchQuery: params.get('q') ?? '',
    categoryId: params.get('category') ?? 'ALL',
    subcategoryId: params.get('subcategory') ?? 'ALL',
    useCaseId: params.get('useCase') ?? 'ALL',
    brandIds: list(params, 'brand'),
    conditions: list(params, 'condition').filter(
      (value): value is FilterState['conditions'][number] => value === 'NEW' || value === 'USED',
    ),
    availabilities: list(params, 'availability').filter(
      (value): value is FilterState['availabilities'][number] =>
        value === 'IN_STOCK' || value === 'OUT_OF_STOCK' || value === 'ON_REQUEST',
    ),
    minPriceUsd: Number.isFinite(parsedMin) && parsedMin >= 0 ? parsedMin : defaults.minPriceUsd,
    maxPriceUsd: Number.isFinite(parsedMax) && parsedMax >= 0 ? parsedMax : defaults.maxPriceUsd,
    onlyBestSellers: params.get('bestSeller') === '1',
    onlyNewArrivals: params.get('newArrival') === '1',
    onlyOffers: params.get('onlyOffers') === '1',
    sortBy:
      sort === 'price-asc' || sort === 'price-desc' || sort === 'newest' || sort === 'featured'
        ? sort
        : defaults.sortBy,
  };
}

export function pageFromCatalogSearchParams(params: URLSearchParams) {
  const page = Number(params.get('page'));
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}
