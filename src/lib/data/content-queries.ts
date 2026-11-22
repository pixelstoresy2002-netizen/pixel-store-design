import 'server-only';

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

import {
  normalizeIdentifier,
  normalizeListQuery,
  normalizeOptionalText,
  type ListQueryInput,
  type OfferTemporalFilter,
} from './query-inputs';

export interface OfferListQueryInput extends ListQueryInput {
  productSlug?: string;
  status?: OfferTemporalFilter;
}

export interface BannerListQueryInput extends ListQueryInput {
  kind?: 'HERO' | 'PROMO';
  activeOnly?: boolean;
}

export interface ServiceListQueryInput extends ListQueryInput {
  featured?: boolean;
}

function offerWhere(input: OfferListQueryInput, now: Date): Prisma.OfferWhereInput {
  const status = input.status;
  const where: Prisma.OfferWhereInput = {};
  const productSlug = normalizeIdentifier(input.productSlug);

  if (productSlug) where.product = { slug: productSlug };
  if (status === 'ACTIVE') Object.assign(where, { isEnabled: true, startsAt: { lte: now }, endsAt: { gt: now } });
  if (status === 'SCHEDULED') Object.assign(where, { isEnabled: true, startsAt: { gt: now } });
  if (status === 'EXPIRED') Object.assign(where, { isEnabled: true, endsAt: { lte: now } });
  if (status === 'DISABLED') where.isEnabled = false;

  return where;
}

export async function getOffers(input: OfferListQueryInput = {}, now = new Date()) {
  const query = normalizeListQuery(input);
  const where = offerWhere(input, now);
  if (query.q) {
    where.OR = [
      { titleAr: { contains: query.q, mode: 'insensitive' } },
      { titleEn: { contains: query.q, mode: 'insensitive' } },
      { product: { nameEn: { contains: query.q, mode: 'insensitive' } } },
    ];
  }

  // Keep PrismaPg reads serial to avoid overlapping queries on its active client.
  const items = await prisma.offer.findMany({
    where,
    include: { product: { include: { images: { orderBy: { sortOrder: 'asc' }, take: 5 } } } },
    orderBy: [{ startsAt: query.order }, { id: 'asc' }],
    skip: query.skip,
    take: query.limit,
  });
  const total = await prisma.offer.count({ where });

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit), now };
}

export async function getHomepageBanners(input: BannerListQueryInput = {}) {
  const query = normalizeListQuery(input);
  const kind = input.kind === 'HERO' || input.kind === 'PROMO' ? input.kind : undefined;
  const where: Prisma.HomepageBannerWhereInput = {
    ...(kind ? { kind } : {}),
    ...(input.activeOnly === true ? { isActive: true } : {}),
  };
  if (query.q) {
    where.OR = [
      { titleAr: { contains: query.q, mode: 'insensitive' } },
      { titleEn: { contains: query.q, mode: 'insensitive' } },
    ];
  }

  return prisma.homepageBanner.findMany({
    where,
    orderBy: [{ sortOrder: query.order }, { id: 'asc' }],
    skip: query.skip,
    take: query.limit,
  });
}

export async function getServices(input: ServiceListQueryInput = {}) {
  const query = normalizeListQuery(input);
  const where: Prisma.StoreServiceWhereInput = {
    isActive: true,
    ...(input.featured === true ? { isFeatured: true } : {}),
  };
  if (query.q) {
    where.OR = [
      { nameAr: { contains: query.q, mode: 'insensitive' } },
      { nameEn: { contains: query.q, mode: 'insensitive' } },
      { slug: { contains: query.q, mode: 'insensitive' } },
    ];
  }

  return prisma.storeService.findMany({
    where,
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 5 } },
    orderBy: [{ sortOrder: query.order }, { slug: 'asc' }],
    skip: query.skip,
    take: query.limit,
  });
}

export async function getServiceDetailBySlug(slug: string) {
  const normalizedSlug = normalizeIdentifier(slug);
  if (!normalizedSlug) return null;

  return prisma.storeService.findFirst({
    where: { slug: normalizedSlug, isActive: true },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 5 } },
  });
}

/** Resolves the public service route, which accepts the established id or slug. */
export async function getServiceDetailByRouteIdentifier(identifier: string) {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) return null;

  return prisma.storeService.findFirst({
    where: {
      isActive: true,
      OR: [{ id: normalizedIdentifier }, { slug: normalizedIdentifier }],
    },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 5 } },
  });
}

/** A site has one authoritative settings row; oldest creation wins until an explicit singleton constraint is added. */
export async function getStoreSettings() {
  return prisma.siteSettings.findFirst({ orderBy: { createdAt: 'asc' } });
}

/** Normalizes a destination label without interpreting an arbitrary external URL as a client route. */
export function normalizeBannerDestinationLabel(value: string | null | undefined) {
  return normalizeOptionalText(value ?? undefined, 160);
}
