import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the restructured portfolio home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Javier Ortiz/);
  assert.match(html, /5\+ years/);
  assert.match(html, /Lead Product Designer/);
  assert.match(html, /B2B platforms &amp; systems/);
  assert.match(html, /Meet me in 60 seconds/);
  assert.match(html, /there is no playable video yet/);
  assert.match(html, /AI \+ coded prototypes/);
  assert.match(html, /LogicX \/ Rules engine/);
  assert.match(html, /Backoffice Design System/);
  assert.match(html, /Casino Customizer/);
  assert.match(html, /href="\/work\/logicx"/);
  assert.match(html, /href="\/work\/backoffice-design-system"/);
  assert.match(html, /href="\/work\/casino-customizer"/);
  assert.match(html, /What people I’ve worked with say/);
  assert.match(html, /Yana Azzopardi/);
  assert.match(html, /Donnalisa Buhagiar/);
  assert.match(html, /Juan José Reina Cruz/);
  assert.match(html, /How do you make trade-offs\?/);
  assert.match(html, /Let’s make complex things a little simpler/);
  assert.doesNotMatch(html, /href="\/work\/atlas"|href="\/playground"|href="\/#lab"|data-figma-editor/);
  assert.match(html, /id="lab"[^>]* hidden/);
  assert.match(html, /data-studio-intro/);
  assert.match(html, /data-director-presence/);
  assert.match(html, /data-studio-headline/);
  assert.doesNotMatch(html, /Follow Javier|Stop following/);
  assert.doesNotMatch(html, /javier-theme|hero-human|about-human|theme-toggle|Use Light mode|data-theme/i);
  assert.doesNotMatch(html, /dataset\.narrative|data-figma-editor/);
  assert.match(html, /hero-system\.jpg/);
  assert.match(html, /Skip to content/);
  assert.doesNotMatch(html, /og-live-file\.jpg/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /href="\/favicon\.png"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
  assert.doesNotMatch(html, /I design complex platforms|complexity-engine|LivingFold|@react-three|three\.module/i);
});

test("server-renders About and the three real-work case drafts", async () => {
  const [aboutResponse, logicResponse, systemResponse, customizerResponse] = await Promise.all([
    render("/about"),
    render("/work/logicx"),
    render("/work/backoffice-design-system"),
    render("/work/casino-customizer"),
  ]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(logicResponse.status, 200);
  assert.equal(systemResponse.status, 200);
  assert.equal(customizerResponse.status, 200);

  const [about, logic, system, customizer] = await Promise.all([
    aboutResponse.text(),
    logicResponse.text(),
    systemResponse.text(),
    customizerResponse.text(),
  ]);
  assert.match(about, /Lead Product Designer based in Marbella/);
  assert.match(about, /staying hands-on with product design/);
  assert.match(logic, /Making powerful automation easier to understand/);
  assert.match(logic, /images\/cases\/logicx\/editor-mockup\.jpg/);
  assert.match(logic, /images\/cases\/logicx\/simulator-mockup\.jpg/);
  assert.doesNotMatch(logic, /Final LogicX editor image to be added|Image placeholder/);
  assert.match(system, /Building one product language across a complex ecosystem/);
  assert.match(system, /images\/cases\/backoffice\/library-mockup\.jpg/);
  assert.match(system, /images\/cases\/backoffice\/tokens-mockup\.jpg/);
  assert.doesNotMatch(system, /System and product imagery is pending|Image placeholder/);
  assert.match(customizer, /I designed an interactive Figma prototype/);
  assert.match(customizer, /images\/cases\/customizer\/overview\.jpg/);
  assert.doesNotMatch(customizer, /María Mora|mariamoragarcia\.com/);
});

test("keeps the private preview out of search engines", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);
  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);

  const [robots, sitemap] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
  ]);
  assert.match(robots, /Disallow: \/\s*$/m);
  assert.match(robots, /javier-ortiz-portfolio\.malapipa\.chatgpt\.site\/sitemap\.xml/);
  assert.match(sitemap, /javier-ortiz-portfolio\.malapipa\.chatgpt\.site\/work\/logicx/);
  assert.doesNotMatch(sitemap, /\/work\/atlas|\/playground/);
});
