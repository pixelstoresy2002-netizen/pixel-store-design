import { randomUUID } from 'node:crypto';

import { submitCustomerInterest, type CustomerInterestInput } from '@/lib/customer-interest';
import { publicApiError, publicApiSuccess } from '@/lib/public-api-contract';

export const dynamic = 'force-dynamic';

function json(body: unknown, requestId: string, status = 200) {
  return Response.json(body, { status, headers: { 'x-request-id': requestId } });
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  let input: CustomerInterestInput;
  try {
    input = await request.json() as CustomerInterestInput;
  } catch {
    return json(publicApiError(requestId, { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' }), requestId, 400);
  }

  const result = await submitCustomerInterest(input);
  if (result.status === 'success') {
    return json(publicApiSuccess(requestId, { status: 'success' }), requestId, 201);
  }

  const response =
    result.status === 'validation-error'
      ? { status: 400, code: 'VALIDATION_ERROR', message: 'Request fields are invalid.' }
      : result.status === 'duplicate'
        ? { status: 409, code: 'DUPLICATE_REQUEST', message: 'A matching request was received recently.' }
        : result.status === 'unavailable'
          ? { status: 404, code: 'PRODUCT_UNAVAILABLE', message: 'This product is not available.' }
          : { status: 503, code: 'REQUEST_UNAVAILABLE', message: 'Request submission is temporarily unavailable.' };
  return json(publicApiError(requestId, { code: response.code, message: response.message }), requestId, response.status);
}
