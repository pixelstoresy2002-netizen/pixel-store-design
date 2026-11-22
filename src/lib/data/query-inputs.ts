export type SortOrder = 'asc' | 'desc';

export type ProductListSort =
  | 'updatedAt'
  | 'createdAt'
  | 'priceUsd'
  | 'name'
  | 'sku'
  | 'featured';

export type OfferTemporalFilter = 'ACTIVE' | 'SCHEDULED' | 'DISABLED' | 'EXPIRED';

export interface ProductListQueryInput {
  q?: string;
  page?: number;
  limit?: number;
  sort?: ProductListSort;
  order?: SortOrder;
  categorySlug?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  brandSlugs?: string[];
  useCaseSlug?: string;
  condition?: 'NEW' | 'USED';
  conditions?: Array<'NEW' | 'USED'>;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST';
  availabilities?: Array<'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST'>;
  minPriceUsdCents?: number;
  maxPriceUsdCents?: number;
  onlyOffers?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
}

export interface NormalizedProductListQuery {
  q?: string;
  page: number;
  limit: number;
  skip: number;
  sort: ProductListSort;
  order: SortOrder;
  categorySlug?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  brandSlugs: string[];
  useCaseSlug?: string;
  condition?: 'NEW' | 'USED';
  conditions: Array<'NEW' | 'USED'>;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST';
  availabilities: Array<'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST'>;
  minPriceUsdCents?: number;
  maxPriceUsdCents?: number;
  onlyOffers?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
}

export interface ListQueryInput {
  page?: number;
  limit?: number;
  q?: string;
  order?: SortOrder;
}

export interface NormalizedListQuery {
  page: number;
  limit: number;
  skip: number;
  q?: string;
  order: SortOrder;
}

const MAX_PAGE = 10_000;
const MAX_LIMIT = 100;
const PRODUCT_SORTS = new Set<ProductListSort>([
  'updatedAt',
  'createdAt',
  'priceUsd',
  'name',
  'sku',
  'featured',
]);
const CONDITIONS = new Set(['NEW', 'USED']);
const AVAILABILITIES = new Set(['IN_STOCK', 'OUT_OF_STOCK', 'ON_REQUEST']);

function normalizedIdentifiers(values: string[] | undefined) {
  return [...new Set((values ?? []).map(normalizeIdentifier).filter((value): value is string => Boolean(value)))];
}

function normalizedValues<T extends string>(values: T[] | undefined, allowed: Set<string>) {
  return [...new Set((values ?? []).filter((value): value is T => allowed.has(value)))];
}

function nonnegativeSafeInteger(value: number | undefined) {
  return Number.isSafeInteger(value) && (value as number) >= 0 ? value : undefined;
}

function boundedInteger(value: number | undefined, fallback: number, maximum: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.trunc(value as number), 1), maximum);
}

export function normalizeOptionalText(value: string | undefined, maximum = 120) {
  const normalized = value?.trim().replace(/\s+/gu, ' ');
  return normalized ? normalized.slice(0, maximum) : undefined;
}

export function normalizeIdentifier(value: string | undefined) {
  const normalized = normalizeOptionalText(value, 120)?.toLocaleLowerCase('en-US');
  return normalized?.replace(/[^a-z0-9-]/gu, '') || undefined;
}

export function normalizeListQuery(input: ListQueryInput = {}): NormalizedListQuery {
  const page = boundedInteger(input.page, 1, MAX_PAGE);
  const limit = boundedInteger(input.limit, 24, MAX_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    q: normalizeOptionalText(input.q),
    order: input.order === 'asc' ? 'asc' : 'desc',
  };
}

export function normalizeProductListQuery(
  input: ProductListQueryInput = {},
): NormalizedProductListQuery {
  const base = normalizeListQuery(input);
  const sort = PRODUCT_SORTS.has(input.sort as ProductListSort)
    ? (input.sort as ProductListSort)
    : 'updatedAt';
  const condition = CONDITIONS.has(input.condition ?? '') ? input.condition : undefined;
  const availability = AVAILABILITIES.has(input.availability ?? '')
    ? input.availability
    : undefined;
  const brandSlugs = normalizedIdentifiers(input.brandSlugs);
  const conditions = normalizedValues(input.conditions, CONDITIONS);
  const availabilities = normalizedValues(input.availabilities, AVAILABILITIES);
  const minPriceUsdCents = nonnegativeSafeInteger(input.minPriceUsdCents);
  const maxPriceUsdCents = nonnegativeSafeInteger(input.maxPriceUsdCents);

  return {
    ...base,
    sort,
    categorySlug: normalizeIdentifier(input.categorySlug),
    subcategorySlug: normalizeIdentifier(input.subcategorySlug),
    brandSlug: normalizeIdentifier(input.brandSlug),
    brandSlugs,
    useCaseSlug: normalizeIdentifier(input.useCaseSlug),
    condition,
    conditions,
    availability,
    availabilities,
    ...(minPriceUsdCents !== undefined ? { minPriceUsdCents } : {}),
    ...(maxPriceUsdCents !== undefined ? { maxPriceUsdCents } : {}),
    onlyOffers: typeof input.onlyOffers === 'boolean' ? input.onlyOffers : undefined,
    bestSeller: typeof input.bestSeller === 'boolean' ? input.bestSeller : undefined,
    newArrival: typeof input.newArrival === 'boolean' ? input.newArrival : undefined,
    featured: typeof input.featured === 'boolean' ? input.featured : undefined,
  };
}
