import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

async function skipIntro(page: Page) {
  const url = new URL(page.url());
  url.searchParams.set("narrative", "return");
  await page.goto(url.toString());
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
}

test("the first visit opens the real portfolio frame in Figma and hands control back after Present", async ({ page, isMobile }) => {
  test.setTimeout(15_000);
  await page.goto("/?narrative=first");

  const hero = page.getByRole("region", { name: "I design the calm inside complex products." });
  await expect(page.locator("[data-figma-editor]")).toBeVisible();
  await expect(page.getByText("Javier Ortiz / Portfolio", { exact: true }).last()).toBeVisible();
  await expect(hero.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
  await expect(page.getByText("Present", { exact: true })).toBeVisible();
  const initialScroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 900);
  await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(initialScroll);
  await expect(page.locator("html")).not.toHaveAttribute("data-narrative", "complete");
  await expect(page.getByText("You caught me working.")).toBeVisible({ timeout: 2_500 });
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 6_000 });

  await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
  await expect(hero.getByRole("img", { name: /Portrait of Javier Ortiz/ })).toBeVisible();
  await expect(page.locator("[data-figma-editor]")).toBeHidden();
  await expect(page.getByLabel("Portfolio memory preference")).toHaveCount(0);
  await expect(hero.locator("img.portrait")).toHaveCount(1);
  await expect(hero.locator("img.portrait")).toHaveAttribute("src", /hero-system\.jpg/);
  if (!isMobile) {
    await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-director-cue", "hero-headline-indecision", { timeout: 1_500 });
    await expect(page.locator("[data-javier-cursor]")).not.toHaveCSS("opacity", "0");
    await expect(page.locator("#hero-title")).toHaveAttribute("data-director-editing", "text");
  }

  // The opening may own scroll only while its timeline is active. Its global
  // gesture listeners remain mounted with the hero, so verify that the handoff
  // really gives the document back to the visitor.
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  const releasedAt = await page.evaluate(() => scrollY);
  if (isMobile) {
    const touchStillBlocked = await page.evaluate(() => {
      const event = new TouchEvent("touchmove", { bubbles: true, cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(touchStillBlocked).toBe(false);
  } else {
    await page.mouse.wheel(0, 180);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(releasedAt + 40);
  }
});

test("the mobile hero keeps the title, portrait and cue in the first viewport", async ({ page, isMobile }) => {
  test.skip(!isMobile, "This is the mobile composition contract.");
  await page.goto("/?narrative=first");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 16_000 });

  const geometry = await page.evaluate(() => {
    const title = document.querySelector("h1")!.getBoundingClientRect();
    const name = document.querySelector("[data-live-file-frame] p")!.getBoundingClientRect();
    const portrait = document.querySelector('figure[aria-label^="Portrait of Javier Ortiz"]')!.getBoundingClientRect();
    const explore = [...document.querySelectorAll("a")].find((link) => link.textContent?.includes("Explore"))!.getBoundingClientRect();
    return {
      titleTop: title.top,
      titleBottom: title.bottom,
      nameTop: name.top,
      portraitTop: portrait.top,
      portraitVisible: Math.min(portrait.bottom, innerHeight) - Math.max(portrait.top, 0),
      exploreTop: explore.top,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(geometry.nameTop).toBeGreaterThan(300);
  expect(geometry.titleTop).toBeGreaterThan(geometry.nameTop);
  expect(geometry.titleBottom).toBeLessThan(844);
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

test("the 60-second introduction is an honest early shortcut, not another forced scene", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const section = page.locator("#meet-javier");
  await expect(section.getByRole("heading", { name: "Meet me in 60 seconds." })).toBeVisible();
  await expect(section.getByText("Placeholder · final video pending")).toBeVisible();
  await expect(section.getByText("Captions and transcript planned")).toBeVisible();
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(section.locator("[data-live-scene]")).toHaveCount(0);

  const geometry = await page.evaluate(() => ({
    snapshotTop: document.querySelector("#experience")!.getBoundingClientRect().top,
    videoTop: document.querySelector("#meet-javier")!.getBoundingClientRect().top,
    workTop: document.querySelector("#work")!.getBoundingClientRect().top,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(geometry.videoTop).toBeGreaterThan(geometry.snapshotTop);
  expect(geometry.workTop).toBeGreaterThan(geometry.videoTop);
  expect(geometry.overflow).toBe(0);
});

test("forced WIP keeps Snapshot recognisable while exposing a small rhythm correction", async ({ page, isMobile }) => {
  test.skip(isMobile, "The authored WIP contrast is measured once on desktop.");
  await page.goto("/?narrative=first&live=wip");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", "wip");
  const wipStyle = await scene.getByRole("list", { name: "Javier Ortiz at a glance" }).evaluate((element) => ({
    columns: getComputedStyle(element).gridTemplateColumns,
    opacity: getComputedStyle(element).opacity,
    transform: getComputedStyle(element).transform,
  }));
  await expect(scene.getByText("Draft · rhythm uneven")).toBeAttached();

  await page.goto("/?narrative=first&live=settled");
  await skipIntro(page);
  await page.getByRole("link", { name: "Explore" }).click();
  const finalScene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(finalScene).toHaveAttribute("data-live-state", "settled");
  const finalStyle = await finalScene.getByRole("list", { name: "Javier Ortiz at a glance" }).evaluate((element) => ({
    columns: getComputedStyle(element).gridTemplateColumns,
    opacity: getComputedStyle(element).opacity,
    transform: getComputedStyle(element).transform,
  }));
  expect(finalStyle.columns.split(" ")).toHaveLength(4);
  expect(wipStyle.columns.split(" ")).toHaveLength(4);
  expect(finalStyle.opacity).not.toBe(wipStyle.opacity);
  expect(finalStyle.transform).not.toBe(wipStyle.transform);
});

test("the first visit keeps Snapshot native and makes every later edit optional", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop verifies free scroll and the explicit Follow control.");
  await page.goto("/?narrative=first");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 6_000 });
  await page.getByRole("link", { name: "Explore" }).click();

  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", "settled");
  await expect(page.locator("[data-spotlight-active]")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");

  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 40);

  await page.getByRole("button", { name: "Follow Javier" }).first().click();
  await expect(page.getByRole("button", { name: /Stop following/ }).first()).toBeVisible({ timeout: 5_000 });
  await page.getByRole("button", { name: /Stop following/ }).first().click();
  await expect(page.locator("[data-spotlight-active]")).toHaveCount(0);
});

test("free navigation never launches lower scenes and Follow Javier remains cancellable", async ({ page, isMobile }) => {
  test.skip(isMobile, "The desktop pointer contract runs once; mobile keeps free navigation.");
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "granted");
    localStorage.setItem("javier-narrative-memory-v1", JSON.stringify({ schema: 1, visitCount: 1, seenCueIds: [], lastVisitAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86_400_000).toISOString() }));
    sessionStorage.setItem("javier-narrative-counted-v1", "true");
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

test("Director types like a person and stays present when the visitor scrolls", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch intentionally omits the synthetic Director cursor.");
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "granted");
    localStorage.setItem("javier-narrative-memory-v1", JSON.stringify({ schema: 1, visitCount: 1, seenCueIds: [], lastVisitAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86_400_000).toISOString() }));
    sessionStorage.setItem("javier-narrative-counted-v1", "true");
  });
  await page.goto("/?narrative=return&director=fast");
  await skipIntro(page);

  const dock = page.locator("[data-follow-dock]");
  const heroTitle = page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." });
  const overlay = page.locator("[data-director-text-overlay]");
  await expect(dock).toBeVisible();
  await expect(dock.locator("span").filter({ hasText: "FOLLOW JAVIER" })).toBeAttached();
  await expect(dock).toHaveAttribute("data-presence-status", "editing", { timeout: 3_000 });
  await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-director-state", /approaching|commenting|editing/);
  await expect(page.locator("[data-javier-cursor]")).not.toHaveCSS("opacity", "0");
  await expect(page.locator("[data-ambient-note]")).toContainText(/different answer|impossible choices|what I actually bring|defensible opinions|question the headline/);
  await expect(heroTitle).toHaveAttribute("data-director-editing", "text");
  await expect(overlay).toBeVisible();
  await expect(overlay).toContainText("Javier Ortiz", { timeout: 3_000 });
  await expect(heroTitle).toHaveAccessibleName("I design the calm inside complex products.");
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");

  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 420);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 40);
  const cursor = page.locator("[data-javier-cursor]");
  await expect(cursor).not.toHaveCSS("opacity", "0");
  await expect(cursor).toHaveCSS("position", "fixed");
  await expect(page.locator("[data-ambient-note]")).toHaveCSS("opacity", "0");
  await expect(overlay).toHaveCount(0);
  await expect(heroTitle).not.toHaveAttribute("data-director-editing", /.+/);
  await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-director-last-context", "context:fast-scroll", { timeout: 3_000 });

  // Director is an enhancement: its circuit breaker must remove only the
  // simulated collaborator and leave the real portfolio operational.
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("portfolio-director-safety-test")));
  await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-director-state", "disabled");
  await expect(heroTitle).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("Director keeps working autonomously and hands its cursor to Follow", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch intentionally omits the synthetic Director cursor.");
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "denied");
    sessionStorage.setItem("javier-director-beats-v1", JSON.stringify([
      "hero-headline-indecision",
      "snapshot-trust-typo",
      "work-evidence-note",
      "practice-two-pixels",
      "ai-validate-typo",
      "about-crop-breathe",
      "references-side-typo",
      "playground-easing",
      "footer-handoff",
      "context:visit-one",
      "context:session-forty-five",
      "context:patient-reader",
    ]));
  });
  await page.goto("/?narrative=return&director=fast");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");

  const ambientCursor = page.locator("[data-javier-cursor]");
  const followCursor = page.locator("[data-spotlight-cursor]");
  const director = page.locator("[data-director-presence]");
  await expect(ambientCursor).not.toHaveCSS("opacity", "0");
  await expect(director).toHaveAttribute("data-director-cue", /ambient:/, { timeout: 3_000 });
  await expect(director).toHaveAttribute("data-director-intent", /autonomous-work|visitor-focus/);

  const heroBox = await page.locator("#hero-title").boundingBox();
  expect(heroBox).not.toBeNull();
  await page.mouse.move(heroBox!.x + heroBox!.width * .5, heroBox!.y + heroBox!.height * .5);
  await expect(director).toHaveAttribute("data-director-intent", "visitor-focus", { timeout: 3_000 });

  await page.getByRole("button", { name: "Follow Javier" }).first().click();
  await expect(page.getByRole("button", { name: /Stop following/ }).first()).toBeVisible();
  await expect(ambientCursor).toHaveCSS("opacity", "0");
  await expect(followCursor).not.toHaveCSS("opacity", "0");

  await page.getByRole("button", { name: /Stop following/ }).first().click();
  await expect(followCursor).toHaveCSS("opacity", "0");
  await expect(ambientCursor).not.toHaveCSS("opacity", "0");
});

test("every Director beat still resolves against the redesigned page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch intentionally omits the synthetic Director cursor.");
  test.setTimeout(45_000);
  const beats = [
    { id: "snapshot-trust-typo", selector: "#snapshot-title" },
    { id: "work-evidence-note", selector: ".project-card__media" },
    { id: "practice-two-pixels", selector: "#practice-title" },
    { id: "ai-validate-typo", selector: "#ai-title" },
    { id: "about-crop-breathe", selector: "#about-preview figure" },
    { id: "references-side-typo", selector: "#testimonials-title" },
    { id: "playground-easing", selector: ".playground-playhead" },
    { id: "footer-handoff", selector: ".footer-contact" },
  ];
  await page.addInitScript((ids) => {
    localStorage.setItem("javier-narrative-consent", "denied");
    const requested = new URL(location.href).searchParams.get("directorOnly");
    const contextual = ["visit-one", "visit-two", "visit-three", "visit-four", "visit-five", "session-forty-five", "session-two-minutes", "session-four-minutes", "fast-scroll", "patient-reader", "returned-top", "reached-end", "section-revisit"]
      .map((id) => `context:${id}`);
    sessionStorage.setItem("javier-director-beats-v1", JSON.stringify([
      ...ids.filter((id) => id !== requested),
      ...contextual,
    ]));
  }, ["hero-headline-indecision", ...beats.map(({ id }) => id)]);

  for (const beat of beats) {
    await page.goto(`/?narrative=return&director=fast&directorOnly=${beat.id}`);
    await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
    await page.locator(beat.selector).first().scrollIntoViewIfNeeded();
    await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-director-cue", beat.id, { timeout: 3_000 });
  }
});

test("Director varies return commentary and remembers only shown variants after consent", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Touch intentionally omits the synthetic Director cursor.");
  await page.addInitScript(() => {
    localStorage.setItem("javier-narrative-consent", "granted");
    localStorage.setItem("javier-narrative-memory-v1", JSON.stringify({ schema: 1, visitCount: 4, seenCueIds: [], lastVisitAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86_400_000).toISOString() }));
  });
  await page.goto("/?narrative=return&director=fast");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete");
  const director = page.locator("[data-director-presence]");
  await expect(director).toHaveAttribute("data-director-cue", "context:visit-five", { timeout: 3_000 });
  const firstCopy = (await page.locator("[data-ambient-note] p").textContent())?.trim();
  expect(firstCopy).toMatch(/Five visits|keep coming back|Visit five|welcome back feels|Five rounds/);
  await expect.poll(() => page.evaluate(() => {
    const memory = JSON.parse(localStorage.getItem("javier-narrative-memory-v1") ?? "null");
    return memory?.seenCueIds?.some((id: string) => id.startsWith("director-copy:context:visit-five:opening:"));
  })).toBe(true);

  const nextVisit = await context.newPage();
  await nextVisit.goto("/?narrative=return&director=fast");
  await expect(nextVisit.locator("[data-director-presence]")).toHaveAttribute("data-director-cue", "context:visit-five", { timeout: 3_000 });
  const secondCopy = (await nextVisit.locator("[data-ambient-note] p").textContent())?.trim();
  expect(secondCopy).toMatch(/Five visits|keep coming back|Visit five|welcome back feels|Five rounds/);
  expect(secondCopy).not.toBe(firstCopy);
  await nextVisit.close();
});

test("Director turns session time into ephemeral commentary", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch intentionally omits the synthetic Director cursor.");
  await page.addInitScript(() => {
    sessionStorage.setItem("javier-director-beats-v1", JSON.stringify([
      "hero-headline-indecision",
      "snapshot-trust-typo",
      "work-evidence-note",
      "practice-two-pixels",
      "ai-validate-typo",
      "about-crop-breathe",
      "references-side-typo",
      "playground-easing",
      "footer-handoff",
      "context:patient-reader",
    ]));
  });
  await page.goto("/?narrative=return&director=fast");
  const director = page.locator("[data-director-presence]");
  await expect(director).toHaveAttribute("data-director-cue", "context:session-forty-five", { timeout: 3_000 });
  await expect(page.locator("[data-ambient-note]")).toContainText(/stayed past the opening|Still here|Forty-five seconds|reading, not merely scrolling/);
  expect(await page.evaluate(() => localStorage.getItem("javier-narrative-memory-v1"))).toBeNull();
});

test("Director acknowledges rejected memory without storing behavior", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch intentionally omits the synthetic Director cursor.");
  test.setTimeout(75_000);
  await page.goto("/?narrative=first&director=fast");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 6_000 });
  await page.getByRole("link", { name: "Explore" }).click();
  await page.getByRole("button", { name: "Follow Javier" }).first().click();
  const scene = page.locator('[data-live-scene="snapshot-clarify"]');
  await expect(scene).toHaveAttribute("data-live-state", "settled", { timeout: 16_000 });
  await page.getByRole("button", { name: /Stop following/ }).first().click();
  await expect(page.getByLabel("Portfolio memory preference")).toBeVisible({ timeout: 6_000 });
  await page.getByRole("button", { name: "No thanks" }).click();

  const director = page.locator("[data-director-presence]");
  await expect(director).toHaveAttribute("data-director-cue", "context:memory-denied", { timeout: 3_000 });
  await expect(page.locator("[data-ambient-note]")).toContainText(/No cookies|No thanks received|Memory off|works without remembering|clean browser/);
  expect(await page.evaluate(() => ({
    consent: localStorage.getItem("javier-narrative-consent"),
    memory: localStorage.getItem("javier-narrative-memory-v1"),
  }))).toEqual({ consent: "denied", memory: null });
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

test("consented memory produces deterministic return tiers without replaying the opening", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Storage tiers are viewport-independent and run once.");
  test.setTimeout(75_000);
  await page.goto("/?narrative=first");
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 6_000 });
  await page.getByRole("link", { name: "Explore" }).click();
  await page.getByRole("button", { name: "Follow Javier" }).first().click();
  await expect(page.locator('[data-live-scene="snapshot-clarify"]')).toHaveAttribute("data-live-state", /wip|observing|spotlight-entering|editing|commenting/, { timeout: 4_000 });
  await expect(page.locator('[data-live-scene="snapshot-clarify"]')).toHaveAttribute("data-live-state", "settled", { timeout: 16_000 });
  await page.getByRole("button", { name: /Stop following/ }).first().click();
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
  await expect(thirdVisit.locator("[data-figma-editor]")).toBeHidden();

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
  await expect(page.locator("html")).toHaveAttribute("data-narrative", "complete", { timeout: 6_000 });
  await expect(page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
  await expect(page.locator("[data-figma-editor]")).toBeHidden();
});

test("the portfolio remains useful without JavaScript", async ({ browser, isMobile }) => {
  test.skip(isMobile, "The no-JavaScript contract is viewport-independent.");
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
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
    await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
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
  const visual = card.locator(".project-card__media .project-visual");
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await expect(card).toBeFocused();
  await expect.poll(() => visual.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");

  const replay = page.getByRole("button", { name: "Replay study" });
  await replay.scrollIntoViewIfNeeded();
  await replay.click();
  await expect(page.getByRole("button", { name: "Playing 00:02" })).toBeDisabled();
  await expect(replay).toBeVisible({ timeout: 3_000 });
});
