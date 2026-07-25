# Arquitectura de la aplicación

## Capas

1. **Servidor y contenido:** rutas de `app/`, `app/data.ts` y HTML semántico.
2. **Sistema visual:** tokens/layout en `app/globals.css`; CSS Modules para Home, Live File y evidencia.
3. **Interacción cliente:** tema, narrativa, Spotlight, tabs, prototipos y settings.
4. **Infraestructura Sites:** vinext, worker, build y `.openai/hosting.json`.

## Rutas

- `/`: Home Live File.
- `/about`: trayectoria, capacidades y contacto temporal.
- `/playground`: exploración conceptual.
- `/work/[slug]`: plantilla de casos desde `projects`.
- `not-found.tsx`: 404 editorial.
- `sitemap.ts` y `robots.ts`: derivados de `app/config.ts`.

## Bootstrap pre-paint

El script inline de `layout.tsx` resuelve atributos sin cambiar markup:

- `data-theme`: `system` o `human` desde `javier-theme`.
- `data-motion`: sistema o ajuste manual.
- `data-narrative`: `first`, `return`, `familiar` o `static`.

El HTML cliente/servidor permanece idéntico. No leer storage durante el primer render React.

## Experience chrome

`PageProgress` actualiza `--page-progress`, densidad de header y capítulo actual mediante listener pasivo + `requestAnimationFrame`. El rail de ocho capítulos solo existe en Home desktop; móvil conserva header y menu. Los anchors usan `scroll-margin-top`; no hay smooth scroll ni timeline global de scroll.

## Live File

Directorio `app/components/live-file/`:

- `NarrativeProvider`: consentimiento, memoria, tiers, motion, Auto-follow, Replay intro y Replay live edits.
- `EditorIntro`: timeline del hero, skip, fallback de imagen y entrega final explícita.
- `LiveSceneDirector`: registro central, selección dominante, lectura, Spotlight, lock/restauración, cursor y cancelación.
- `LiveScene`: declaración de id, target, tool, propiedades, timings y estado visual.
- `EditorPrimitives`: selection frame, handles, property panel y comment thread.
- `SpotlightChrome`: dock, foco, progreso, Stop y hint de cancelación.
- `ExperienceSettings` / `MemoryConsent`: preferencias locales.

El servidor entrega cada escena en `settled`. Tras hidratación, el director la lleva a `wip` solo si es elegible. La máquina de atributos es:

```text
wip → observing → spotlight-entering → editing
    → commenting? → settling → settled
```

La lógica vive en React, refs y atributos; GSAP solo interpola cursor/intro. No hay ScrollTrigger por escena, auto-scroll ni queue.

Elegibilidad:

- intro terminada y Home activa;
- Auto-follow on y tier permitido;
- target visible por encima de `minVisibility`;
- centro dentro de zona segura;
- scroll estable `220–280 ms`;
- `readMs` cumplido;
- escena no vista en la sesión.

Spotlight fija `body`, compensa scrollbar, guarda `scrollY` y lo restaura al cerrar. Stop, Escape, PageDown, Space, touch, resize, pestaña oculta o segunda rueda interrumpen. No es modal y no atrapa foco.

## Home

Orden y escenas:

| Capítulo | Scene id | Verbo | Target principal |
| --- | --- | --- | --- |
| Snapshot | `snapshot-clarify` | clarify | facts |
| Work | `work-frame` | frame | media del primer case |
| Product practice | `practice-connect` | connect | workflow/viewer |
| AI | `ai-operationalise` | operationalise | pipeline/viewer |
| About | `about-reframe` | reframe | portrait |
| References | `testimonials-verify` | verify | ledger |
| Playground | `playground-experiment` | experiment | timeline |
| Contact | `footer-handoff` | handoff | contacto |

`app/HomePage.module.css` contiene composición y desviaciones WIP de las secciones server. `ProductPractice`, `AIPractice`, `Testimonials` y `PlaygroundStudy` son islands únicamente porque tienen controles reales.

## Motion progresivo

- Home: `EditorIntro` + `LiveSceneDirector` son la partitura exclusiva.
- Rutas secundarias: `MotionController` importa ScrollTrigger dinámicamente y activa `.js-hero-reveal` / `.js-reveal`.
- Theme: `.theme-swap` usa GSAP para una transición breve.
- CSS resuelve hover, focus, tabs locales y presenters de estado.
- `data-motion="reduce"` desactiva intro, WIP, cursor, Spotlight, reveals y transiciones no esenciales.

## Memoria

Claves:

- local: `javier-narrative-consent`, `javier-narrative-memory-v1`, `javier-motion`, `javier-theme`;
- session: `javier-narrative-session-v1`, `javier-narrative-counted-v1`, `javier-live-scenes-v2`, `javier-auto-follow-v1`.

`NarrativeMemory` guarda schema, visitCount, seenCueIds, lastVisitAt y expiresAt. La persistencia de visita se activa solo con `Allow`. Auto-follow anterior al consentimiento es una preferencia de sesión.

## Temas y fotografías

ThemeToggle actualiza `data-theme`, `colorScheme`, `javier-theme` y `portfolio-theme-change`. Dark/Light comparten layout y fuentes. Hero y About montan AVIF/WebP responsive con JPEG fallback; CSS cruza opacidades sin cambiar geometría.

## References

`TestimonialSlot` es una unión discriminada:

- `placeholder`: perspective, title y prompt;
- `verified`: quote, name, role, source y `approvedForPublication: true`.

`Testimonials` implementa un tablist vertical con roving focus y un tabpanel. La preview no renderiza `<blockquote>` hasta que exista un slot verificado.

## Evidencia de casos

`CaseBlock` admite text, image, gallery, before-after, token-propagation, video, figma y prototype. Media exige alt/caption/aspect ratio; Figma/prototipos cargan tras interacción. Northstar usa un demostrador ficticio de propagación.

## Fallbacks

- Sin JavaScript: hero y escenas finales; navegación y CTAs operativos.
- Reduced motion: estado `reduced`, sin captura.
- Storage bloqueado: experiencia de sesión.
- Retrato fallido: intro cancelada.
- Embed fallido/no cargado: fallback local y caption.

## QA

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `node tests/performance-audit.mjs <url>`

La matriz incluye Dark/Light, cuatro viewports, axe, teclado, mobile, no-JS, reduced, storage, memoria, fallo de imagen, WIP/final, Spotlight y overflow.
