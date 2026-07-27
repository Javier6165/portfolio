import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

async function skipIntro(page: Page) {
  const skip = page.getByRole("button", { name: "Skip opening" });
  if (await skip.isVisible()) {
    await skip.click();
  } else {
    const url = new URL(page.url());
    url.searchParams.set("narrative", "return");
    await page.goto(url.toString());
    await page.getByRole("button", { name: "Skip opening" }).click();
  }
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
}

test("the first visit explains the working file, enters Present and cannot be skipped", async ({ page, isMobile }) => {
  test.setTimeout(25_000);
  await page.goto("/?narrative=first");

  const hero = page.getByRole("region", { name: "Senior Product Designer" });
  await expect(page.getByText("Opening working file")).toBeVisible();
  await expect(page.getByText("Javier Ortiz / Portfolio", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Senior Product Designer", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip opening" })).toBeHidden();
  await page.mouse.wheel(0, 900);
  await page.keyboard.press("PageDown");
  await expect(page.locator("html")).not.toHaveAttribute("data-narrative", "complete");
  await expect(page.getByText("Oh. Hi. You caught me at “one last tweak”.")).toBeVisible({ timeout: 3_000 });
  await expect(page.getByText("Right. Let’s make this less awkward — full screen.")).toBeVisible({ timeout: 4_500 });
  await expect(page.getByText("Present", { exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 16_000 });

  await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
  await expect(hero.getByRole("img", { name: /Portrait of Javier Ortiz/ })).toBeVisible();
  await expect(page.getByLabel("Portfolio memory preference")).toHaveCount(0);
  await expect(hero.locator("img.portrait")).toHaveCount(1);
  await expect(hero.locator("img.portrait")).toHaveAttribute("src", /hero-system\.jpg/);

  // The opening may own scroll only while its timeline is active. Its global
  // gesture listeners remain mounted with the hero, so verify that the handoff
  // really gives the document back to the visitor.
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  const initialScroll = await page.evaluate(() => scrollY);
  if (isMobile) {
    const touchStillBlocked = await page.evaluate(() => {
      const event = new TouchEvent("touchmove", { bubbles: true, cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(touchStillBlocked).toBe(false);
  } else {
    await page.mouse.wheel(0, 180);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialScroll + 40);
  }
});

test("the mobile hero keeps the title, portrait and cue in the first viewport", async ({ page, isMobile }) => {
  test.skip(!isMobile, "This is the mobile composition contract.");
  await page.goto("/?narrative=first");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 16_000 });

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
  await expect(page.getByRole("button", { name: "Skip opening" })).toBeHidden();
  const states = await page.locator("[data-live-scene]").evaluateAll((items) => items.map((item) => item.getAttribute("data-live-state")));
  expect(states.length).toBe(8);
  expect(states.every((state) => state === "reduced")).toBe(true);
  await expect(page.locator("[data-follow-dock]")).toHaveCount(0);
});

test("the portfolio exposes one intentional Dark appearance", async ({ page, isMobile }) => {
  test.skip(isMobile, "The appearance contract is verified once on desktop.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  await expect(page.getByLabel("Portfolio memory preference")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /mode/i })).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.locator("html")).toHaveCSS("background-color", "rgb(13, 14, 16)");
  expect(await page.locator("html").evaluate((element) => element.outerHTML)).not.toMatch(/hero-human|about-human|javier-theme|theme-toggle/);
});

test("forced WIP and final states expose visibly different section designs", async ({ page, isMobile }) => {
  test.skip(isMobile, "The authored WIP contrast is measured once on desktop.");
  await page.goto("/?narrative=first&live=wip");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", "wip");
  const wipColumns = await scene.getByRole("list", { name: "Javier Ortiz at a glance" }).evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  await expect(scene.getByText("Draft · too much résumé")).toBeAttached();

  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();
  const finalScene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(finalScene).toHaveAttribute("data-live-state", "settled");
  const finalColumns = await finalScene.getByRole("list", { name: "Javier Ortiz at a glance" }).evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  expect(finalColumns).not.toBe(wipColumns);
});

test("the guided first pass reframes, locks and completes a readable edit", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop validates the full cursor and Spotlight score.");
  test.setTimeout(35_000);
  await page.goto("/?narrative=first");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", /observing|spotlight-entering|editing|commenting/, { timeout: 2_500 });
  await expect(page.getByText(/LIVE FILE · EDIT 01 \/ 01/)).toBeVisible();
  await expect(page.getByText("Following Javier")).toBeVisible();
  const snapshotTitleTop = await page.getByRole("heading", { level: 2, name: /I turn complex product logic/ }).evaluate((element) => element.getBoundingClientRect().top);
  expect(snapshotTitleTop).toBeGreaterThan(72);
  const comment = page.locator('[data-spotlight-context][data-context-kind="comment"]');
  await expect(comment.getByText("This is becoming a résumé. Nobody asked.")).toBeVisible();
  await expect(comment.getByText("Javier · now")).toBeVisible();
  await expect(page.getByRole("button", { name: /Skip this edit|Stop following/ })).toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("position", "fixed");
  const anchoredScroll = await page.locator("body").evaluate((element) => Math.abs(Number.parseFloat(getComputedStyle(element).top)));

  await page.keyboard.press("Escape");
  await page.mouse.wheel(0, 900);
  await expect(page.locator("[data-spotlight-active]")).toBeVisible();
  await expect(page.getByText("Scroll resumes when this edit is complete")).toBeVisible();

  // Scrollbar removal may emit a resize event in real browsers. It is not a
  // visitor resize and must not collapse Spotlight into a single-frame flash.
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await expect(page.getByText(/LIVE FILE · EDIT 01 \/ 01/)).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("position", "fixed");

  await expect(comment.getByText("This is becoming a résumé. Nobody asked.")).toBeAttached({ timeout: 5_000 });
  const contextGeometry = await comment.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { top: bounds.top, right: bounds.right, bottom: bounds.bottom, left: bounds.left, width: innerWidth, height: innerHeight };
  });
  expect(contextGeometry.top).toBeGreaterThanOrEqual(0);
  expect(contextGeometry.left).toBeGreaterThanOrEqual(0);
  expect(contextGeometry.right).toBeLessThanOrEqual(contextGeometry.width);
  expect(contextGeometry.bottom).toBeLessThanOrEqual(contextGeometry.height);
  await expect(scene).toHaveAttribute("data-live-state", "settled", { timeout: 15_000 });
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  expect(Math.abs((await page.evaluate(() => scrollY)) - anchoredScroll)).toBeLessThan(3);

  // Restoring the captured position is an internal operation, not evidence
  // that the visitor reached the next chapter. Control must remain released
  // until a fresh gesture actually advances the document.
  await page.waitForTimeout(650);
  await expect(page.locator("[data-spotlight-active]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  const releasedScroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(releasedScroll + 40);

  // After the one required chapter, following becomes an explicit visitor
  // choice and continues with Work in document order.
  await page.getByRole("button", { name: "Follow Javier" }).first().click();
  await expect(page.getByText(/LIVE FILE · EDIT 02 \/ 08/)).toBeVisible({ timeout: 5_000 });
  await page.getByRole("button", { name: /Stop following/ }).first().click();
  await expect(page.locator("[data-spotlight-active]")).toHaveCount(0);
});

test("free navigation never launches lower scenes and Follow Javier remains cancellable", async ({ page, isMobile }) => {
  test.skip(isMobile, "The desktop pointer contract runs once; mobile keeps free navigation.");
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "granted");
    localStorage.setItem("javier-narrative-memory-v1", JSON.stringify({ schema: 1, visitCount: 1, seenCueIds: [], lastVisitAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86_400_000).toISOString() }));
  });
  await page.goto("/?narrative=return");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await page.waitForTimeout(1_200);
  await expect(scene).toHaveAttribute("data-live-state", "settled");
  await expect(page.locator("[data-spotlight-active]")).toHaveCount(0);

  await page.getByRole("button", { name: "Follow Javier" }).click();
  await expect(scene).toHaveAttribute("data-live-state", /wip|observing|spotlight-entering|editing|commenting/, { timeout: 3_000 });
  await expect(page.getByRole("button", { name: /Stop following/ })).toBeVisible({ timeout: 5_000 });
  await page.getByRole("button", { name: /Stop following/ }).click();
  await expect(page.locator("[data-spotlight-active]")).toHaveCount(0);
  const states = await page.locator("[data-live-scene]").evaluateAll((items) => items.map((item) => item.getAttribute("data-live-state")));
  expect(states.every((state) => state === "settled")).toBe(true);
});

test("Javier remains present through non-blocking ambient micro-adjustments", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch intentionally uses presence without a synthetic cursor.");
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "granted");
    localStorage.setItem("javier-narrative-memory-v1", JSON.stringify({ schema: 1, visitCount: 1, seenCueIds: [], lastVisitAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86_400_000).toISOString() }));
  });
  await page.goto("/?narrative=return");
  await skipIntro(page);

  const dock = page.locator("[data-follow-dock]");
  await expect(dock).toBeVisible();
  await expect(dock.locator("span").filter({ hasText: "JAVIER" })).toBeAttached();
  await expect(dock).toHaveAttribute("data-presence-status", "editing", { timeout: 6_000 });
  await expect(page.locator("[data-javier-cursor]")).not.toHaveCSS("opacity", "0");
  await expect(page.locator("[data-ambient-note]")).toContainText(/Two pixels right|No\. One pixel left|Perfect\. Probably/);
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 40);
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
  test.setTimeout(75_000);
  await page.goto("/?narrative=first");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();
  await expect(page.locator('[data-live-scene="snapshot-clarify"]')).toHaveAttribute("data-live-state", "settled", { timeout: 16_000 });
  await expect(page.getByLabel("Portfolio memory preference")).toBeVisible({ timeout: 6_000 });
  await page.getByRole("button", { name: "Allow" }).click();

  const secondVisit = await context.newPage();
  await secondVisit.goto("/");
  await expect(secondVisit.locator("html")).toHaveAttribute("data-narrative", "return");
  await expect(secondVisit.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 2_500 });
  await expect.poll(() => secondVisit.evaluate(() => JSON.parse(localStorage.getItem("javier-narrative-memory-v1") ?? "null")?.visitCount)).toBe(2);

  const thirdVisit = await context.newPage();
  await thirdVisit.goto("/");
  await expect(thirdVisit.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 2_500 });
  await expect(thirdVisit.locator("[data-phase]")).toHaveAttribute("data-phase", "complete");
  const familiarSkip = thirdVisit.locator("[data-phase] button").filter({ hasText: "Skip opening" });
  await expect(familiarSkip).toHaveCSS("opacity", "0");
  await expect(familiarSkip).toHaveCSS("pointer-events", "none");

  // Persistent return memory may shorten the intro, but lower edits remain
  // opt-in until the visitor asks to follow Javier.
  await thirdVisit.getByRole("link", { name: "Explore" }).click();
  const returningScene = thirdVisit.locator('[data-live-scene="snapshot-clarify"]');
  await expect(returningScene).toHaveAttribute("data-live-state", "settled");
  await thirdVisit.getByRole("button", { name: "Follow Javier" }).click();
  await expect(returningScene).toHaveAttribute("data-live-state", /wip|observing|spotlight-entering|editing|commenting/, { timeout: 3_000 });
  await thirdVisit.getByRole("button", { name: /Stop following/ }).click();
});

test("returning visitors get clearly labelled Follow controls", async ({ page, isMobile }) => {
  test.skip(isMobile, "The compact mobile dock uses the same controls.");
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "granted");
    localStorage.setItem("javier-narrative-memory-v1", JSON.stringify({ schema: 1, visitCount: 1, seenCueIds: [], lastVisitAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86_400_000).toISOString() }));
  });
  await page.goto("/?narrative=return");
  await skipIntro(page);

  const replay = page.getByRole("button", { name: "Follow Javier" }).first();
  await expect(replay).toBeVisible();
  await replay.click();
  await expect(page.getByRole("button", { name: /Stop following/ }).first()).toBeVisible({ timeout: 4_000 });
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

test("mobile navigation and orientation chrome remain robust", async ({ page, isMobile }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);

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

test("core routes have no automatic accessibility violations", async ({ page, isMobile }) => {
  test.skip(isMobile, "Axe is run once; mobile reflow has dedicated coverage.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
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
  await expect(replay).toBeVisible({ timeout: 3_000 });
});
