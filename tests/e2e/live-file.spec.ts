import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("opens directly on the portfolio without Figma or Director", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-narrative", /.+/);
  await expect(page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
  await expect(page.getByText("Senior Product Designer", { exact: true }).first()).toBeVisible();
  await expect(page.locator("[data-figma-editor], [data-director-presence], [data-javier-cursor]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test("the Home follows the approved content order and excludes fictional evidence", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main .ordered-home > section[id]").evaluateAll((sections) => sections.map((section) => section.id));
  expect(ids).toEqual(["experience", "work", "about-preview", "testimonials", "lab", "how-i-work"]);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();
  await expect(page.getByText("LogicX / Rules engine")).toBeVisible();
  await expect(page.getByText("Backoffice Design System")).toBeVisible();
  await expect(page.getByRole("heading", { name: "What people I’ve worked with say." })).toBeVisible();
  await expect(page.getByText("Yana Azzopardi")).toBeVisible();
  await expect(page.getByText("Donnalisa Buhagiar")).toBeVisible();
  await expect(page.getByText("Juan José Reina Cruz")).toBeVisible();
  await expect(page.locator('a[href^="/work/"]')).toHaveCount(0);
});

test("video shortcut explains its preview status and closes", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Meet me in 60 seconds" }).click();
  const dialog = page.getByRole("dialog", { name: "Meet me in 60 seconds." });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("there is no playable video yet", { exact: false })).toBeVisible();
  await dialog.getByRole("button", { name: "Close video preview" }).click();
  await expect(dialog).toBeHidden();
});

test("FAQ uses keyboard-accessible disclosures", async ({ page }) => {
  await page.goto("/#how-i-work");
  await page.waitForLoadState("networkidle");
  const first = page.getByText("How do you approach a complex product problem?");
  const second = page.getByText("How do you make trade-offs?");
  await expect(first.locator("xpath=../..")).toHaveAttribute("open", "");
  await second.click();
  await expect(second.locator("xpath=../..")).toHaveAttribute("open", "");
  await expect(page.getByText("I’d rather make a conscious compromise")).toBeVisible();
});

test("mobile navigation reaches the new sections", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile composition contract.");
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator('summary[aria-label="Open navigation"]').click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Lab" }).click();
  await expect(page).toHaveURL(/#lab$/);
  await expect(page.getByRole("heading", { name: "Lab" })).toBeVisible();
});

test("About trajectory uses direct, keyboard-accessible selection without horizontal overflow", async ({ page }) => {
  await page.goto("/about");
  await page.waitForLoadState("networkidle");
  const visualCraft = page.getByRole("tab", { name: /Visual craft/ });
  await visualCraft.click();
  await expect(visualCraft).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("I learned to make information feel intentional.");
  await visualCraft.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Games & 3D/ })).toHaveAttribute("aria-selected", "true");
  const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width);
});

test("the revised Home has no detectable serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""))).toEqual([]);
});
