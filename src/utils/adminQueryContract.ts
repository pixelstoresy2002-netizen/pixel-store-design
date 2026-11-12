import type {
  AvailabilityStatus,
  Brand,
  Category,
  CustomerRequest,
  Offer,
  OfferTemporalStatus,
  Product,
  ProductCondition,
  UseCaseTag,
} from '../types/store.ts';
import {
  getOfferTemporalStatus,
  isOfferActive,
  resolveProductPricing,
} from './storeLogic.ts';

export type SortOrder = 'asc' | 'desc';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdminProductsSortField =
  | 'updatedAt'
  | 'createdAt'
  | 'priceUsd'
  | 'name'
  | 'sku';

export interface AdminProductsQuery {
  q: string;
  page: number;
  limit: number;
  sort: AdminProductsSortField;
  order: SortOrder;
  categoryId: string; // 'ALL' or category id
  subcategoryId: string; // 'ALL' or subcategory id
  brandId: string; // 'ALL' or brand id
  condition: ProductCondition | 'ALL';
  availability: AvailabilityStatus | 'ALL';
  useCaseId: string; // 'ALL' or use-case id
  bestSeller: 'ALL' | 'true' | 'false';
  newArrival: 'ALL' | 'true' | 'false';
  hasOffer: 'ALL' | 'true' | 'false';
}

export const DEFAULT_ADMIN_PRODUCTS_QUERY: AdminProductsQuery = {
  q: '',
  page: 1,
  limit: 10,
  sort: 'updatedAt',
  order: 'desc',
  categoryId: 'ALL',
  subcategoryId: 'ALL',
  brandId: 'ALL',
  condition: 'ALL',
  availability: 'ALL',
  useCaseId: 'ALL',
  bestSeller: 'ALL',
  newArrival: 'ALL',
  hasOffer: 'ALL',
};

export type AdminOffersSortField =
  | 'endTime'
  | 'startTime'
  | 'offerPriceUsd'
  | 'discountPercent';

export interface AdminOffersQuery {
  q: string;
  page: number;
  limit: number;
  sort: AdminOffersSortField;
  order: SortOrder;
  status: 'ALL' | OfferTemporalStatus;
  productId: string; // 'ALL' or product id
  isExclusive: 'ALL' | 'true' | 'false';
}

export const DEFAULT_ADMIN_OFFERS_QUERY: AdminOffersQuery = {
  q: '',
  page: 1,
  limit: 10,
  sort: 'endTime',
  order: 'asc',
  status: 'ALL',
  productId: 'ALL',
  isExclusive: 'ALL',
};

export type AdminRequestsSortField =
  | 'createdAt'
  | 'priceUsdAtRequest'
  | 'customerName';

export interface AdminRequestsQuery {
  q: string;
  page: number;
  limit: number;
  sort: AdminRequestsSortField;
  order: SortOrder;
  status: 'ALL' | CustomerRequest['status'];
  productId: string; // 'ALL' or product id
}

export const DEFAULT_ADMIN_REQUESTS_QUERY: AdminRequestsQuery = {
  q: '',
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc',
  status: 'ALL',
  productId: 'ALL',
};

export interface AdminSimpleListQuery {
  q: string;
  page: number;
  limit: number;
  sort: 'name' | 'sortOrder' | 'productCount';
  order: SortOrder;
}

export const DEFAULT_ADMIN_SIMPLE_LIST_QUERY: AdminSimpleListQuery = {
  q: '',
  page: 1,
  limit: 12,
  sort: 'sortOrder',
  order: 'asc',
};

function sanitizePositiveInt(val: unknown, fallback: number, max = 100): number {
  const num = Number(val);
  if (!Number.isFinite(num) || num < 1) return fallback;
  return Math.min(Math.floor(num), max);
}

function paginateItems<T>(
  items: T[],
  rawPage: number,
  rawLimit: number
): PaginatedResult<T> {
  const limit = sanitizePositiveInt(rawLimit, 10, 100);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(sanitizePositiveInt(rawPage, 1, 10000), totalPages);
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Parses URLSearchParams (or plain record) into a validated AdminProductsQuery with safe defaults.
 */
export function parseAdminProductsQuery(
  input: URLSearchParams | Record<string, string | undefined>
): AdminProductsQuery {
  const params: Record<string, string | undefined> =
    input instanceof URLSearchParams
      ? Object.fromEntries(input.entries())
      : input;

  const validSorts: AdminProductsSortField[] = [
    'updatedAt',
    'createdAt',
    'priceUsd',
    'name',
    'sku',
  ];
  const sort = validSorts.includes(params.sort as AdminProductsSortField)
    ? (params.sort as AdminProductsSortField)
    : DEFAULT_ADMIN_PRODUCTS_QUERY.sort;

  const order: SortOrder =
    params.order === 'asc' || params.order === 'desc'
      ? params.order
      : DEFAULT_ADMIN_PRODUCTS_QUERY.order;

  const condition: ProductCondition | 'ALL' =
    params.condition === 'NEW' || params.condition === 'USED'
      ? params.condition
      : 'ALL';

  const availability: AvailabilityStatus | 'ALL' =
    params.availability === 'IN_STOCK' ||
    params.availability === 'ON_REQUEST' ||
    params.availability === 'OUT_OF_STOCK'
      ? params.availability
      : 'ALL';

  const parseTriBool = (v?: string): 'ALL' | 'true' | 'false' =>
    v === 'true' || v === 'false' ? v : 'ALL';

  return {
    q: (params.q ?? '').trim(),
    page: sanitizePositiveInt(params.page, 1, 1000),
    limit: sanitizePositiveInt(params.limit, 10, 100),
    sort,
    order,
    categoryId: params.categoryId?.trim() || 'ALL',
    subcategoryId: params.subcategoryId?.trim() || 'ALL',
    brandId: params.brandId?.trim() || 'ALL',
    condition,
    availability,
    useCaseId: params.useCaseId?.trim() || 'ALL',
    bestSeller: parseTriBool(params.bestSeller),
    newArrival: parseTriBool(params.newArrival),
    hasOffer: parseTriBool(params.hasOffer),
  };
}

/**
 * Serializes an AdminProductsQuery into a clean query string (omitting default values for readability).
 */
export function serializeAdminProductsQuery(
  query: AdminProductsQuery,
  includeDefaults = false
): string {
  const sp = new URLSearchParams();
  if (includeDefaults || query.q) sp.set('q', query.q);
  if (includeDefaults || query.page !== 1) sp.set('page', String(query.page));
  if (includeDefaults || query.limit !== 10)
    sp.set('limit', String(query.limit));
  if (includeDefaults || query.sort !== 'updatedAt') sp.set('sort', query.sort);
  if (includeDefaults || query.order !== 'desc') sp.set('order', query.order);
  if (query.categoryId !== 'ALL') sp.set('categoryId', query.categoryId);
  if (query.subcategoryId !== 'ALL')
    sp.set('subcategoryId', query.subcategoryId);
  if (query.brandId !== 'ALL') sp.set('brandId', query.brandId);
  if (query.condition !== 'ALL') sp.set('condition', query.condition);
  if (query.availability !== 'ALL') sp.set('availability', query.availability);
  if (query.useCaseId !== 'ALL') sp.set('useCaseId', query.useCaseId);
  if (query.bestSeller !== 'ALL') sp.set('bestSeller', query.bestSeller);
  if (query.newArrival !== 'ALL') sp.set('newArrival', query.newArrival);
  if (query.hasOffer !== 'ALL') sp.set('hasOffer', query.hasOffer);
  return sp.toString();
}

/**
 * Executes filtering, sorting, and pagination on products matching future GET /api/admin/products semantics.
 */
export function queryAdminProducts(
  products: Product[],
  offers: Offer[],
  query: AdminProductsQuery,
  nowMs: number
): PaginatedResult<Product> {
  const qLower = query.q.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (qLower) {
      const hay = [
        p.id,
        p.sku,
        p.name.ar,
        p.name.en,
        p.description.ar,
        p.description.en,
        p.brandId,
        p.laptopSpecs?.processor ?? '',
        p.laptopSpecs?.memory ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(qLower)) return false;
    }

    if (query.categoryId !== 'ALL' && p.categoryId !== query.categoryId) {
      return false;
    }

    if (
      query.subcategoryId !== 'ALL' &&
      p.subcategoryId !== query.subcategoryId
    ) {
      return false;
    }

    if (query.brandId !== 'ALL' && p.brandId !== query.brandId) {
      return false;
    }

    if (query.condition !== 'ALL' && p.condition !== query.condition) {
      return false;
    }

    if (
      query.availability !== 'ALL' &&
      p.availability !== query.availability
    ) {
      return false;
    }

    if (
      query.useCaseId !== 'ALL' &&
      !p.useCaseIds.includes(query.useCaseId)
    ) {
      return false;
    }

    if (query.bestSeller === 'true' && !p.isBestSeller) return false;
    if (query.bestSeller === 'false' && p.isBestSeller) return false;

    if (query.newArrival === 'true' && !p.isNewArrival) return false;
    if (query.newArrival === 'false' && p.isNewArrival) return false;

    if (query.hasOffer !== 'ALL') {
      const activeOffer = offers.some(
        (o) => o.productId === p.id && isOfferActive(o, nowMs)
      );
      if (query.hasOffer === 'true' && !activeOffer) return false;
      if (query.hasOffer === 'false' && activeOffer) return false;
    }

    return true;
  });

  const dir = query.order === 'asc' ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'priceUsd':
        return (a.priceUsd - b.priceUsd) * dir;
      case 'name':
        return a.name.en.localeCompare(b.name.en) * dir;
      case 'sku':
        return a.sku.localeCompare(b.sku) * dir;
      case 'createdAt':
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          dir
        );
      case 'updatedAt':
      default: {
        const timeA = new Date(a.updatedAt ?? a.createdAt).getTime();
        const timeB = new Date(b.updatedAt ?? b.createdAt).getTime();
        return (timeA - timeB) * dir;
      }
    }
  });

  return paginateItems(sorted, query.page, query.limit);
}

/**
 * Executes filtering, sorting, and pagination on offers matching future GET /api/admin/offers semantics.
 */
export function queryAdminOffers(
  offers: Offer[],
  products: Product[],
  query: AdminOffersQuery,
  nowMs: number,
  usdToSypRate = 12500
): PaginatedResult<Offer> {
  const qLower = query.q.trim().toLowerCase();
  const productMap = new Map(products.map((p) => [p.id, p]));

  const filtered = offers.filter((offer) => {
    const prod = productMap.get(offer.productId);
    const status = getOfferTemporalStatus(offer, nowMs);

    if (query.status !== 'ALL' && status !== query.status) {
      return false;
    }

    if (query.productId !== 'ALL' && offer.productId !== query.productId) {
      return false;
    }

    if (query.isExclusive === 'true' && !offer.isExclusive) return false;
    if (query.isExclusive === 'false' && offer.isExclusive) return false;

    if (qLower) {
      const hay = [
        offer.id,
        offer.title.ar,
        offer.title.en,
        offer.badgeText.ar,
        offer.badgeText.en,
        prod?.name.ar ?? '',
        prod?.name.en ?? '',
        prod?.sku ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(qLower)) return false;
    }

    return true;
  });

  const dir = query.order === 'asc' ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'offerPriceUsd':
        return (a.offerPriceUsd - b.offerPriceUsd) * dir;
      case 'discountPercent': {
        const prodA = productMap.get(a.productId);
        const prodB = productMap.get(b.productId);
        const pctA = prodA
          ? resolveProductPricing(prodA, [a], usdToSypRate, nowMs)
              .discountPercent
          : 0;
        const pctB = prodB
          ? resolveProductPricing(prodB, [b], usdToSypRate, nowMs)
              .discountPercent
          : 0;
        return (pctA - pctB) * dir;
      }
      case 'startTime':
        return (
          (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) *
          dir
        );
      case 'endTime':
      default:
        return (
          (new Date(a.endTime).getTime() - new Date(b.endTime).getTime()) * dir
        );
    }
  });

  return paginateItems(sorted, query.page, query.limit);
}

/**
 * Executes filtering, sorting, and pagination on customer requests matching future GET /api/admin/requests semantics.
 */
export function queryAdminRequests(
  requests: CustomerRequest[],
  query: AdminRequestsQuery
): PaginatedResult<CustomerRequest> {
  const qLower = query.q.trim().toLowerCase();

  const filtered = requests.filter((req) => {
    if (query.status !== 'ALL' && req.status !== query.status) {
      return false;
    }

    if (query.productId !== 'ALL' && req.productId !== query.productId) {
      return false;
    }

    if (qLower) {
      const hay = [
        req.id,
        req.customerName,
        req.phoneNumber,
        req.productName.ar,
        req.productName.en,
        req.productSku,
        req.note,
        req.adminNote ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(qLower)) return false;
    }

    return true;
  });

  const dir = query.order === 'asc' ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'priceUsdAtRequest':
        return (a.priceUsdAtRequest - b.priceUsdAtRequest) * dir;
      case 'customerName':
        return a.customerName.localeCompare(b.customerName) * dir;
      case 'createdAt':
      default:
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          dir
        );
    }
  });

  return paginateItems(sorted, query.page, query.limit);
}

/**
 * Filters and sorts categories or subcategories for Admin management.
 */
export function queryAdminCategories(
  categories: Category[],
  products: Product[],
  q: string,
  parentFilter: 'ALL' | 'ROOT_ONLY' | 'SUB_ONLY' | string = 'ALL'
): Category[] {
  const qLower = q.trim().toLowerCase();
  return categories
    .filter((cat) => {
      if (parentFilter === 'ROOT_ONLY' && cat.parentId) return false;
      if (parentFilter === 'SUB_ONLY' && !cat.parentId) return false;
      if (
        parentFilter !== 'ALL' &&
        parentFilter !== 'ROOT_ONLY' &&
        parentFilter !== 'SUB_ONLY' &&
        cat.parentId !== parentFilter &&
        cat.id !== parentFilter
      ) {
        return false;
      }
      if (qLower) {
        const hay = [
          cat.id,
          cat.slug ?? '',
          cat.name.ar,
          cat.name.en,
          cat.description.ar,
          cat.description.en,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    })
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

/**
 * Filters and sorts brands for Admin management.
 */
export function queryAdminBrands(
  brands: Brand[],
  products: Product[],
  q: string,
  featuredFilter: 'ALL' | 'true' | 'false' = 'ALL'
): Brand[] {
  const qLower = q.trim().toLowerCase();
  return brands
    .filter((b) => {
      if (featuredFilter === 'true' && !b.featured) return false;
      if (featuredFilter === 'false' && b.featured) return false;
      if (qLower) {
        const hay = [b.id, b.name, b.country.ar, b.country.en]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const countA = products.filter((p) => p.brandId === a.id).length;
      const countB = products.filter((p) => p.brandId === b.id).length;
      if (countB !== countA) return countB - countA;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Filters and sorts use-case tags for Admin management.
 */
export function queryAdminUseCaseTags(
  tags: UseCaseTag[],
  q: string
): UseCaseTag[] {
  const qLower = q.trim().toLowerCase();
  return tags
    .filter((tag) => {
      if (qLower) {
        const hay = [
          tag.id,
          tag.name.ar,
          tag.name.en,
          tag.subtitle.ar,
          tag.subtitle.en,
          ...tag.applicableCategories,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    })
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}
