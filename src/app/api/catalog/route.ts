import { randomUUID } from 'node:crypto';

import { mapProduct } from '@/lib/data/design-adapters';
import { getProducts } from '@/lib/data/catalog-queries';
import type { ProductListQueryInput } from '@/lib/data/query-inputs';
import { publicApiError, publicApiSuccess } from '@/lib/public-api-contract';

export const dynamic = 'force-dynamic';

function positiveInteger(value: string | null) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function dollarsToCents(value: string | null) {
  if (!value?.trim()) return undefined;
  if (!/^\d+(?:\.\d{1,2})?$/u.test(value)) return undefined;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents >= 0 ? cents : undefined;
}

function values(params: URLSearchParams, key: string) {
  return params.getAll(key).filter(Boolean);
}

export function catalogInputFromSearchParams(params: URLSearchParams): ProductListQueryInput {
  const sort = params.get('sort');
  const sortInput =
    sort === 'price-asc' ? { sort: 'priceUsd' as const, order: 'asc' as const }
      : sort === 'price-desc' ? { sort: 'priceUsd' as const, order: 'desc' as const }
        : sort === 'newest' ? { sort: 'createdAt' as const, order: 'desc' as const }
          : { sort: 'featured' as const, order: 'desc' as const };

  return {
    ...sortInput,
    ...(params.get('q') ? { q: params.get('q') ?? undefined } : {}),
    ...(positiveInteger(params.get('page')) ? { page: positiveInteger(params.get('page')) } : {}),
    ...(positiveInteger(params.get('limit')) ? { limit: positiveInteger(params.get('limit')) } : {}),
    ...(params.get('category') ? { categorySlug: params.get('category') ?? undefined } : {}),
    ...(params.get('subcategory') ? { subcategorySlug: params.get('subcategory') ?? undefined } : {}),
    ...(params.get('useCase') ? { useCaseSlug: params.get('useCase') ?? undefined } : {}),
    brandSlugs: values(params, 'brand'),
    conditions: values(params, 'condition').filter(
      (value): value is 'NEW' | 'USED' => value === 'NEW' || value === 'USED',
    ),
    availabilities: values(params, 'availability').filter(
      (value): value is 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST' =>
        value === 'IN_STOCK' || value === 'OUT_OF_STOCK' || value === 'ON_REQUEST',
    ),
    ...(dollarsToCents(params.get('minPriceUsd')) !== undefined
      ? { minPriceUsdCents: dollarsToCents(params.get('minPriceUsd')) }
      : {}),
    ...(dollarsToCents(params.get('maxPriceUsd')) !== undefined
      ? { maxPriceUsdCents: dollarsToCents(params.get('maxPriceUsd')) }
      : {}),
    ...(params.get('bestSeller') === '1' ? { bestSeller: true } : {}),
    ...(params.get('newArrival') === '1' ? { newArrival: true } : {}),
    ...(params.get('onlyOffers') === '1' ? { onlyOffers: true } : {}),
  };
}

function json(body: unknown, requestId: string, status = 200) {
  return Response.json(body, { status, headers: { 'x-request-id': requestId } });
}

export async function GET(request: Request) {
  const requestId = randomUUID();
  try {
    const result = await getProducts(catalogInputFromSearchParams(new URL(request.url).searchParams));
    return json(publicApiSuccess(requestId, {
        items: result.items.map(mapProduct),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      }), requestId);
  } catch {
    return json(publicApiError(requestId, {
      code: 'CATALOG_UNAVAILABLE', message: 'Catalog data is temporarily unavailable.',
    }), requestId, 503);
  }
}
