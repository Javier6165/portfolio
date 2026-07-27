import { expect, test } from "@playwright/test";

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`captures Dark at ${viewport.width}×${viewport.height}`, async ({ page, isMobile }, testInfo) => {
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
    for (const section of await page.locator("main > section").all()) {
      await section.scrollIntoViewIfNeeded();
    }
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    await page.screenshot({ path: testInfo.outputPath(`dark-${viewport.width}x${viewport.height}.png`), fullPage: true });

  });
}
