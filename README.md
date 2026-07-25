# Javier Ortiz — Portfolio Preview

An editorial, interactive portfolio for a Senior Product Designer working on complex platforms, systems and AI-assisted product development.

## Experience concept

- `Live File`: the portfolio opens as a working design file and resolves into the finished product.
- A semantic hero with Javier Ortiz, Senior Product Designer, theme-linked portrait and `Explore`.
- `System` and `Human` as two distinct visual identities, not a cosmetic dark/light toggle.
- Three clearly labelled fictitious case studies.
- Three optional narrative cues across Home in the current build, bounded and cancelable; the section-by-section replacement is specified in Narrative 07.
- A consented returning-visitor memory with replay, forget and motion controls.
- An interactive token-propagation case block plus a typed framework for screenshots, galleries, video, Figma and coded prototypes.
- Progressive motion, reduced-motion and no-JavaScript fallbacks.
- Responsive Home, About, Playground, case template and 404.

## Key paths

- Home: `app/page.tsx`
- Live File: `app/components/live-file/`
- Case content/schema: `app/data.ts`
- Case evidence renderer: `app/components/CaseEvidence.tsx`
- Visual system: `app/globals.css` and co-located CSS Modules
- Automated QA: `tests/rendered-html.test.mjs` and `tests/e2e/`
- Local assets: `public/`

## Documentation

- `AGENTS.md`: operational rules for future Codex sessions.
- `docs/PROJECT-CONTEXT.md`: brief, profile and current response.
- `docs/DECISIONS.md`: current product and technical decisions.
- `docs/ARCHITECTURE.md`: routes, theme, narrative, storage and evidence contracts.
- `docs/AUDIT-05-LIVE-FILE.md`: diagnosis and rationale behind the current concept.
- `docs/IMPLEMENTATION-05-LIVE-FILE.md`: timings, states, components, privacy, QA and extension rules.
- `docs/AUDIT-06-POST-LIVE-FILE.md`: measured post-implementation audit, defects and gaps.
- `docs/PLAN-06-IMPROVEMENTS.md`: prioritised stabilisation, transversal narrative and content plan.
- `docs/NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`: complete section-by-section score, triggers, states and responsive contract.
- `docs/CONTENT-AND-RELEASE.md`: replacing placeholders and launch checklist.
- `docs/ASSETS.md`: portrait and social-card provenance.

Documents numbered 01–04 are historical context. When they conflict with 05, `AGENTS.md` or the current code, the newer contract wins.

## Run and validate

```bash
npm install
npx playwright install chromium
npm run dev
npm run lint
npm test
npm run test:e2e
```

`npm test` includes the production build and server-rendered smoke tests. `test:e2e` covers keyboard, axe, reduced motion, no-JS, memory, image failure and the System/Human responsive matrix.

## Before public launch

Replace fictitious cases and illustrative metrics, add final contact details and CV, validate ownership/confidentiality, set the real URL, run performance QA with final media and obtain Javier’s explicit approval before enabling indexation. `app/config.ts` remains the single release switch.
