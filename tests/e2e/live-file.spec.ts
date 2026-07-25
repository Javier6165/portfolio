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

  const overlap = await page.evaluate(() => {
    const hero = document.querySelector("main section");
    const consent = document.querySelector('[aria-label="Portfolio memory preference"]');
    if (!hero || !consent) return true;
    const heroBounds = hero.getBoundingClientRect();
    const consentBounds = consent.getBoundingClientRect();
    return consentBounds.top < heroBounds.bottom && consentBounds.bottom > heroBounds.top;
  });
  expect(overlap).toBe(false);
});

test("reduced motion resolves directly to the finished portfolio", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  await expect(page.getByRole("heading", { level: 1, name: "Senior Product Designer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeHidden();
});

test("Light mode changes only colour and photography", async ({ page, isMobile }) => {
  test.skip(isMobile, "The shared theme contract is verified once on desktop.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // The memory preference is intentionally revealed once the narrative has
  // settled. Wait for it before taking both geometry snapshots so the test is
  // comparing themes, not two different lifecycle moments.
  await expect(page.getByLabel("Portfolio memory preference")).toBeVisible();

  const selectors = [
    "h1",
    "#experience-title",
    "#work-title",
    ".project-card",
    ".expertise-grid",
    ".ai-practice",
    '[data-live-scene="testimonials-verify"] > div:first-child',
  ];
  const readDesign = () => page.evaluate((targets) => targets.map((selector) => {
    const element = document.querySelector(selector)!;
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      selector,
      top: Math.round((bounds.top + window.scrollY) * 10) / 10,
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
  const lightToggle = page.getByRole("button", { name: "Use Light mode" });
  await expect(lightToggle).toBeVisible();
  // Reduced motion can finish before the small client island has hydrated,
  // especially while the full visual matrix is running in parallel.
  for (let attempt = 0; attempt < 6 && await page.locator("html").getAttribute("data-theme") !== "human"; attempt += 1) {
    await lightToggle.click();
    await page.waitForTimeout(500);
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", "human");
  await page.waitForTimeout(150);

  const lightDesign = await readDesign();
  const lightCanvas = await page.locator("html").evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(lightDesign).toEqual(darkDesign);
  expect(lightCanvas).not.toBe(darkCanvas);
  await expect(page.locator(".portrait--system").first()).toHaveCSS("opacity", "0");
  await expect(page.locator(".portrait--human").first()).toHaveCSS("opacity", "1");
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
  // A real click is the readiness gate after the RSC navigation hydrates the
  // client tab controller under parallel browser load.
  await coreTab.click();
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
  const systemCaseStudy = await new AxeBuilder({ page }).analyze();
  expect(systemCaseStudy.violations).toEqual([]);

  await page.goto("/");
  await page.getByRole("button", { name: "Use Light mode" }).click();
  const humanHome = await new AxeBuilder({ page }).analyze();
  expect(humanHome.violations).toEqual([]);

  await page.goto("/work/northstar");
  const humanCaseStudy = await new AxeBuilder({ page }).analyze();
  expect(humanCaseStudy.violations).toEqual([]);
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
  await context.close();
});

test("theme, mobile navigation and semantic controls remain robust", async ({ page, isMobile }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();

  const heading = page.getByRole("heading", { level: 1, name: "Senior Product Designer" });
  await expect(heading).toHaveText("Senior Product Designer");

  const themeToggle = page.getByRole("button", { name: "Use Light mode" });
  await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
  await themeToggle.click();
  const humanToggle = page.getByRole("button", { name: "Use Dark mode" });
  await expect(humanToggle).toHaveAttribute("aria-pressed", "true");
  await expect(humanToggle).toBeVisible();

  await page.evaluate(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      configurable: true,
      value: () => { throw new Error("Blocked"); },
    });
  });
  await humanToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  expect(pageErrors).toEqual([]);

  await expect(page.getByRole("button", { name: /Review$|Open$|Continue$/ })).toHaveCount(0);

  if (isMobile) {
    const summary = page.locator(".mobile-nav summary");
    await summary.click();
    await expect(page.locator(".mobile-nav")).toHaveAttribute("open", "");
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work" }).click();
    await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open", "");
  }
});

test("the experience chrome preserves orientation throughout Home", async ({ page, isMobile }) => {
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.locator("#work").scrollIntoViewIfNeeded();

  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-page-scrolled", "true");
  await expect.poll(() => page.evaluate(() => Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--page-progress"),
  ))).toBeGreaterThan(0.05);
  await expect(page.locator(".site-header")).toHaveCSS("position", "fixed");

  const rail = page.getByRole("navigation", { name: "On this page" });
  if (isMobile) {
    await expect(rail).toBeHidden();
    await page.locator(".mobile-nav summary").click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  } else {
    await expect(rail).toBeVisible();
    await expect(rail.getByRole("link", { name: "02 — Work" })).toHaveAttribute("aria-current", "location");
  }
});

test("project depth feedback is available from the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mobile cards use the stable touch composition.");
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();

  const card = page.locator(".project-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await expect(card).toBeFocused();
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await expect.poll(() => card.locator(".project-card__layer--back").evaluate(
    (element) => getComputedStyle(element).transform,
  )).not.toBe("none");
});

test("case navigation remains visible below the persistent header", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/northstar");

  const caseIndex = page.locator(".case-index");
  await caseIndex.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 120));
  await expect(page.locator("html")).toHaveAttribute("data-page-scrolled", "true");
  await expect(caseIndex).toBeVisible();

  const geometry = await page.evaluate(() => {
    const header = document.querySelector(".site-header")!.getBoundingClientRect();
    const index = document.querySelector(".case-index")!.getBoundingClientRect();
    return { headerBottom: header.bottom, indexTop: index.top };
  });
  expect(geometry.indexTop).toBeGreaterThanOrEqual(geometry.headerBottom - 1);
});

test("Live File scenes resolve into distinct finished states", async ({ page }) => {
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();

  const profile = page.locator('[data-live-scene="profile-clarify"]');
  await profile.scrollIntoViewIfNeeded();
  await expect(profile).not.toHaveAttribute("data-live-state", "idle");

  const work = page.locator('[data-live-scene="work-frame"]');
  await work.scrollIntoViewIfNeeded();
  await expect(work).not.toHaveAttribute("data-live-state", "idle");
  await expect(work.locator(".project-card__media-label")).toBeVisible();

  const testimonials = page.locator('[data-live-scene="testimonials-verify"]');
  await testimonials.scrollIntoViewIfNeeded();
  await expect(testimonials).not.toHaveAttribute("data-live-state", "idle");
  await expect(page.getByRole("heading", { name: "Trusted in the room. Precise in the work." })).toBeVisible();
  await expect(page.getByText("Placeholder · source required")).toHaveCount(3);

  const scenes = page.locator("[data-live-scene]");
  expect(await scenes.count()).toBeGreaterThanOrEqual(8);
});

test("the Live File director lets the section land before choreography and comments", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch choreography is covered by the shared state test; this checks the desktop cursor score.");
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();

  const profile = page.locator('[data-live-scene="profile-clarify"]');
  for (let step = 0; step < 12 && await profile.getAttribute("data-live-state") === "idle"; step += 1) {
    await page.mouse.wheel(0, 80);
    await page.waitForTimeout(110);
  }

  await expect(profile).toHaveAttribute("data-live-state", "armed");
  const comment = profile.getByText("Keep the signal. Lose the résumé.");
  await expect.poll(() => comment.evaluate((item) => getComputedStyle(item.parentElement!).opacity)).toBe("0");

  await page.waitForTimeout(350);
  await expect(profile).toHaveAttribute("data-live-state", "armed");
  await expect(profile).toHaveAttribute("data-live-state", "playing", { timeout: 700 });
  await expect.poll(
    () => comment.evaluate((item) => Number.parseFloat(getComputedStyle(item.parentElement!).opacity)),
    { timeout: 1_500 },
  ).toBeGreaterThan(0.2);
  await expect(profile).toHaveAttribute("data-live-state", "settled", { timeout: 2_500 });
});

test("Live File cancels a pending intervention when the visitor moves on", async ({ page, isMobile }) => {
  test.skip(isMobile, "The cancellation contract is shared; touch QA is covered by finished states.");
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();

  const profile = page.locator('[data-live-scene="profile-clarify"]');
  for (let step = 0; step < 12 && await profile.getAttribute("data-live-state") === "idle"; step += 1) {
    await page.mouse.wheel(0, 80);
    await page.waitForTimeout(110);
  }
  await expect(profile).toHaveAttribute("data-live-state", "armed");

  await page.locator('[data-live-scene="work-frame"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await expect(profile).toHaveAttribute("data-live-state", "settled");
  const comment = profile.getByText("Keep the signal. Lose the résumé.");
  await expect.poll(() => comment.evaluate((item) => getComputedStyle(item.parentElement!).opacity)).toBe("0");
});

test("the AI cue activates a real, repeatable prototype simulation", async ({ page }) => {
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.locator('[data-live-scene="ai-activate"]').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent("portfolio-live-scene-play", { detail: { id: "ai-activate" } }));
  });

  await expect(page.getByRole("tab", { name: /Turn the decision into behaviour/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Simulation complete")).toBeVisible({ timeout: 2_000 });
  await page.getByRole("button", { name: "Run again" }).click();
  await expect(page.getByRole("button", { name: "Running…" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Run again" })).toBeVisible({ timeout: 2_000 });
});

test("the playground study can be replayed by the visitor", async ({ page }) => {
  await page.goto("/?narrative=first");
  await page.getByRole("button", { name: "Skip intro" }).click();
  const replay = page.getByRole("button", { name: "Replay study" });
  await replay.scrollIntoViewIfNeeded();
  await expect(replay).toBeVisible({ timeout: 2_500 });
  await replay.click();
  await expect(page.getByRole("button", { name: "Playing 00:02" })).toBeDisabled();
  await expect(replay).toBeVisible({ timeout: 2_000 });
});

test("reduced motion settles all Live File scenes without choreography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const scenes = page.locator("[data-live-scene]");
  await expect(scenes.first()).toHaveAttribute("data-live-state", "reduced");
  const states = await scenes.evaluateAll((items) => items.map((item) => item.getAttribute("data-live-state")));
  expect(states.every((state) => state === "reduced")).toBe(true);
});
