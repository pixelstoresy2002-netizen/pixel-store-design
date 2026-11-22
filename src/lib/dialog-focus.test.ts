import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getDialogTabTargetIndex,
  shouldCloseDialogForKey,
} from './dialog-focus.ts';

test('dialog keyboard helpers close only on Escape and wrap focus at dialog boundaries', () => {
  assert.equal(shouldCloseDialogForKey('Escape'), true);
  assert.equal(shouldCloseDialogForKey('Enter'), false);
  assert.equal(getDialogTabTargetIndex(3, 2, false), 0);
  assert.equal(getDialogTabTargetIndex(3, 0, true), 2);
  assert.equal(getDialogTabTargetIndex(3, 1, false), null);
  assert.equal(getDialogTabTargetIndex(0, -1, false), null);
});
