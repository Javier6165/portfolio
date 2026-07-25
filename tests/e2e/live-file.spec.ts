import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test("the intro never hides identity and can be skipped", async ({ page }) => {
  await page.goto("/?narrative=first");

  const hero = page.getByRole("region", { name: "Senior Product Designer" });
  await expect(hero.getByRole("heading", { level: 1, name: "Senior Product Designer" })).toBeVisible();
  await expect(hero.getByText("Javier Ortiz", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeVisible();

  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
  await expect(page.getByLabel("Portfolio memory preference")).toBeVisible();
});

test("reduced motion resolves directly to the finished portfolio", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  await expect(page.getByRole("heading", { level: 1, name: "Senior Product Designer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeHidden();
});

test("AI practice and case evidence expose roving keyboard tabs", async ({ page, isMobile }) => {
  test.skip(isMobile, "The same tab contract is covered on desktop; mobile QA focuses on reflow.");
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByRole("button", { name: "No thanks" }).click();

  const frameTab = page.getByRole("tab", { name: /Find the expensive uncertainty/ });
  await frameTab.focus();
  await frameTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Generate options with constraints/ })).toBeFocused();
  await expect(page.getByText("Option space / constrained")).toBeVisible();

  await page.goto("/work/northstar");
  const coreTab = page.getByRole("tab", { name: /Core/ });
  await coreTab.focus();
  await coreTab.press("End");
  await expect(page.getByRole("tab", { name: /Expressive/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "evidence-tab-system-behaviour-expressive");
});

test("core pages have no automatically detectable accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const home = await new AxeBuilder({ page }).analyze();
  expect(home.violations).toEqual([]);

  await page.goto("/work/northstar");
  const caseStudy = await new AxeBuilder({ page }).analyze();
  expect(caseStudy.violations).toEqual([]);
});

test("consented memory produces deterministic return tiers", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Storage tiers are viewport-independent and run once on desktop.");
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByRole("button", { name: "Allow" }).click();

  const secondVisit = await context.newPage();
  await secondVisit.goto("/");
  await expect(secondVisit.locator("html")).toHaveAttribute("data-narrative", "return");
  await expect(secondVisit.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 2_500 });
  await expect.poll(() => secondVisit.evaluate(() => JSON.parse(
    window.localStorage.getItem("javier-narrative-memory-v1") ?? "null",
  )?.visitCount)).toBe(2);

  const thirdVisit = await context.newPage();
  await thirdVisit.goto("/");
  await expect(thirdVisit.locator("html")).toHaveAttribute("data-narrative", "familiar");
  await expect(thirdVisit.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 2_500 });
});

test("a failed portrait request falls back to the finished semantic hero", async ({ page, isMobile }) => {
  test.skip(isMobile, "The asset failure path is shared by both compositions.");
  await page.route("**/hero-system.jpg", (route) => route.abort());
  await page.goto("/?narrative=first");

  await expect(page.locator("[data-phase]")).toHaveAttribute("data-phase", "failed", { timeout: 2_500 });
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  await expect(page.getByRole("heading", { level: 1, name: "Senior Product Designer" })).toBeVisible();
});

test("the portfolio remains useful without JavaScript", async ({ browser, isMobile }) => {
  test.skip(isMobile, "The no-JavaScript contract is viewport-independent.");
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Senior Product Designer" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Atlas/ })).toBeVisible();
  await context.close();
});
