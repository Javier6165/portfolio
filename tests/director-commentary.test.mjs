import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let commentary;

before(async () => {
  vite = await createServer({
    appType: "custom",
    configFile: false,
    logLevel: "silent",
    server: { hmr: false, middlewareMode: true },
  });
  commentary = await vite.ssrLoadModule("/app/components/live-file/DirectorCommentary.ts");
});

after(async () => {
  await vite?.close();
});

function context(overrides = {}) {
  return {
    allowRare: false,
    hasSeen: () => false,
    history: { ids: [], families: [], registers: [], humor: [] },
    pace: "mixed",
    section: "work",
    seed: "test-session",
    sessionStage: "settled",
    visitTier: 1,
    ...overrides,
  };
}

function allLines() {
  return [
    ...Object.values(commentary.sectionCommentary).flat(),
    ...Object.values(commentary.contextualCommentary).flat(),
    ...commentary.genericCommentary,
  ];
}

test("Director catalog has stable unique ids and a substantial editable voice pool", () => {
  const lines = allLines();
  const ids = lines.map((line) => line.id);
  const atomicCopy = lines.flatMap((line) => [line.opening, line.resolution].filter(Boolean));

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(atomicCopy.length >= 220);
  assert.ok(atomicCopy.every((copy) => copy.length <= 95));
  assert.ok(Object.values(commentary.sectionCommentary).every((linesForSection) => linesForSection.length >= 4));
  assert.ok(commentary.genericCommentary.length >= 30);
});

test("selection is reproducible but rotates away from already shown copy", () => {
  const lines = commentary.contextualLines("visit-five");
  const first = commentary.pickDirectorLine(lines, context({ trigger: "visit-five", visitTier: 5 }));
  assert.ok(first);

  const same = commentary.pickDirectorLine(lines, context({ trigger: "visit-five", visitTier: 5 }));
  assert.equal(same.id, first.id);

  const next = commentary.pickDirectorLine(lines, context({
    hasSeen: (id) => id === commentary.directorCopyMemoryId(first.id),
    history: { ids: [first.id], families: [first.family], registers: [first.register], humor: [first.humor] },
    trigger: "visit-five",
    visitTier: 5,
  }));
  assert.ok(next);
  assert.notEqual(next.id, first.id);
});

test("section-specific context never leaks into an incompatible anchor", () => {
  const lines = commentary.contextualLines("patient-reader");
  const work = commentary.getEligibleDirectorLines(lines, context({ section: "work", trigger: "patient-reader" }));
  const about = commentary.getEligibleDirectorLines(lines, context({ section: "about", trigger: "patient-reader" }));

  assert.ok(work.some(({ line }) => line.id === "behavior.patient-reader.work-evidence"));
  assert.ok(!about.some(({ line }) => line.id === "behavior.patient-reader.work-evidence"));
});

test("tone guard blocks consecutive high-humor comments", () => {
  const lines = commentary.contextualLines("rare-review");
  const ranked = commentary.getEligibleDirectorLines(lines, context({
    allowRare: true,
    history: { ids: [], families: [], registers: [], humor: [1] },
    sessionStage: "long-session",
    trigger: "rare-review",
  }));

  assert.ok(ranked.length > 0);
  assert.ok(ranked.every(({ line }) => line.humor < 2));
});

test("privacy responses stay reassuring and low-humor", () => {
  for (const trigger of ["memory-granted", "memory-denied"]) {
    const lines = commentary.contextualLines(trigger);
    assert.ok(lines.every((line) => line.intent === "reassure" || line.intent === "acknowledge"));
    assert.ok(lines.every((line) => line.humor <= 1));
  }
});

test("openings and resolutions remain one authored exchange", () => {
  const lines = commentary.sectionCommentary["hero-headline-indecision"];
  const selected = commentary.pickDirectorLine(lines, context({ section: "hero" }));
  assert.ok(selected?.opening);
  assert.ok(selected?.resolution);
  assert.ok(lines.some((line) => line.id === selected.id && line.resolution === selected.resolution));
});
