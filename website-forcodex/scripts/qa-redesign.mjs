import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:5174/";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox"] });
const failures = [];
const errors = [];
await mkdir("qa-output", { recursive: true });

function check(condition, label) {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}`);
  if (!condition) failures.push(label);
}

async function noOverflow(page, label) {
  const width = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(width <= 1, `${label} horizontal overflow (${width}px)`);
}

try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`${width}: ${error.message}`));
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    check(response?.status() === 200, `${width}px page loads`);
    check((await page.locator("h1").innerText()).includes("Ideas made"), `${width}px headline renders`);
    check(await page.locator(".hero-image-wrap img").evaluate((img) => img.complete && img.naturalWidth > 0), `${width}px generated hero image loads`);
    await noOverflow(page, `${width}px`);

    if (width === 1440) {
      await page.locator("#services").scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: /Web experiences/ }).click();
      await page.waitForTimeout(450);
      check(await page.getByRole("button", { name: /Web experiences/ }).getAttribute("aria-pressed") === "true", "service selector changes state");
      check((await page.locator(".service-detail-copy").innerText()).includes("Websites with a clear story"), "service selector changes content");
      for (const selector of [".work-heading", ".work-feature", ".work-secondary", ".studio-statement", ".contact-copy"]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
      }
      check(await page.locator(".work-image-frame img").evaluate((img) => img.complete && img.naturalWidth > 0), "generated work image loads");
      check(Number(await page.locator(".work-secondary").evaluate((node) => getComputedStyle(node).opacity)) > 0.95, "second work study reveals on scroll");
      await page.screenshot({ path: "qa-output/redesign-final-desktop.png", fullPage: true });
      await page.getByRole("button", { name: "Create inquiry draft" }).click();
      check((await page.locator(".form-status").first().innerText()).includes("Add your name"), "empty form shows guidance");
      await page.locator('input[name="name"]').fill("Alex");
      await page.locator('input[name="email"]').fill("alex@example.com");
      await page.locator('textarea[name="project"]').fill("An editorial website concept.");
      await page.getByRole("button", { name: "Create inquiry draft" }).click();
      check(await page.locator("#inquiry-draft").isVisible(), "valid form creates draft");
      await page.getByRole("button", { name: "Copy draft" }).click();
      check((await page.locator(".draft-result .form-status").innerText()).length > 0, "copy draft reports result");
      await page.getByRole("link", { name: "Work", exact: true }).click();
      check(new URL(page.url()).hash === "#work", "desktop navigation reaches work");
    }

    if (width === 390) {
      const menu = page.locator("#menu-toggle");
      await menu.click();
      check(await menu.getAttribute("aria-expanded") === "true", "mobile menu opens");
      await page.keyboard.press("Escape");
      check(await menu.getAttribute("aria-expanded") === "false", "Escape closes mobile menu");
      await menu.click();
      await page.getByRole("link", { name: "Studio", exact: true }).click();
      check(new URL(page.url()).hash === "#studio", "mobile navigation reaches studio");
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "qa-output/redesign-final-mobile.png", fullPage: true });
    }
    await context.close();
  }

  const reduced = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const reducedPage = await reduced.newPage();
  reducedPage.on("pageerror", (error) => errors.push(`reduced: ${error.message}`));
  await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
  check(await reducedPage.locator("h1").isVisible(), "reduced-motion headline visible");
  await noOverflow(reducedPage, "reduced-motion");
  await reduced.close();
  check(errors.length === 0, `no browser exceptions${errors.length ? `: ${errors.join("; ")}` : ""}`);
} finally {
  await browser.close();
}

if (failures.length) process.exitCode = 1;
