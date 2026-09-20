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
  assert.match(html, /Senior Product Designer/);
  assert.match(html, /B2B platforms &amp; systems/);
  assert.match(html, /Meet me in 60 seconds/);
  assert.match(html, /there is no playable video yet/);
  assert.match(html, /AI \+ coded prototypes/);
  assert.match(html, /LogicX \/ Rules engine/);
  assert.match(html, /Backoffice Design System/);
  assert.match(html, /case studies are being prepared/);
  assert.match(html, /What people I’ve worked with say/);
  assert.match(html, /Yana Azzopardi/);
  assert.match(html, /Donnalisa Buhagiar/);
  assert.match(html, /Juan José Reina Cruz/);
  assert.match(html, /How do you make trade-offs\?/);
  assert.match(html, /Let’s make complex things a little simpler/);
  assert.doesNotMatch(html, /href="\/work\/atlas"|href="\/playground"|data-director-presence|data-figma-editor/);
  assert.doesNotMatch(html, /javier-theme|hero-human|about-human|theme-toggle|Use Light mode|data-theme/i);
  assert.doesNotMatch(html, /dataset\.narrative|data-director-presence|data-figma-editor/);
  assert.match(html, /hero-system\.jpg/);
  assert.match(html, /Skip to content/);
  assert.doesNotMatch(html, /og-live-file\.jpg/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
  assert.doesNotMatch(html, /I design complex platforms|complexity-engine|LivingFold|@react-three|three\.module/i);
});

test("server-renders About and a concept case", async () => {
  const [aboutResponse, caseResponse, evidenceResponse] = await Promise.all([
    render("/about"),
    render("/work/atlas"),
    render("/work/northstar"),
  ]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(caseResponse.status, 200);
  assert.equal(evidenceResponse.status, 200);

  const [about, caseHtml, evidenceHtml] = await Promise.all([
    aboutResponse.text(),
    caseResponse.text(),
    evidenceResponse.text(),
  ]);
  assert.match(about, /Senior Product Designer based in Marbella/);
  assert.match(about, /recent experience stepping into lead responsibility/);
  assert.match(caseHtml, /Rules without the maze/);
  assert.match(caseHtml, /Fictitious preview content/);
  assert.match(caseHtml, /Annotated Figma flow/);
  assert.match(caseHtml, /Illustrative metrics only/);
  assert.match(evidenceHtml, /Change one decision\. Watch the system respond\./);
  assert.match(evidenceHtml, /One token\. Three contexts\./);
  assert.match(evidenceHtml, /Fictitious/);
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
  assert.match(sitemap, /javier-ortiz-portfolio\.malapipa\.chatgpt\.site\/work\/atlas/);
});
