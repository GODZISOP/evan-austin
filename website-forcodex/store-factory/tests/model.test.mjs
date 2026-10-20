import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTenant, validateStore, validSlug, orderSummary, safeImage } from '../src/model.js';
import { demoStores } from '../src/data.js';

test('local query selects the requested tenant', () => {
  assert.deepEqual(resolveTenant({ hostname: 'localhost', search: '?store=abeer' }), { kind: 'slug', value: 'abeer' });
});
test('custom domains cannot be overridden with a query', () => {
  assert.deepEqual(resolveTenant({ hostname: 'client.com', search: '?store=other', platformDomain: 'agency.com' }), { kind: 'domain', value: 'client.com' });
});
test('subdomain belongs only to the configured platform', () => {
  assert.deepEqual(resolveTenant({ hostname: 'abeer.agency.com', search: '?store=other', platformDomain: 'agency.com' }), { kind: 'slug', value: 'abeer' });
  assert.deepEqual(resolveTenant({ hostname: 'abeer.agency.com.evil.com', platformDomain: 'agency.com' }), { kind: 'domain', value: 'abeer.agency.com.evil.com' });
});
test('only the exact deployment hostname is a platform host', () => {
  assert.deepEqual(resolveTenant({ hostname: 'factory.vercel.app', deploymentHost: 'factory.vercel.app' }), { kind: 'platform' });
  assert.deepEqual(resolveTenant({ hostname: 'client.vercel.app', deploymentHost: 'factory.vercel.app' }), { kind: 'domain', value: 'client.vercel.app' });
});
test('invalid and reserved tenants fail closed', () => {
  for (const slug of ['../x', '', 'www', 'admin', 'a.b', '-abc', 'a'.repeat(64)]) assert.equal(validSlug(slug), false);
  assert.deepEqual(resolveTenant({ hostname: 'localhost', search: '?store=' }), { kind: 'invalid' });
});
test('all example records pass validation', () => {
  for (const store of demoStores()) assert.equal(validateStore(store).name, store.name);
});
test('unsafe image protocols and duplicate SKUs are rejected', () => {
  assert.equal(safeImage('javascript:alert(1)'), false);
  assert.equal(safeImage('https://user:pass@example.com/image.png'), false);
  const store = demoStores()[0];
  store.products[1].sku = store.products[0].sku;
  assert.throws(() => validateStore(store), /different SKU/);
});
test('negative and empty prices are rejected', () => {
  for (const price of [-1, '', Infinity]) {
    const store = demoStores()[0]; store.products[0].price = price;
    assert.throws(() => validateStore(store), /prices/);
  }
});
test('cart totals use minor units and ignore other store products', () => {
  const store = demoStores()[0];
  store.products[0].price = 0.1; store.products[1].price = 0.2;
  const order = orderSummary(store, { [store.products[0].id]: 1, [store.products[1].id]: 1, 'another-store-product': 50 });
  assert.equal(order.total, 0.3); assert.equal(order.lines.length, 2);
  assert.match(order.message, /Please confirm availability/);
});
test('cart rejects invalid quantities', () => {
  const store = demoStores()[0];
  for (const quantity of [-1, 100, 1.5, '2']) assert.equal(orderSummary(store, { [store.products[0].id]: quantity }).total, 0);
});
