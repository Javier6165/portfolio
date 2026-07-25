# Javier Ortiz — Portfolio Preview

An editorial, interactive portfolio for a Senior Product Designer working on complex platforms, systems and AI-assisted product development.

## Experience concept

- `Live File`: the portfolio opens as a working design file and resolves into the finished product.
- A semantic hero with Javier Ortiz, Senior Product Designer, theme-linked portrait and `Explore`.
- `System` and `Human` as two distinct visual identities, not a cosmetic dark/light toggle.
- Three clearly labelled fictitious case studies.
- A complete nine-act Home score: Compose, Clarify, Frame, Propagate, Activate, Experiment, Reframe, Verify and Hand off.
- An explicitly provisional testimonial preview: three typed perspectives, no fabricated quotes or identities, and a source-required path to verified content.
- One global Javier cursor on desktop, a touch translation on mobile and persistent settled traces.
- A consented returning-visitor memory with replay, forget and motion controls.
- An interactive token-propagation case block plus a typed framework for screenshots, galleries, video, Figma and coded prototypes.
- Progressive motion, reduced-motion and no-JavaScript fallbacks.
- Responsive Home, About, Playground, case template and 404.

## Key paths

- Home: `app/page.tsx`
- Live File: `app/components/live-file/`
- Case content/schema: `app/data.ts`
- Case evidence renderer: `app/components/CaseEvidence.tsx`
- Testimonial preview: `app/components/Testimonials.tsx` and `app/components/Testimonials.module.css`
- Persistent navigation/progress: `app/components/PageProgress.tsx` and `app/components/PageProgress.module.css`
- Visual system: `app/globals.css` and co-located CSS Modules
- Automated QA: `tests/rendered-html.test.mjs` and `tests/e2e/`
- Local assets: `public/`

## Documentation

- `AGENTS.md`: operational rules for future Codex sessions.
- `docs/PROJECT-CONTEXT.md`: brief, profile and current response.
- `docs/DECISIONS.md`: current product and technical decisions.
- `docs/ARCHITECTURE.md`: routes, theme, narrative, storage and evidence contracts.
- `docs/NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`: complete section-by-section score, triggers, states and responsive contract.
- `docs/IMPLEMENTATION-08-LIVE-FILE-SCORE.md`: current components, timings, memory, metrics and QA.
- `docs/AUDIT-08-LIVE-FILE-TRANSVERSAL.md`: complete post-implementation audit.
- `docs/PLAN-09-NEXT-IMPROVEMENTS.md`: next work, ordered around real evidence and launch readiness.
- `docs/PLAN-10-EXPERIENCE-CHROME.md`: current navigation, progress and interaction-polish iteration.
- `docs/CONTENT-AND-RELEASE.md`: replacing placeholders and launch checklist.
- `docs/ASSETS.md`: portrait and social-card provenance.

Superseded hero experiments and interim audits were removed after their durable decisions were consolidated into `DECISIONS.md`. Git history remains the archive; the documentation above is the current handoff set.

## Run and validate

```bash
npm install
npx playwright install chromium
npm run dev
npm run lint
npm test
npm run test:e2e
```

`npm test` includes the production build and server-rendered smoke tests. `test:e2e` covers choreography, functional AI/Playground controls, keyboard, axe, reduced motion, no-JS, memory, image failure and the full-page System/Human responsive matrix. `node tests/performance-audit.mjs <production-url>` records the local performance comparison.

## Before public launch

Replace fictitious cases and illustrative metrics, add final contact details and CV, validate ownership/confidentiality, set the real URL, run performance QA with final media and obtain Javier’s explicit approval before enabling indexation. `app/config.ts` remains the single release switch.
