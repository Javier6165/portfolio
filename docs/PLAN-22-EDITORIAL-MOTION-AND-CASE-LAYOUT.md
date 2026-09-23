# Case-study layout and restrained editorial motion — 23-09-2026

## Visual assessment

The first case-study draft shared the Home's palette and typography, but repeated the same oversized heading / right-column paragraph / full-width media pattern through every chapter. With neutral image placeholders, that repetition created long grey intervals and weak chapter boundaries. Impeccable's layout scan reported no mechanical errors; browser review at desktop, tablet and mobile showed the hierarchy and rhythm problem.

The case template now places its lead visual beside the role/scope/collaboration facts, uses a compact numbered chapter index on larger screens, and separates chapters with a functional hairline and a more measured title scale. Media alternates width and alignment but remains plainly labelled where genuine product images are pending. The Customizer's real project imagery remains the visual lead.

## Motion thesis

One focal entry is allowed per route. On the Home, the Figma opening and cursor edit remain the focal sequence on a first visit; a return visit gets a short editorial entrance for hero copy and portrait. Case-study and About heroes enter once in under a second. Below the fold, lists, reading blocks and media reveal only when encountered, with small travel and no scroll capture, pinning, parallax or ambient loop. Hover feedback is limited to arrows, line weight and a slight visual shift in Selected Work.

The existing GSAP installation and the official local GSAP skills cover this implementation; no new package was required. `MotionController.tsx` owns these transitions and sets `data-site-entrance="active"` during focal page entry so `StudioPresence` can pause. Content is fully visible without JavaScript and under `prefers-reduced-motion: reduce`. Native scroll remains untouched.

## Verification

- Impeccable layout and motion detectors returned no findings on the changed targets.
- Browser review covered LogicX and Customizer at 1280×800 and 390×844, plus chapter media in the in-app browser.
- `npm run lint`, `npm test`, and `npm run test:e2e` passed; Playwright includes entry completion, Director resumption, case deep links and reduced-motion fallback.

The work remains a local preview until Javier approves publication of the current Plan 20 studio layer with it.
