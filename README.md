# Javier Ortiz — Portfolio Preview 2

An editorial portfolio for a Senior Product Designer working on complex platforms, systems and AI-assisted workflows.

## Experience concept

- `System / Dark` and `Human / Light` themes swap both tokens and photography.
- English-first, asymmetric editorial layout.
- Three clearly labelled concept case studies.
- A theme-aware, interactive 3D `Complexity Engine` in the hero.
- An AI-assisted design practice demonstrated as a working interaction.
- Visual-first case openings and decision/evidence modules ready for real artefacts.
- Progressive motion with a reduced-motion fallback.
- Responsive Home, About, Playground, case template and 404.

## Content map

- Main narrative: `app/page.tsx`
- Concept case content: `app/data.ts`
- About: `app/about/page.tsx`
- Playground: `app/playground/page.tsx`
- Visual system and responsive rules: `app/globals.css`
- Local portraits and social preview: `public/`

## Documentation

- `AGENTS.md`: operational rules for future Codex sessions.
- `docs/PROJECT-CONTEXT.md`: original brief, profile and design response.
- `docs/DECISIONS.md`: current product and technical decisions.
- `docs/ARCHITECTURE.md`: routes, theme, motion and infrastructure contracts.
- `docs/CONTENT-AND-RELEASE.md`: replacing placeholders and launch checklist.
- `docs/ASSETS.md`: source and usage of portraits, favicon and social card.
- `docs/AUDIT-02-POSITIONING-AND-WOW.md`: research-backed proposal for stronger positioning, interaction, 3D/media and future case-study architecture.
- `docs/IMPLEMENTATION-02-SIGNATURE-EXPERIENCE.md`: what Preview 2 changed, why, and how to extend it safely.

## Run and validate

```bash
npm install
npm run dev
npm run lint
npm test
```

## Before public launch

Replace the concept cases and illustrative metrics, add final contact details and CV, set the real site URL, allow indexing, and run final browser/device accessibility and performance QA.

The single release switch is `app/config.ts`. Do not set `isPreview` to `false` until Javier explicitly approves public launch and indexing.
