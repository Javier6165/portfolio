---
name: Javier Ortiz Portfolio
description: A live working file that resolves into a restrained editorial portfolio.
colors:
  carbon-canvas: "#0d0e10"
  carbon-surface: "#16181b"
  carbon-raised: "#1d2024"
  bone-ink: "#f2f1eb"
  quiet-ink: "#a5a7a5"
  muted-brass: "#d6b66b"
  figma-blue: "#0d99ff"
  cursor-violet: "#9747ff"
typography:
  display:
    fontFamily: "Instrument Sans Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.8rem, 7.3vw, 6rem)"
    fontWeight: 560
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Instrument Sans Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Fragment Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "18px"
  lg: "28px"
spacing:
  page: "clamp(1.25rem, 3.2vw, 4rem)"
  section: "clamp(7rem, 13vw, 13rem)"
components:
  button-primary:
    backgroundColor: "{colors.bone-ink}"
    textColor: "{colors.carbon-canvas}"
    rounded: "0.7rem"
    padding: "0.85rem 1.3rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.muted-brass}"
    textColor: "{colors.carbon-canvas}"
    rounded: "0.7rem"
---

# Design System: Javier Ortiz Portfolio

## Overview

**Creative North Star: "The Interrupted Working File"**

The portfolio begins inside recognisable Figma UI3 while Javier is still refining the real hero. Activating Present removes the tool completely and reveals a dark editorial dossier; Figma is the setup, not the permanent skin.

The finished world is calm, exact and human: integrated monochrome photography, full-width editorial type, thin rules, carbon surfaces and one restrained brass accent. Interface theatre stays subordinate to Javier and his work.

**Key Characteristics:**

- Authentic white UI3 chrome only during the opening.
- Carbon, bone-white and muted-brass editorial presentation after Present.
- Native scrolling and optional guidance after the handoff.
- Flat, rule-led compositions instead of generic rounded cards.

## Colors

Carbon neutrals carry the portfolio; muted brass marks authorship and emphasis, while Figma blue and cursor violet belong only to editing states.

**The Rarity Rule.** Brass is an accent, not a wash. Figma colors never become general brand colors.

## Typography

**Display and Body Font:** Instrument Sans Variable. The Hero uses the family at its natural width so the positioning can share the stage with the portrait; tighter width-axis settings remain available only for secondary display moments.

**Label/Mono Font:** Fragment Mono for indexes, evidence labels and technical metadata.

Display type is compact and editorial; body copy remains neutral and readable. Tiny mono labels may act as texture only when decorative content is hidden from assistive technology.

**The Full-Width Statement Rule.** The Hero is a statement, not a caption: use Instrument Sans at natural width, no more than `6rem`, with three deliberate lines and enough horizontal reach to overlap the photographic field.

## Layout

The finished site uses a centered shell up to 100rem, a twelve-column editorial grid and generous section spacing. Major headings begin at the first column; supporting copy occupies the far-right columns. Project rows are separated by rules and whitespace rather than container fills.

Below 1000px navigation collapses; below 720px grid compositions become deliberate vertical sequences. The mobile hero keeps portrait, Javier's name, positioning statement, role and Explore within the first viewport. Figma's side panels disappear on small screens, but the file bar, selected frame, Present action, cursor/comment and bottom toolbar preserve the joke.

## Elevation & Depth

The portfolio is flat by default. Depth comes from tonal contrast, overlapping evidence layers and photography. Shadows are reserved for transient Figma chrome, cursor comments and floating controls.

**The Flat-After-Present Rule.** Once Present is active, permanent content should not look like a stack of app cards.

## Shapes

Editorial content uses straight edges and horizontal rules. Small radii support buttons and compact utilities; medium and large radii remain available for bounded product artefacts. Circles are reserved for avatars, presence and small status marks.

## Components

### Figma opening

The first-visit editor lasts about nine seconds. It begins with `Senior Product Designer`, a visible WIP label and an empty portrait frame. Javier drags the canonical portrait into that frame, checks the drop, types the caught-working comment beside the stationary cursor, then follows a deliberate path to Present. Return visits and reduced motion resolve immediately.

### Hero

The final hero leads with `I design the calm inside complex products.` in a full-width, three-line statement that overlaps the photographic field. Javier Ortiz is a compact brass identity marker and Senior Product Designer a quiet supporting line; portrait and Explore complete the viewport. The photograph is masked into the carbon canvas rather than placed in a card. This hierarchy is the landing point of a visible post-Present edit, not an unexplained copy swap.

### Home evidence rhythm

Snapshot is a compact hiring-signal band, not a second positioning statement. Selected work stays cardless, but Atlas, Northstar and Pulse use visibly different artefact fields and Pulse reverses the composition so case boundaries remain obvious. Product practice answers how Javier moves from ambiguity to evidence; the AI workflow is limited to Frame, Build and Validate with one output and one accountable human check per stage.

### References and Playground

References previews the final editorial measure without fabricating praise: pending states never render a blockquote or invented identity. Playground names itself as a separate lab in both heading and call to action; its experiment remains evidence of curiosity, not an ambiguous closing slogan.

### Navigation and actions

The header is transparent over the hero and becomes an opaque carbon surface after scroll. Primary buttons use bone-white on carbon and brass on hover. Links rely on underlines or restrained directional marks.

### Follow, cursor and comments

Follow Javier lives in the right side of the real top bar. Its first appearance is a short violet-collaborator invitation with a linear timeout; dismissal or expiry leaves only the `JO` avatar. Intro, Director and Follow share one fully opaque, sharp, filled Figma-style multiplayer cursor and the same violet angular name tag. Every collaborator comment is typed live in a Cursor Chat bubble attached directly to the arrow; the cursor stays still until its reading hold ends. On first visit, that cursor hands off directly from Present to the still-visible `Senior Product Designer`, selects only `Senior`, types `Lead`, lets the role read, then selects the full line and writes the positioning at human typing speed with a corrected typo. The Hero comment appears only after the edit resolves. The first authored pass then follows document order—Snapshot spacing, video poster, Atlas crop, Northstar contrast, Practice alignment, AI typo, About crop, References status contrast, Playground easing and Contact CTA—without idle gaps and can work outside the viewport. The portfolio is already compositionally sound in every WIP state: each beat introduces only one small, legible deviation. Only after that pass may the agenda roam freely through the repeatable micro-adjustment subset; the headline resolution and poster swap are one-off moments. Each autonomous beat uses the same complete WIP → inspect → adjust → verify action available in Follow. Follow adds camera and Spotlight—not different edits or a different order—and frames the viewport in the same violet used by the cursor, `JO` avatar and selection bounds. Scroll changes the camera and feeds context but never cancels authored or post-pass work; only a visitor-focused aside is disposable. Follow always exposes Stop.

## Do's and Don'ts

### Do:

- **Do** keep the opening recognisably Figma UI3 and the final portfolio recognisably Javier.
- **Do** preserve native scroll after Present and resolve instantly for reduced motion.
- **Do** use real portraits and keep fictitious cases and metrics visibly labelled.
- **Do** preserve `noindex, nofollow` and the existing Sites project until Javier authorises publication changes.

### Don't:

- **Don't** carry Figma chrome into the permanent page shell.
- **Don't** reintroduce neon lime, theme switching, generic card grids or oversized pill systems.
- **Don't** make Snapshot or any later edit mandatory.
- **Don't** publish an unverified reference or present a concept metric as a real result.
