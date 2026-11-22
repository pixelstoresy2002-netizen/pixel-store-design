import { randomUUID } from 'node:crypto';

import { getAdminAccess } from '@/lib/admin-auth';
import { adminApiAuthorizationStatus } from '@/lib/admin-api-authorization';
import {
  adminCustomerRequestListInputFromSearchParams,
  adminCustomerRequestUpdateSchema,
} from '@/lib/admin-request-contract';
import { updateAdminCustomerRequest } from '@/lib/data/admin-request-mutations';
import { getAdminCustomerRequests } from '@/lib/data/admin-request-queries';
import { publicApiError, publicApiSuccess } from '@/lib/public-api-contract';

export const dynamic = 'force-dynamic';

function json(body: unknown, requestId: string, status = 200) {
  return Response.json(body, { status, headers: { 'x-request-id': requestId } });
}

export async function GET(request: Request) {
  const requestId = randomUUID();
  try {
    const access = await getAdminAccess();
    const authorizationStatus = adminApiAuthorizationStatus(access.authorization);
    if (authorizationStatus) {
      return json(publicApiError(requestId, {
        code: authorizationStatus === 401 ? 'ADMIN_AUTH_REQUIRED' : 'ADMIN_ACCESS_DENIED',
        message: authorizationStatus === 401 ? 'Admin authentication is required.' : 'Admin access is denied.',
      }), requestId, authorizationStatus);
    }

    const result = await getAdminCustomerRequests(
      adminCustomerRequestListInputFromSearchParams(new URL(request.url).searchParams),
    );
    return json(publicApiSuccess(requestId, result), requestId);
  } catch {
    return json(publicApiError(requestId, {
      code: 'ADMIN_REQUESTS_UNAVAILABLE',
      message: 'Customer requests are temporarily unavailable.',
    }), requestId, 503);
  }
}

export async function PATCH(request: Request) {
  const requestId = randomUUID();
  try {
    const access = await getAdminAccess();
    const authorizationStatus = adminApiAuthorizationStatus(access.authorization);
    if (authorizationStatus) {
      return json(publicApiError(requestId, {
        code: authorizationStatus === 401 ? 'ADMIN_AUTH_REQUIRED' : 'ADMIN_ACCESS_DENIED',
        message: authorizationStatus === 401 ? 'Admin authentication is required.' : 'Admin access is denied.',
      }), requestId, authorizationStatus);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json(publicApiError(requestId, {
        code: 'INVALID_JSON',
        message: 'Request body must be valid JSON.',
      }), requestId, 400);
    }

    const parsed = adminCustomerRequestUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return json(publicApiError(requestId, {
        code: 'VALIDATION_ERROR',
        message: 'Request update fields are invalid.',
      }), requestId, 400);
    }

    const result = await updateAdminCustomerRequest(parsed.data);
    if (result.kind === 'not-found') {
      return json(publicApiError(requestId, {
        code: 'REQUEST_NOT_FOUND',
        message: 'Customer request was not found.',
      }), requestId, 404);
    }
    if (result.kind === 'conflict') {
      return json(publicApiError(requestId, {
        code: 'REQUEST_CONFLICT',
        message: 'Customer request changed. Refresh and try again.',
      }), requestId, 409);
    }

    return json(publicApiSuccess(requestId, { item: result.item }), requestId);
  } catch {
    return json(publicApiError(requestId, {
      code: 'ADMIN_REQUEST_UPDATE_UNAVAILABLE',
      message: 'Customer request could not be updated.',
    }), requestId, 503);
  }
}
