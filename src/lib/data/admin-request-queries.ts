import 'server-only';

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

import {
  adminCustomerRequestPagination,
  normalizeAdminCustomerRequestListInput,
  type AdminCustomerRequestListInput,
} from '../admin-request-contract';
import {
  mapCustomerRequestForAdmin,
  type AdminCustomerRequestDTO,
} from './admin-contract';

export async function getAdminCustomerRequests(
  input: AdminCustomerRequestListInput = {},
): Promise<{
  items: AdminCustomerRequestDTO[];
  pagination: ReturnType<typeof adminCustomerRequestPagination>;
}> {
  const query = normalizeAdminCustomerRequestListInput(input);
  const where: Prisma.CustomerRequestWhereInput = {
    ...(query.status ? { status: query.status } : {}),
  };

  if (query.q) {
    where.OR = [
      { customerName: { contains: query.q, mode: 'insensitive' } },
      { customerPhone: { contains: query.q, mode: 'insensitive' } },
      { productNameArSnapshot: { contains: query.q, mode: 'insensitive' } },
      { productNameEnSnapshot: { contains: query.q, mode: 'insensitive' } },
      { productSkuSnapshot: { contains: query.q, mode: 'insensitive' } },
    ];
  }

  const total = await prisma.customerRequest.count({ where });
  const initialPagination = adminCustomerRequestPagination(total, query.page, query.limit);
  const page = Math.min(query.page, initialPagination.totalPages);

  // Snapshot fields preserve request-time identity and prices, so no Product join
  // (and therefore no N+1 lookup) is needed for the Admin inbox.
  const records = await prisma.customerRequest.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    skip: (page - 1) * query.limit,
    take: query.limit,
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      note: true,
      adminNotes: true,
      productId: true,
      productNameArSnapshot: true,
      productNameEnSnapshot: true,
      productSkuSnapshot: true,
      usdPriceCentsSnapshot: true,
      usdRateSnapshot: true,
      sypPriceSnapshot: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return {
    items: records.map(mapCustomerRequestForAdmin),
    pagination: { ...initialPagination, page },
  };
}
