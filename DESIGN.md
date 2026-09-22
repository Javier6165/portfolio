---
name: Javier Ortiz Portfolio
description: Light Swiss-editorial Home with precise product-system rhythm.
colors:
  canvas: "#F7F7F3"
  surface: "#FFFFFF"
  ink: "#171817"
  secondary-ink: "#555750"
  rule: "#D8DAD3"
  control-border: "#72766E"
  focus: "#5136B9"
typography:
  display:
    fontFamily: "Instrument Sans Variable, Helvetica Neue, Arial, sans-serif"
    fontWeight: 480
    lineHeight: 1.025
    letterSpacing: "-0.036em"
  body:
    fontFamily: "Instrument Sans Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "0px"
  media: "0px"
spacing:
  page: "clamp(1.25rem, 4.2vw, 4rem)"
  section: "clamp(6rem, 9vw, 9rem)"
  wide-section: "clamp(8rem, 11.5vw, 12rem)"
---

# Design system: Ordered by Design

The Home is a static, light, Swiss-editorial portfolio. Javier's real portrait, a strong typographic thesis and clearly separated professional evidence replace the former Dark / Live File world. It is an experience portfolio, but legibility and hiring decisions lead before spectacle. The current content order is fixed by [Plan 18](docs/PLAN-18-HOME-CONTENT-RESTRUCTURE.md); exact foundations, section recipes, accessibility, risks and implementation phases live in [Plan 19](docs/PLAN-19-STATIC-HOME-DESIGN-SYSTEM.md).

The canvas is a quiet near-white field; dark image plates and the real portrait carry contrast. One variable grotesk family is used consistently. Cards, numbered rails, repeated uppercase eyebrows, ornamental lines, false product screenshots and animated reveals are not part of this direction. Shapes are square; only focus and functional controls may use the violet signal. The Home is visible in its final state without JavaScript or scroll effects.

The shared light foundations cover Home and About via `app/ordered-home.css`. The Home's CSS Modules own its section compositions; About's trajectory now uses the same square, rule-led visual language. Playground and case-study interiors retain legacy styling until their own passes. The old Figma / Director components remain in the repository but are not rendered or bootstrapped.

Design review checkpoint: Javier chose the earlier light composition over the subsequent grid experiment and approved it for Sites publication on 20 September 2026. Case-study evidence, the final video, experiment assets, direct LinkedIn recommendation URLs, email and CV still require source material and approval. Motion remains a separate decision.

## Editorial refinement — 22 September 2026

This pass supersedes the decorative media treatment in Plan 21. Content, order, evidence labels and static rendering remain unchanged. Javier authorized implementation and publication on 22 September.

The Hero uses a deliberate three-line statement: “I design the calm / inside complex / products.” Instrument Sans remains the sole family; italic calm is the only display emphasis. Desktop type is 3.6–5.4rem, with 1.04 line-height and −.045em tracking. The portrait occupies columns 9–12, aligns to the lower edge of the text composition and has a simple 4:5 frame. Mobile recomposes the photo beneath the text, right aligned.

Work has a full-width primary visual followed by a three-part caption grid, then two equal secondary project fields. Each project has its own visual boundary and its own caption. The secondary visuals are explicitly illustrative studies, not product screenshots or evidence. Their distinct neutral palettes and proportions separate the projects without card chrome.

Testimonials use three equal columns at wide widths and a single reading column below 1000px. Quote size is restrained; attribution immediately follows each quote. No forced alignment creates blank space between the quote and its author.

Hero and About use different photographs. Chamfers, offset plates and registration corners have been removed: composition, typography and cropping carry the identity. Lab uses three smaller visual studies instead of repeating another oversized headline. FAQ has a split heading/list composition on wide screens, stacked on smaller screens.

Ordinary and wide section intervals create hierarchy; related elements remain closer together than separate sections. Square controls, visible focus, native disclosure behavior, reduced-motion support and noindex/nofollow remain intact. Director and animated reveals remain inactive.
