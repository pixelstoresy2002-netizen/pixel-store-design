import assert from 'node:assert/strict';
import test from 'node:test';

import { canApplyCatalogResponse } from './catalog-request-state.ts';

test('only the latest non-aborted catalog request can update the UI', () => {
  assert.equal(canApplyCatalogResponse(4, 4, false), true);
  assert.equal(canApplyCatalogResponse(3, 4, false), false);
  assert.equal(canApplyCatalogResponse(4, 4, true), false);
});
