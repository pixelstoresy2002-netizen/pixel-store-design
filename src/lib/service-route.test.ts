import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeServiceRouteIdentifier } from './service-route.ts';

test('service route identifiers reject missing or malformed values before lookup', () => {
  assert.equal(normalizeServiceRouteIdentifier(undefined), undefined);
  assert.equal(normalizeServiceRouteIdentifier(''), undefined);
  assert.equal(normalizeServiceRouteIdentifier('%E0%A4%A'), undefined);
  assert.equal(normalizeServiceRouteIdentifier('Cooling-Solutions'), 'cooling-solutions');
  assert.equal(normalizeServiceRouteIdentifier('service-cooling'), 'service-cooling');
});
