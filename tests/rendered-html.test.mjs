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
  assert.match(html, /I design the/);
  assert.match(html, /calm/);
  assert.match(html, /Selected work/);
  assert.match(html, /fictitious/i);
  assert.match(html, /href="\/work\/atlas"/);
  assert.match(html, /javier-theme/);
  assert.match(html, /Skip to content/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("server-renders About and a concept case", async () => {
  const [aboutResponse, caseResponse] = await Promise.all([
    render("/about"),
    render("/work/atlas"),
  ]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(caseResponse.status, 200);

  const [about, caseHtml] = await Promise.all([
    aboutResponse.text(),
    caseResponse.text(),
  ]);
  assert.match(about, /Senior Product Designer based in Marbella/);
  assert.match(about, /recently Lead Product Designer/);
  assert.match(caseHtml, /Rules without the maze/);
  assert.match(caseHtml, /Fictitious preview content/);
  assert.match(caseHtml, /Illustrative metrics only/);
});
