import 'server-only';

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

import {
  adminCustomerRequestUpdateData,
  type AdminCustomerRequestUpdateInput,
} from '../admin-request-contract';
import {
  mapCustomerRequestForAdmin,
  type AdminCustomerRequestDTO,
} from './admin-contract';

const adminCustomerRequestSelect = {
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
} satisfies Prisma.CustomerRequestSelect;

export type AdminCustomerRequestUpdateResult =
  | { kind: 'updated'; item: AdminCustomerRequestDTO }
  | { kind: 'not-found' }
  | { kind: 'conflict' };

export async function updateAdminCustomerRequest(
  input: AdminCustomerRequestUpdateInput,
): Promise<AdminCustomerRequestUpdateResult> {
  const current = await prisma.customerRequest.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      contactedAt: true,
      inProgressAt: true,
      completedAt: true,
      cancelledAt: true,
    },
  });
  if (!current) return { kind: 'not-found' };
  if (current.updatedAt.toISOString() !== input.expectedUpdatedAt) return { kind: 'conflict' };

  const update = await prisma.customerRequest.updateMany({
    where: { id: input.id, updatedAt: current.updatedAt },
    data: adminCustomerRequestUpdateData(input, current.status, current),
  });
  if (update.count === 0) return { kind: 'conflict' };

  const item = await prisma.customerRequest.findUnique({
    where: { id: input.id },
    select: adminCustomerRequestSelect,
  });
  if (!item) return { kind: 'not-found' };

  return { kind: 'updated', item: mapCustomerRequestForAdmin(item) };
}
