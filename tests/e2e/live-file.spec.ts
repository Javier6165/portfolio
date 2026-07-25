import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

async function skipIntro(page: Page) {
  const skip = page.getByRole("button", { name: "Skip intro" });
  await expect(skip).toBeVisible();
  await skip.click();
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
}

test("the intro keeps identity visible and resolves cleanly when skipped", async ({ page }) => {
  await page.goto("/?narrative=first");

  const hero = page.getByRole("region", { name: "Senior Product Designer" });
  await expect(hero.getByRole("heading", { level: 1, name: "Senior Product Designer" })).toBeVisible();
  await expect(hero.getByText("Javier Ortiz", { exact: true })).toBeVisible();
  await skipIntro(page);

  await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
  await expect(hero.getByRole("img", { name: /Portrait of Javier Ortiz/ })).toBeVisible();
  await expect(page.getByLabel("Portfolio memory preference")).toBeVisible();
  await expect(hero.locator(".portrait--system")).toHaveCSS("opacity", "1");
});

test("the mobile hero keeps the title, portrait and cue in the first viewport", async ({ page, isMobile }) => {
  test.skip(!isMobile, "This is the mobile composition contract.");
  await page.goto("/?narrative=first");
  await skipIntro(page);

  const geometry = await page.evaluate(() => {
    const title = document.querySelector("h1")!.getBoundingClientRect();
    const portrait = document.querySelector('figure[aria-label^="Portrait of Javier Ortiz"]')!.getBoundingClientRect();
    const explore = [...document.querySelectorAll("a")].find((link) => link.textContent?.includes("Explore"))!.getBoundingClientRect();
    return {
      titleBottom: title.bottom,
      portraitTop: portrait.top,
      portraitVisible: Math.min(portrait.bottom, innerHeight) - Math.max(portrait.top, 0),
      exploreTop: explore.top,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(geometry.titleBottom).toBeLessThan(geometry.portraitTop);
  expect(geometry.portraitVisible).toBeGreaterThan(250);
  expect(geometry.exploreTop).toBeGreaterThan(0);
  expect(geometry.exploreTop).toBeLessThan(844);
  expect(geometry.overflow).toBe(0);
});

test("reduced motion resolves intro and all Live File scenes immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeHidden();
  const states = await page.locator("[data-live-scene]").evaluateAll((items) => items.map((item) => item.getAttribute("data-live-state")));
  expect(states.length).toBe(8);
  expect(states.every((state) => state === "reduced")).toBe(true);
  await expect(page.locator("[data-follow-dock]")).toHaveCount(0);
});

test("Light changes colour and photography without changing layout or type", async ({ page, isMobile }) => {
  test.skip(isMobile, "The shared theme geometry is verified once on desktop.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByLabel("Portfolio memory preference")).toBeVisible();

  const selectors = [
    "h1",
    "#snapshot-title",
    "#work-title",
    "#practice-title",
    "#ai-title",
    "#about-title",
    "#testimonials-title",
    ".project-card",
  ];
  const readDesign = () => page.evaluate((targets) => targets.map((selector) => {
    const element = document.querySelector(selector)!;
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      selector,
      top: Math.round((bounds.top + scrollY) * 10) / 10,
      width: Math.round(bounds.width * 10) / 10,
      height: Math.round(bounds.height * 10) / 10,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      borderRadius: style.borderRadius,
    };
  }), selectors);

  const darkDesign = await readDesign();
  const darkCanvas = await page.locator("html").evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole("button", { name: "Use Light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "human");

  expect(await readDesign()).toEqual(darkDesign);
  expect(await page.locator("html").evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(darkCanvas);
  await expect(page.locator(".portrait--system").first()).toHaveCSS("opacity", "0");
  await expect(page.locator(".portrait--human").first()).toHaveCSS("opacity", "1");
});

test("forced WIP and final states expose visibly different section designs", async ({ page, isMobile }) => {
  test.skip(isMobile, "The authored WIP contrast is measured once on desktop.");
  await page.goto("/?narrative=first&live=wip");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", "wip");
  const wipColumns = await scene.getByRole("list", { name: "Javier Ortiz at a glance" }).evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  await expect(scene.getByText("WIP / clarify")).toBeAttached();

  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();
  const finalScene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(finalScene).toHaveAttribute("data-live-state", "settled");
  const finalColumns = await finalScene.getByRole("list", { name: "Javier Ortiz at a glance" }).evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  expect(finalColumns).not.toBe(wipColumns);
});

test("Spotlight waits for the section, locks its position and leaves a readable comment", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop validates the full cursor and Spotlight score.");
  await page.goto("/?narrative=first");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", "observing", { timeout: 1_500 });
  const anchoredScroll = await page.evaluate(() => scrollY);
  await expect(scene).toHaveAttribute("data-live-state", /spotlight-entering|editing|commenting/, { timeout: 2_500 });
  await expect(page.getByText("Following Javier")).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop following" })).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("position", "fixed");

  const comment = scene.getByText("Keep the signal. Lose the résumé.");
  await expect.poll(() => comment.evaluate((item) => Number.parseFloat(getComputedStyle(item.parentElement!).opacity)), { timeout: 3_000 }).toBeGreaterThan(0.2);
  await expect(scene).toHaveAttribute("data-live-state", "settled", { timeout: 5_000 });
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  expect(Math.abs((await page.evaluate(() => scrollY)) - anchoredScroll)).toBeLessThan(3);
});

test("Spotlight gives control back on Escape and Stop disables later auto-follow", async ({ page, isMobile }) => {
  test.skip(isMobile, "The keyboard interruption contract runs once on desktop.");
  await page.goto("/?narrative=first");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", /spotlight-entering|editing|commenting/, { timeout: 3_000 });
  await page.keyboard.press("Escape");
  await expect(scene).toHaveAttribute("data-live-state", "settled");
  await expect(page.getByText("Following Javier")).toHaveCount(0);

  const dockButton = page.getByRole("button", { name: "Auto-follow on · Stop" });
  await expect(dockButton).toBeVisible();
  await dockButton.click();
  await expect(page.locator("[data-follow-dock]")).toHaveCount(0);
  const states = await page.locator("[data-live-scene]").evaluateAll((items) => items.map((item) => item.getAttribute("data-live-state")));
  expect(states.every((state) => state === "settled")).toBe(true);
});

test("Product practice and AI workflow expose complete roving keyboard tabs", async ({ page, isMobile }) => {
  test.skip(isMobile, "The same semantic tab contract reflows unchanged on mobile.");
  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);

  const mapTab = page.getByRole("tab", { name: /Map the system/ });
  await mapTab.focus();
  await mapTab.press("End");
  await expect(page.getByRole("tab", { name: /Prove the behaviour/ })).toBeFocused();
  await expect(page.getByText("Functional prototype + test states")).toBeVisible();

  const frameTab = page.getByRole("tab", { name: /Frame Structure context and risk/ });
  await frameTab.focus();
  await frameTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Explore Create constrained options/ })).toBeFocused();
  await expect(page.getByText("Option set + explicit trade-offs")).toBeVisible();
});

test("the AI Build stage runs a repeatable working simulation", async ({ page, isMobile }) => {
  test.skip(isMobile, "The functional workflow contract runs once; mobile reflow is covered visually.");
  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);
  await page.getByRole("tab", { name: /Build Make the behaviour testable/ }).click();
  await page.getByRole("button", { name: "Run simulation" }).click();
  await expect(page.getByRole("button", { name: "Running…" })).toBeDisabled();
  await expect(page.getByText("Simulation complete")).toBeVisible({ timeout: 2_000 });
  await page.getByRole("button", { name: "Run again" }).click();
  await expect(page.getByRole("button", { name: "Running…" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Run again" })).toBeVisible({ timeout: 2_000 });
});

test("the Reference Ledger is honest, keyboard-operable and never fabricates quotes", async ({ page, isMobile }) => {
  test.skip(isMobile, "The semantic ledger contract runs once; mobile reflow is covered visually.");
  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);
  const firstReference = page.getByRole("tab", { name: /Product partnership/ });
  await firstReference.focus();
  await firstReference.press("End");
  await expect(page.getByRole("tab", { name: /Design leadership/ })).toBeFocused();
  await expect(page.getByText("Placeholder · source required")).toHaveCount(1);
  await expect(page.getByText("No testimonial is published without a source.")).toBeVisible();
  await expect(page.locator("blockquote")).toHaveCount(0);
});

test("consented memory produces deterministic return tiers and can be forgotten", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Storage tiers are viewport-independent and run once.");
  await page.goto("/?narrative=first");
  await skipIntro(page);
  await page.getByRole("button", { name: "Allow" }).click();

  const secondVisit = await context.newPage();
  await secondVisit.goto("/");
  await expect(secondVisit.locator("html")).toHaveAttribute("data-narrative", "return");
  await expect(secondVisit.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 2_500 });
  await expect.poll(() => secondVisit.evaluate(() => JSON.parse(localStorage.getItem("javier-narrative-memory-v1") ?? "null")?.visitCount)).toBe(2);

  const thirdVisit = await context.newPage();
  await thirdVisit.goto("/");
  await expect(thirdVisit.locator("html")).toHaveAttribute("data-narrative", "familiar");
  await expect(thirdVisit.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 2_500 });
});

test("a failed portrait request falls back to the finished semantic hero", async ({ page, isMobile }) => {
  test.skip(isMobile, "The shared asset failure path runs once.");
  await page.route("**/hero-system*", (route) => route.abort());
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
  const states = await page.locator("[data-live-scene]").evaluateAll((items) => items.map((item) => item.getAttribute("data-live-state")));
  expect(states.every((state) => state === "settled")).toBe(true);
  await context.close();
});

test("theme storage failures, mobile navigation and orientation chrome remain robust", async ({ page, isMobile }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);

  await page.getByRole("button", { name: "Use Light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "human");
  await page.evaluate(() => {
    Object.defineProperty(Storage.prototype, "setItem", { configurable: true, value: () => { throw new Error("Blocked"); } });
  });
  await page.getByRole("button", { name: "Use Dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  expect(pageErrors).toEqual([]);

  if (isMobile) {
    await page.locator(".mobile-nav summary").click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work", exact: true }).click();
    await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open", "");
  } else {
    await page.getByRole("link", { name: "Explore" }).click();
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
    await expect(page.getByRole("link", { name: "01 — Snapshot" })).toHaveAttribute("aria-current", "location");
  }
});

test("core routes and both themes have no automatic accessibility violations", async ({ page, isMobile }) => {
  test.skip(isMobile, "Axe is run once; mobile reflow has dedicated coverage.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.getByRole("button", { name: "Use Light mode" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.goto("/work/northstar");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("project depth and playground replay remain available to visitors", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop covers hover/focus depth; mobile keeps the stable touch state.");
  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);
  const card = page.locator(".project-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await expect(card).toBeFocused();
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");

  const replay = page.getByRole("button", { name: "Replay study" });
  await replay.scrollIntoViewIfNeeded();
  await replay.click();
  await expect(page.getByRole("button", { name: "Playing 00:02" })).toBeDisabled();
  await expect(replay).toBeVisible({ timeout: 2_000 });
});
