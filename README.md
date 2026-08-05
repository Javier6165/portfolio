# Javier Ortiz — Portfolio Preview

An editorial, interactive portfolio for a Senior Product Designer working on complex platforms, systems and AI-assisted product development.

## Experience concept

- `Live File`: the portfolio opens as a working design file and resolves into the finished product.
- A first visit opens inside recognisable Figma UI3 with a working title and an empty portrait frame; Javier drags in the real portrait, is caught working and activates `Present` himself.
- A semantic Dark hero with Javier Ortiz, `I design the calm inside complex products.`, Senior Product Designer, portrait and `Explore`.
- One focused Dark visual system, with no theme selector or alternate appearance state.
- Three clearly labelled fictitious case studies.
- Native scroll immediately after the intro; every Spotlight chapter runs only after the visitor chooses `Follow Javier`.
- `Director`: utility-AI presence whose first authored pass runs uninterrupted in document order. Only after Contact may ephemeral local attention insert contextual comments, without moving the camera or calling remote AI. Follow adds camera and Spotlight to the same edits.
- The Present handoff immediately continues the visible WIP: Javier promotes `Senior` to `Lead`, reconsiders the label, types the final positioning with a corrected typo and comments only after the edit while preserving semantic copy.
- Follow is offered once from the right side of the top bar, then collapses to the same violet `JO` collaborator avatar. Scroll never stops the authored pass or the later micro-adjustment loop.
- Snapshot trims a small padding excess, the video swaps its poster, Atlas tests its crop and Northstar raises metadata contrast. Practice then aligns its viewer by two pixels, AI corrects `Valdiate`, About relaxes a close crop, References raises status contrast, Playground refines easing and Contact aligns the final CTA.
- A provisional Reference Ledger: three typed perspectives, no fabricated quotes or identities, and a source-required path to verified content.
- A consented returning-visitor memory with replay, forget and motion controls.
- An interactive token-propagation case block plus a typed framework for screenshots, galleries, video, Figma and coded prototypes.
- Progressive motion, reduced-motion and no-JavaScript fallbacks.
- Responsive Home, About, Playground, case template and 404.

## Key paths

- Home: `app/page.tsx`
- Live File: `app/components/live-file/`
- Case content/schema: `app/data.ts`
- Case evidence renderer: `app/components/CaseEvidence.tsx`
- Reference preview: `app/components/Testimonials.tsx` and `app/components/Testimonials.module.css`
- Header scroll state: `app/components/PageProgress.tsx`
- Visual system: `app/globals.css` and co-located CSS Modules
- Automated QA: `tests/rendered-html.test.mjs` and `tests/e2e/`
- Local assets: `public/`

## Current handoff documentation

- `AGENTS.md`: operational rules for future Codex sessions.
- `docs/PROJECT-CONTEXT.md`: brief, profile and current response.
- `docs/DECISIONS.md`: current product and technical decisions.
- `docs/ARCHITECTURE.md`: routes, visual system, narrative, storage and evidence contracts.
- `docs/PLAN-15-FIGMA-INTRO-DESIGN-SPRINT.md`: current opening and visual direction.
- `docs/PLAN-16-DIRECTOR-PRESENCE.md`: contextual presence, human typing and cancellation contract.
- `docs/PLAN-17-DIRECTOR-COMMENTARY-ENGINE.md`: implemented voice, variation and contextual-selection contract.
- `docs/CONTENT-AND-RELEASE.md`: replacing placeholders and launch checklist.
- `docs/ASSETS.md`: portrait and social-card provenance.

Historical but useful on demand:

- Plan 11 + Implementation/Audit 11: approved Home UI/WIP and corrected failure modes.
- Plan 12: framing and scroll-capture rationale; mandatory scope is superseded.
- Plan 13–14: historical rationale for causal opening, Spotlight and opt-in Follow; current opening/presence are superseded by Plans 15–16.

Superseded choreography, hero experiments and interim audits were removed after their durable decisions were consolidated. Git history remains the archive; a new Codex only needs the five-document route in `AGENTS.md` before acting.

## Run and validate

```bash
npm ci
npx playwright install chromium
npm run dev
npm run lint
npm test
npm run test:e2e
```

`npm test` includes the production build and server-rendered smoke tests. `test:e2e` covers intro, WIP/final, Spotlight, scroll restoration, functional AI/Playground controls, keyboard, axe, reduced motion, no-JS, memory, image failure and the Dark responsive matrix. `node tests/performance-audit.mjs <production-url>` records performance and overflow diagnostics.

## Before public launch

Replace fictitious cases and illustrative metrics, add final contact details and CV, validate ownership/confidentiality, set the real URL, run performance QA with final media and obtain Javier’s explicit approval before enabling indexation. `app/config.ts` remains the single release switch.
