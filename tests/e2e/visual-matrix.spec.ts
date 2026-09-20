import { expect, test } from "@playwright/test";

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`captures light static Home at ${viewport.width}×${viewport.height}`, async ({ page, isMobile }, testInfo) => {
    test.skip(isMobile, "The explicit matrix runs once from the desktop project.");
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.goto("/");

    const geometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    for (const section of await page.locator("main .ordered-home > section").all()) {
      await section.scrollIntoViewIfNeeded();
    }
    await page.waitForFunction(() => [...document.images].filter((image) => !image.closest("dialog")).every((image) => image.complete));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`light-${viewport.width}x${viewport.height}.png`), fullPage: true });

  });
}
