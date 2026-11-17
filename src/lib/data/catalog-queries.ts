import 'server-only';

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

import {
  normalizeIdentifier,
  normalizeListQuery,
  normalizeProductListQuery,
  type ListQueryInput,
  type ProductListQueryInput,
} from './query-inputs';

const productInclude = {
  category: { include: { parent: true } },
  brand: true,
  useCaseTags: { orderBy: { sortOrder: 'asc' }, take: 20 },
  laptopSpecs: true,
  images: { orderBy: { sortOrder: 'asc' }, take: 20 },
} satisfies Prisma.ProductInclude;

function productOrderBy(
  query: ReturnType<typeof normalizeProductListQuery>,
): Prisma.ProductOrderByWithRelationInput[] {
  const direction = query.order;
  switch (query.sort) {
    case 'priceUsd':
      return [{ priceUsdCents: direction }, { id: 'asc' }];
    case 'name':
      return [{ nameEn: direction }, { id: 'asc' }];
    case 'sku':
      return [{ sku: direction }, { id: 'asc' }];
    case 'createdAt':
      return [{ createdAt: direction }, { id: 'asc' }];
    case 'featured':
      return [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { id: 'asc' }];
    default:
      return [{ updatedAt: direction }, { id: 'asc' }];
  }
}

function productWhere(
  query: ReturnType<typeof normalizeProductListQuery>,
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (query.q) {
    where.OR = [
      { nameAr: { contains: query.q, mode: 'insensitive' } },
      { nameEn: { contains: query.q, mode: 'insensitive' } },
      { sku: { contains: query.q, mode: 'insensitive' } },
      { brand: { name: { contains: query.q, mode: 'insensitive' } } },
    ];
  }
  if (query.subcategorySlug) where.category = { slug: query.subcategorySlug };
  else if (query.categorySlug) {
    where.category = {
      OR: [{ slug: query.categorySlug }, { parent: { is: { slug: query.categorySlug } } }],
    };
  }
  if (query.brandSlug) where.brand = { slug: query.brandSlug };
  if (query.useCaseSlug) where.useCaseTags = { some: { slug: query.useCaseSlug } };
  if (query.condition) where.condition = query.condition;
  if (query.availability) where.stockStatus = query.availability;
  if (query.bestSeller !== undefined) where.isBestSeller = query.bestSeller;
  if (query.newArrival !== undefined) where.isNewArrival = query.newArrival;
  if (query.featured !== undefined) where.isFeatured = query.featured;

  return where;
}

export async function getProducts(input: ProductListQueryInput = {}) {
  const query = normalizeProductListQuery(input);
  const where = productWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: productOrderBy(query),
      skip: query.skip,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getProductDetailBySlug(slug: string) {
  const normalizedSlug = normalizeIdentifier(slug);
  if (!normalizedSlug) return null;

  return prisma.product.findFirst({
    where: { slug: normalizedSlug, isActive: true },
    include: {
      ...productInclude,
      offers: { orderBy: { startsAt: 'desc' }, take: 20 },
    },
  });
}

export async function getCategoryHierarchy(input: ListQueryInput = {}) {
  const query = normalizeListQuery({ ...input, limit: Math.min(input.limit ?? 100, 100) });
  return prisma.category.findMany({
    where: {
      isActive: true,
      ...(query.q
        ? { OR: [{ nameAr: { contains: query.q, mode: 'insensitive' } }, { nameEn: { contains: query.q, mode: 'insensitive' } }] }
        : {}),
    },
    include: {
      parent: true,
      children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 100 },
      useCaseTags: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 20 },
      _count: { select: { products: true } },
    },
    orderBy: [{ sortOrder: query.order }, { slug: 'asc' }],
    skip: query.skip,
    take: query.limit,
  });
}

export async function getBrands(input: ListQueryInput = {}) {
  const query = normalizeListQuery(input);
  return prisma.brand.findMany({
    where: {
      isActive: true,
      ...(query.q ? { OR: [{ name: { contains: query.q, mode: 'insensitive' } }, { slug: { contains: query.q, mode: 'insensitive' } }] } : {}),
    },
    orderBy: [{ sortOrder: query.order }, { slug: 'asc' }],
    skip: query.skip,
    take: query.limit,
  });
}

export async function getUseCaseTags(input: ListQueryInput = {}) {
  const query = normalizeListQuery(input);
  return prisma.useCaseTag.findMany({
    where: {
      isActive: true,
      ...(query.q ? { OR: [{ nameAr: { contains: query.q, mode: 'insensitive' } }, { nameEn: { contains: query.q, mode: 'insensitive' } }] } : {}),
    },
    include: { categories: { where: { isActive: true }, select: { slug: true }, take: 100 } },
    orderBy: [{ sortOrder: query.order }, { slug: 'asc' }],
    skip: query.skip,
    take: query.limit,
  });
}
