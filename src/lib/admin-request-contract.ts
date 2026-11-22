import type { BackendCustomerRequestStatus } from './data/admin-contract';
import { z } from 'zod';

export const ADMIN_REQUEST_PAGE_SIZE = 20;
export const ADMIN_REQUEST_MAX_PAGE_SIZE = 50;

const requestStatuses = new Set<BackendCustomerRequestStatus>([
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const ADMIN_REQUEST_NOTE_MAX_LENGTH = 2_000;

export const adminCustomerRequestUpdateSchema = z
  .object({
    id: z.uuid(),
    // Requiring the version returned by the inbox prevents a stale browser
    // tab from silently replacing a more recent Admin edit.
    expectedUpdatedAt: z.string().datetime({ offset: true }),
    status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    adminNotes: z.string().trim().max(ADMIN_REQUEST_NOTE_MAX_LENGTH).nullable().optional(),
  })
  .strict()
  .refine((input) => input.status !== undefined || input.adminNotes !== undefined, {
    message: 'At least one editable field is required.',
  });

export type AdminCustomerRequestUpdateInput = z.infer<typeof adminCustomerRequestUpdateSchema>;

export type AdminCustomerRequestUpdateData = {
  status?: BackendCustomerRequestStatus;
  adminNotes?: string | null;
  contactedAt?: Date;
  inProgressAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
};

/**
 * Direct transitions among schema-defined statuses are allowed. The first time
 * a lifecycle state is reached is retained; moving away from it never erases
 * that historical timestamp.
 */
export function adminCustomerRequestUpdateData(
  input: AdminCustomerRequestUpdateInput,
  currentStatus: BackendCustomerRequestStatus,
  lifecycleTimestamps: {
    contactedAt?: Date | null;
    inProgressAt?: Date | null;
    completedAt?: Date | null;
    cancelledAt?: Date | null;
  },
  now = new Date(),
): AdminCustomerRequestUpdateData {
  const data: AdminCustomerRequestUpdateData = {};

  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status !== currentStatus) {
      const timestampFields = {
        CONTACTED: 'contactedAt',
        IN_PROGRESS: 'inProgressAt',
        COMPLETED: 'completedAt',
        CANCELLED: 'cancelledAt',
      } as const;
      const timestampField = timestampFields[input.status as keyof typeof timestampFields];
      if (timestampField && !lifecycleTimestamps[timestampField]) data[timestampField] = now;
    }
  }

  if (input.adminNotes !== undefined) {
    data.adminNotes = input.adminNotes || null;
  }

  return data;
}

export interface AdminCustomerRequestListInput {
  page?: number;
  limit?: number;
  status?: BackendCustomerRequestStatus;
  q?: string;
}

export interface NormalizedAdminCustomerRequestListInput {
  page: number;
  limit: number;
  skip: number;
  status?: BackendCustomerRequestStatus;
  q?: string;
}

function positiveInteger(value: number | undefined, fallback: number, maximum: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isSafeInteger(value) || value < 1) {
    return fallback;
  }
  return Math.min(value, maximum);
}

export function normalizeAdminCustomerRequestListInput(
  input: AdminCustomerRequestListInput = {},
): NormalizedAdminCustomerRequestListInput {
  const page = positiveInteger(input.page, 1, 10_000);
  const limit = positiveInteger(input.limit, ADMIN_REQUEST_PAGE_SIZE, ADMIN_REQUEST_MAX_PAGE_SIZE);
  const q = input.q?.trim().replace(/\s+/gu, ' ').slice(0, 120);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    ...(input.status && requestStatuses.has(input.status) ? { status: input.status } : {}),
    ...(q ? { q } : {}),
  };
}

export function adminCustomerRequestListInputFromSearchParams(
  params: URLSearchParams,
): AdminCustomerRequestListInput {
  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));
  const status = params.get('status');

  return {
    ...(Number.isFinite(page) ? { page } : {}),
    ...(Number.isFinite(limit) ? { limit } : {}),
    ...(status && requestStatuses.has(status as BackendCustomerRequestStatus)
      ? { status: status as BackendCustomerRequestStatus }
      : {}),
    ...(params.get('q') ? { q: params.get('q') ?? undefined } : {}),
  };
}

export function adminCustomerRequestPagination(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
