---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/components/live-file/EditorIntro.tsx","app/components/live-file/LiveSceneDirector.tsx","app/components/live-file/SpotlightChrome.tsx"]
---

# Home visual sprint

## Scope and mode

- Primary target: `app/page.tsx`
- Mode: Experience, brand-first.
- Scope: first-visit Figma UI3 opening, Presentation handoff, hero, persistent experience chrome and the visual rhythm of Home. No new portfolio capabilities or factual content.

## Audience, job and action

Design, product and engineering leaders must identify Javier's seniority and point of view quickly, understand the Live File joke without instruction and then inspect the portfolio with full control. `Explore` remains the primary first-viewport action; Follow is optional and subordinate.

## Proof and content

- Real name, positioning, role and portrait lead.
- `I design the calm inside complex products.` is the final semantic hero headline.
- Cases and metrics remain visibly fictitious.
- References and contact remain provisional and must not gain invented proof.

## Constraints

- First visit: one mandatory opening of about `9 s`; portrait import, caught-working comment and movement to Present must each remain legible.
- Reduced motion, no-JS, touch and familiar visits reach the final portfolio safely.
- Native scroll after Presentation mode; no mandatory Snapshot or later scroll capture.
- Figma UI3 is a binding reference for the editor layer only.
- Reuse the approved main direction and existing Sites project; never change its access or indexing contract without explicit approval.

## Chosen direction

Figma UI3 interrupted working file → Living Editorial Dossier. The editor is deliberately authentic and recognizable, then disappears. Presentation mode is photographic, typographic and human: carbon field, warm bone-white, restrained cobalt selection language, integrated portrait, less pills/metadata and varied section pacing.

## Memorable moment

Javier's multiplayer cursor drags the canonical portrait into an empty frame, pauses to check it, acknowledges being caught working, travels to the real-looking Present control and clicks it. The selected artboard becomes the live portfolio without a cut to a different object; the working title then resolves through `Lead` into the final positioning.

## Approved composition

`.impeccable/mocks/figma-intro-b-editorial-closeup.png`

Carry forward the close hero scale and clear cursor-to-Present path from B, the realistic pages/layers context and comment treatment from C, and the complete bottom toolbar from A. Generated portraits are composition placeholders only; production uses Javier's existing canonical portrait.

## Implementation inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| UI3 editor shell | Fixed left layers panel, canvas, right properties, top collaboration/Present, bottom toolbar | Semantic DOM + CSS |
| Main artboard | Large selected hero frame that becomes the real portfolio | Existing React hero + CSS transforms |
| Javier portrait | Empty drop target resolves into the integrated right-side photographic field | Existing optimized portrait raster + decorative drag ghost |
| Selection and handles | Figma-blue frame geometry | DOM + CSS |
| Multiplayer cursor | Violet arrow, Javier name tag and cursor chat | DOM + CSS + existing GSAP timeline |
| Presentation handoff | Javier clicks Present; editor recedes and the same cursor changes `Senior` to `Lead`, then writes the final hero headline | Existing GSAP transform timeline + Director handoff |
| Follow access | Eight-second invitation in the right top-bar slot, then a violet `JO` avatar | Header portal + SpotlightChrome |
| Post-intro chrome | Free scroll, no mandatory Snapshot, discreet Follow, no right rail | Existing behavior simplified in React/CSS |
| Home rhythm | Fewer monumental headings, pills and micro-labels; warmer signal color | Global tokens + CSS Modules |

## Open decisions

- The first authored pass is fixed to document order. Every section now begins from a strong near-final composition and exposes only one micro-deviation: spacing, poster, crop, contrast, two-pixel alignment, typo, opacity or easing. After Contact, Director may roam silently through the repeatable subset; the headline resolution and poster swap remain one-off moments.
- Whether the published replacement should preserve or remove References once real content work resumes; outside this sprint.
