import { chromium } from "@playwright/test";

const baseUrl = process.argv[2] ?? "http://localhost:4180";
const targets = [
  { name: "desktop", width: 1440, height: 900, isMobile: false },
  { name: "mobile", width: 390, height: 844, isMobile: true },
];

const browser = await chromium.launch();

for (const target of targets) {
  const context = await browser.newContext({
    viewport: { width: target.width, height: target.height },
    isMobile: target.isMobile,
    deviceScaleFactor: target.isMobile ? 2 : 1,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.__portfolioAudit = { cls: 0, lcp: 0, lcpSize: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__portfolioAudit.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const entry = entries.at(-1);
      if (entry) {
        window.__portfolioAudit.lcp = entry.startTime;
        window.__portfolioAudit.lcpSize = entry.size;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });

  await page.goto(`${baseUrl}/?narrative=first`, { waitUntil: "networkidle" });
  await page.locator("html").waitFor({ state: "attached" });
  await page.waitForFunction(() => document.documentElement.dataset.narrative === "complete", null, { timeout: 7_000 });
  const introCompleteAt = await page.evaluate(() => Math.round(performance.now()));
  await page.waitForTimeout(500);

  const result = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const navigation = performance.getEntriesByType("navigation")[0];
    const sum = (items) => Math.round(items.reduce((total, item) => total + (item.encodedBodySize || 0), 0));
    const sections = [...document.querySelectorAll("main > section")].map((section) => ({
      id: section.id || section.getAttribute("aria-labelledby") || "section",
      top: Math.round(section.getBoundingClientRect().top + window.scrollY),
      height: Math.round(section.getBoundingClientRect().height),
    }));
    return {
      ...window.__portfolioAudit,
      encodedBytes: Math.round((navigation?.encodedBodySize || 0) + sum(resources)),
      jsBytes: sum(resources.filter((entry) => entry.name.includes(".js"))),
      cssBytes: sum(resources.filter((entry) => entry.name.includes(".css"))),
      imageBytes: sum(resources.filter((entry) => entry.initiatorType === "img" || /\.(avif|webp|jpe?g)(\?|$)/.test(entry.name))),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      sections,
    };
  });

  console.log(JSON.stringify({ viewport: target.name, ...result, introCompleteAt }));
  await context.close();
}

await browser.close();
