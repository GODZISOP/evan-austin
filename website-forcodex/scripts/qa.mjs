import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});

const output = "qa-output";
const baseUrl = process.env.SITE_URL || "http://127.0.0.1:5173/";
await mkdir(output, { recursive: true });
const failures = [];
const consoleErrors = [];

function check(condition, label) {
  if (!condition) failures.push(label);
  console.log(`${condition ? "PASS" : "FAIL"} ${label}`);
}

async function checkOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  check(dimensions.page <= dimensions.viewport + 1, `${label}: no horizontal overflow (${dimensions.page}/${dimensions.viewport})`);
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  check(response?.status() === 200, "desktop page responds 200");
  check(await page.locator("h1").innerText() === "Make the idea\nlegible.", "hero headline renders");
  check(await page.locator(".hero-photo img").evaluate((img) => img.complete && img.naturalWidth > 0), "generated hero image loads");
  await checkOverflow(page, "desktop");
  await page.screenshot({ path: `${output}/desktop-hero.png` });

  const story = await page.locator(".story-scroll").boundingBox();
  if (story) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), story.y + story.height * 0.34);
    await page.waitForTimeout(900);
    check(await page.locator(".story-image-wrap img").evaluate((img) => img.complete && img.naturalWidth > 0), "generated scroll image loads");
    await page.screenshot({ path: `${output}/desktop-story.png` });
    const opacities = await page.locator(".story-chapter").evaluateAll((nodes) => nodes.map((node) => Number(getComputedStyle(node).opacity)));
    check(opacities[1] > 0.95 && opacities[0] < 0.05 && opacities[2] < 0.05, `middle chapter has a clean handoff (${opacities.map((x) => x.toFixed(2)).join(", ")})`);
  } else {
    check(false, "desktop scroll chapter exists");
  }

  await page.getByRole("link", { name: "Studies", exact: true }).click();
  check(new URL(page.url()).hash === "#studies", "Studies navigation reaches its section");
  await page.getByRole("link", { name: "Discuss a similar project" }).first().click();
  check(new URL(page.url()).hash === "#contact", "study link reaches contact");
  await page.getByRole("button", { name: "Create inquiry draft" }).click();
  check((await page.locator(".form-status").first().innerText()).includes("Add your name"), "empty form shows validation");
  await page.locator('input[name="name"]').fill("Alex");
  await page.locator('input[name="email"]').fill("alex@example.com");
  await page.locator('textarea[name="message"]').fill("I am planning a new editorial site.");
  await page.getByRole("button", { name: "Create inquiry draft" }).click();
  check(await page.locator("#inquiry-draft").isVisible(), "valid form creates a visible inquiry draft");
  await page.getByRole("button", { name: "Copy draft" }).click();
  check((await page.locator(".draft-result .form-status").innerText()).length > 0, "copy action reports its result");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.waitForTimeout(300);
  check(await page.locator("html").getAttribute("data-theme") === "dark", "dark theme activates");
  await page.screenshot({ path: `${output}/desktop-dark-contact.png` });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  check(await page.locator("html").getAttribute("data-theme") === "light", "light theme returns");

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  const mobilePage = await mobile.newPage();
  mobilePage.on("pageerror", (error) => consoleErrors.push(error.message));
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1200);
  await mobilePage.screenshot({ path: `${output}/mobile-hero.png` });
  await checkOverflow(mobilePage, "mobile");
  await mobilePage.getByRole("button", { name: "Menu" }).click();
  check(await mobilePage.getByRole("button", { name: "Close" }).getAttribute("aria-expanded") === "true", "mobile menu opens");
  await mobilePage.getByRole("link", { name: "Approach", exact: true }).click();
  check(new URL(mobilePage.url()).hash === "#approach", "mobile nav reaches approach and closes");
  check(await mobilePage.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded") === "false", "mobile menu closes after navigation");
  check(await mobilePage.locator(".story-static-step").count() === 3, "mobile story uses readable chapters");
  await checkOverflow(mobilePage, "mobile after navigation");
  await mobilePage.locator(".story-static").scrollIntoViewIfNeeded();
  await mobilePage.screenshot({ path: `${output}/mobile-story.png` });

  const reduced = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
  check(await reducedPage.locator(".story-static-step").count() === 3, "reduced motion uses stacked chapters");
  await checkOverflow(reducedPage, "reduced motion");
  check(consoleErrors.length === 0, `no browser errors${consoleErrors.length ? `: ${consoleErrors.join(" | ")}` : ""}`);

  await desktop.close();
  await mobile.close();
  await reduced.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`QA failed: ${failures.join("; ")}`);
  process.exitCode = 1;
}
