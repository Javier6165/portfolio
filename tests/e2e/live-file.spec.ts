import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the optional opening is skippable and the portfolio keeps native scroll", async ({ page, isMobile }) => {
  await page.goto("/?studio=reset");
  await expect(page.locator("html")).not.toHaveAttribute("data-narrative", /.+/);
  if (!isMobile) {
    await expect(page.locator("div[data-studio-intro]")).toBeVisible();
    await expect(page.getByText("Portrait pending")).toBeVisible();
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expect(page.locator("div[data-studio-intro]")).toBeHidden();
    await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-running", "true");
  } else {
    await expect(page.locator("div[data-studio-intro]")).toBeHidden();
  }
  await expect(page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
  await expect(page.getByText("Lead Product Designer", { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /follow/i })).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  if (!isMobile) await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-running", "true");
});

test("Figma opening places the portrait, types the note, and hands off to the hero edit", async ({ page, isMobile }) => {
  test.skip(isMobile, "The studio layer is deliberately desktop-only.");
  await page.goto("/?studio=reset");
  await expect(page.locator("div[data-studio-intro]")).toHaveAttribute("data-placed", "true", { timeout: 7_000 });
  const note = page.locator("div[data-studio-intro] p").filter({ hasText: "You caught me working" });
  await expect(note).toBeVisible({ timeout: 8_000 });
  await expect(page.locator("div[data-studio-intro]")).toBeHidden({ timeout: 12_000 });
  await expect(page.locator("[data-studio-headline]")).toHaveAttribute("data-studio-editing", "true", { timeout: 4_000 });
  await expect(page.locator("[data-studio-headline]")).not.toHaveAttribute("data-studio-editing", "true", { timeout: 12_000 });
  await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-running", "true");
  await expect(page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
});

test("reduced motion bypasses the studio layer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?studio=reset");
  await expect(page.locator("div[data-studio-intro]")).toBeHidden();
  await expect(page.locator("[data-director-presence]")).not.toHaveAttribute("data-running", "true");
});

test("future page-entry motion can suspend Director without changing scroll", async ({ page, isMobile }) => {
  test.skip(isMobile, "Director is desktop-only.");
  await page.goto("/?studio=off");
  const presence = page.locator("[data-director-presence]");
  await expect(presence).toHaveAttribute("data-running", "true");
  await page.evaluate(() => { document.documentElement.dataset.siteEntrance = "active"; });
  await expect(presence).toHaveAttribute("data-suspended", "true");
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.evaluate(() => { delete document.documentElement.dataset.siteEntrance; });
  await expect(presence).toHaveAttribute("data-suspended", "false");
});

test("the Home follows the approved content order and excludes fictional evidence", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main .ordered-home > section[id]:not([hidden])").evaluateAll((sections) => sections.map((section) => section.id));
  expect(ids).toEqual(["experience", "work", "about-preview", "testimonials", "how-i-work"]);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();
  await expect(page.getByText("LogicX / Rules engine")).toBeVisible();
  await expect(page.getByText("Backoffice Design System")).toBeVisible();
  await expect(page.getByText("Casino Customizer")).toBeVisible();
  await expect(page.getByRole("heading", { name: "What people I’ve worked with say." })).toBeVisible();
  await expect(page.getByText("Yana Azzopardi")).toBeVisible();
  await expect(page.getByText("Donnalisa Buhagiar")).toBeVisible();
  await expect(page.getByText("Juan José Reina Cruz")).toBeVisible();
  await expect(page.locator('main a[href^="/work/"]')).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Lab" })).toBeHidden();
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
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav.getByRole("link", { name: "Lab" })).toHaveCount(0);
  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();
});

test("each selected work entry opens a readable case study", async ({ page }) => {
  for (const [slug, heading] of [
    ["logicx", "Making powerful automation easier to understand."],
    ["backoffice-design-system", "Building one product language across a complex ecosystem."],
    ["casino-customizer", "From sales pitch to live prototype."],
  ]) {
    await page.goto(`/work/${slug}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width);
  }
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
