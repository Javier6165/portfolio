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

test("server-renders the complete portfolio home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Javier Ortiz/);
  assert.match(html, /5\+ years at GiG/);
  assert.match(html, /Senior Product Designer/);
  assert.match(html, /I turn complex product logic into decisions people can see, test and trust/);
  assert.match(html, /AI \+ coded prototypes/);
  assert.match(html, /Rules · CMS · Backoffice/);
  assert.match(html, /Product systems made inspectable/);
  assert.match(html, /AI-native product practice/);
  assert.match(html, /I make the system visible before I make the interface/);
  assert.match(html, /References — preview/);
  assert.match(html, /no quote or identity is simulated/i);
  assert.match(html, /Placeholder · source required/);
  assert.match(html, /fictitious/i);
  assert.match(html, /href="\/work\/atlas"/);
  assert.doesNotMatch(html, /javier-theme|hero-human|about-human|theme-toggle|Use Light mode|data-theme/i);
  assert.match(html, /Working file/);
  assert.match(html, /Javier is editing/);
  assert.match(html, /javier-narrative-memory-v1/);
  assert.match(html, /hero-system\.jpg/);
  assert.match(html, /Skip to content/);
  assert.match(html, /og-live-file\.jpg/);
  assert.match(html, /javier-ortiz-portfolio\.malapipa\.chatgpt\.site\/og-live-file\.jpg/);
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
