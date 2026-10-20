import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const base = process.env.SITE_URL || 'http://127.0.0.1:5180';
const errors = [];
await mkdir('qa-output', { recursive: true });
function pass(label) { console.log(`PASS ${label}`); }
async function overflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label);
  pass(label);
}
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base);
  await page.waitForSelector('.store-row');
  assert.equal(await page.locator('.store-row').count(), 5);
  pass('five sample stores load');
  await page.screenshot({ path: 'qa-output/workspace-desktop.png', fullPage: true });
  await page.getByLabel('Find a store').fill('no-match');
  assert.ok(await page.getByRole('heading', { name: 'No matching stores' }).isVisible());
  await page.getByLabel('Find a store').fill('');
  pass('search and empty state');
  await page.getByRole('button', { name: '+ Create store', exact: true }).click();
  await page.getByRole('button', { name: 'Save store', exact: true }).first().click();
  assert.match(await page.getByRole('alert').innerText(), /store name/);
  await page.getByLabel('Store name', { exact: true }).fill('QA Test Shop');
  await page.getByLabel('Store address', { exact: true }).fill('qa-test-shop');
  await page.getByLabel('Tagline', { exact: true }).fill('A catalogue for browser verification.');
  await page.getByLabel('WhatsApp with country code').fill('+12025550123');
  await page.locator('input[type=checkbox]').check();
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await page.getByRole('button', { name: '+ Add product', exact: true }).click();
  await page.getByLabel('Product name', { exact: true }).fill('QA Notebook');
  await page.getByLabel('SKU', { exact: true }).fill('QA-1');
  await page.getByLabel('Price (USD)', { exact: true }).fill('12.50');
  await page.getByLabel('Category', { exact: true }).fill('Stationery');
  await page.getByRole('button', { name: 'Preview changes' }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Order bag (1)' }).click();
  await page.getByRole('button', { name: 'Increase QA Notebook' }).click();
  assert.match(await page.locator('.order-bag h3').innerText(), /25.00/);
  const href = await page.getByRole('link', { name: 'Request order on WhatsApp' }).getAttribute('href');
  assert.match(href, /^https:\/\/wa.me\/12025550123/);
  assert.match(decodeURIComponent(href), /2 x QA Notebook/);
  await page.getByRole('button', { name: 'Decrease QA Notebook' }).click();
  await page.getByRole('button', { name: 'Close bag' }).click();
  pass('cart quantity, currency totals and WhatsApp draft without sending');
  await page.getByRole('button', { name: 'Back to workspace' }).click();
  assert.equal(await page.getByLabel('Store name', { exact: true }).inputValue(), 'QA Test Shop');
  await page.getByRole('button', { name: 'Save store', exact: true }).first().click();
  await page.waitForSelector('.store-row');
  await page.reload(); await page.waitForSelector('.store-row');
  assert.equal(await page.locator('.store-row').count(), 6);
  pass('create store, preview retains edits, save and reload persistence');
  await page.goto(`${base}/?store=qa-test-shop&demo=1`);
  await page.waitForSelector('.storefront');
  assert.equal(await page.locator('.shop-header strong').innerText(), 'QA Test Shop');
  pass('saved tenant query link resolves the correct store');
  await page.goto(`${base}/?store=missing&demo=1`);
  await page.getByRole('heading', { name: 'Store not found' }).waitFor();
  pass('unknown store never falls back to a different tenant');
  await page.goto(base); await page.waitForSelector('.store-row');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.screenshot({ path: 'qa-output/workspace-dark.png', fullPage: true });
  await page.getByRole('button', { name: 'Light theme' }).click();
  pass('light and dark themes');
  for (const width of [1440, 900, 720, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await overflow(page, `${width}px workspace has no horizontal overflow`);
  }
  await page.screenshot({ path: 'qa-output/workspace-mobile.png', fullPage: true });
  await page.locator('.store-row').first().getByRole('button', { name: 'Manage' }).click();
  await overflow(page, '320px editor fits');
  await page.getByRole('button', { name: 'Domain', exact: true }).click();
  await overflow(page, '320px domain guidance fits');
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await overflow(page, '320px product editor fits');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.locator('.store-row').first().getByRole('button', { name: 'Preview', exact: true }).click();
  await overflow(page, '320px storefront fits');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'qa-output/storefront-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Back to workspace' }).click();
  await page.getByRole('button', { name: 'Connection setup', exact: true }).click();
  await page.getByText('View database SQL', { exact: true }).click();
  assert.match(await page.getByLabel('Database SQL').inputValue(), /enable row level security/);
  if (await page.getByRole('button', { name: 'Open connected workspace' }).count()) {
    await page.getByRole('button', { name: 'Open connected workspace' }).click();
    await page.getByRole('heading', { name: 'Sign in to your workspace' }).waitFor();
    await page.getByRole('button', { name: 'Return to local demo' }).click();
    pass('configured Supabase workspace requires sign-in');
  }
  pass('setup instructions and copyable schema are available');
  assert.deepEqual(errors, []); pass('no browser JavaScript errors');
  await context.close();
} finally { await browser.close(); }
