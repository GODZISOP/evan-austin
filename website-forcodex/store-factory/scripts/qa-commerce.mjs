import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const base = process.env.SITE_URL || 'http://127.0.0.1:5180';
await mkdir('qa-output', { recursive: true });
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  console.log('INITIAL', (await page.locator('body').innerText()).slice(0, 400), errors);
  await page.locator('.ca-client-row').first().waitFor();
  assert.equal(await page.locator('.ca-client-row').count(), 3);
  assert.equal(await page.locator('.ca-preview-link').count(), 3);
  await page.screenshot({ path: 'qa-output/commerce-workspace.png', fullPage: true });
  console.log('PASS sample stores and direct previews');

  const preview = await context.newPage();
  preview.on('pageerror', error => errors.push(error.message));
  await preview.goto(`${base}/?store=fashion-demo&demo=1`);
  await preview.locator('.cf-product-card').first().waitFor();
  assert.match(await preview.locator('.cf-wordmark').first().innerText(), /Atelier Studio/);
  await preview.screenshot({ path: 'qa-output/commerce-storefront.png', fullPage: true });
  await preview.locator('.cf-product-card').first().locator('a').first().click();
  await preview.getByRole('button', { name: 'Add to bag' }).click();
  await preview.locator('.cf-bag').click();
  assert.equal(await preview.locator('.cf-cart-line').count(), 1);
  console.log('PASS tenant storefront, product detail and cart');

  await page.locator('.ca-client-row').first().getByRole('button', { name: /Open editor/ }).click();
  await page.locator('.ce-preview-frame .commerce-front').waitFor();
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  assert.ok(await page.getByText('Product catalogue').count());
  console.log('PASS client editor and live draft preview');
  await page.getByRole('button', { name: 'Custom sections', exact: true }).click();
  await page.getByRole('button', { name: 'Add custom section +' }).click();
  await page.locator('.section-builder').waitFor();
  await page.getByRole('button', { name: 'Live preview' }).click();
  assert.ok(await page.locator('.section-builder .custom-section').count());
  console.log('PASS custom section editor creates a live section');
  for (const width of [1440, 900, 390]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), `Editor overflow at ${width}px`);
    await preview.setViewportSize({ width, height: 900 });
    assert.ok(await preview.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), `Store overflow at ${width}px`);
  }
  await page.screenshot({ path: 'qa-output/commerce-editor-mobile.png', fullPage: true });
  console.log('PASS responsive editor and store');
  assert.deepEqual(errors, []);
  console.log('PASS no browser errors');
} finally {
  await browser.close();
}
