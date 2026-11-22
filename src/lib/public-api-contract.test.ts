import assert from 'node:assert/strict';
import test from 'node:test';

import { publicApiError, publicApiSuccess } from './public-api-contract.ts';

test('public JSON success envelope is readable and request-correlated', () => {
  assert.deepEqual(publicApiSuccess('request-123', { status: 'success' }), {
    requestId: 'request-123',
    data: { status: 'success' },
  });
});

test('public JSON error envelope does not include request payload values', () => {
  assert.deepEqual(publicApiError('request-456', {
    code: 'VALIDATION_ERROR',
    message: 'Request fields are invalid.',
  }), {
    requestId: 'request-456',
    error: { code: 'VALIDATION_ERROR', message: 'Request fields are invalid.' },
  });
});
