import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_ADMIN_RETURN_PATH,
  getSafeAdminReturnPath,
} from './admin-login-navigation.ts';

test('Admin sign-in only returns to local non-login Admin paths', () => {
  assert.equal(getSafeAdminReturnPath('/admin?tab=requests'), '/admin?tab=requests');
  assert.equal(getSafeAdminReturnPath('/admin/requests#new'), '/admin/requests#new');
  assert.equal(getSafeAdminReturnPath('/admin/login'), DEFAULT_ADMIN_RETURN_PATH);
  assert.equal(getSafeAdminReturnPath('https://outside.example/admin'), DEFAULT_ADMIN_RETURN_PATH);
  assert.equal(getSafeAdminReturnPath('//outside.example/admin'), DEFAULT_ADMIN_RETURN_PATH);
  assert.equal(getSafeAdminReturnPath('/store'), DEFAULT_ADMIN_RETURN_PATH);
});
