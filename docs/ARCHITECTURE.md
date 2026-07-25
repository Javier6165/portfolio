# Arquitectura de la aplicación

## Capas

1. **Servidor y contenido**: rutas de `app/`, `app/data.ts` y HTML semántico.
2. **Sistema visual**: `app/globals.css` para tokens/layout; CSS Modules para Live File y evidencia.
3. **Interacción cliente**: tema, motion, narrativa, tabs y case evidence.
4. **Infraestructura Sites**: vinext, worker, build y `.openai/hosting.json`.

## Rutas

- `/`: narrativa principal.
- `/about`: trayectoria, capacidades y contacto temporal.
- `/playground`: exploración conceptual.
- `/work/[slug]`: plantilla de casos desde `projects`.
- `not-found.tsx`: 404 editorial.
- `sitemap.ts` y `robots.ts`: derivados de `app/config.ts`.

## Bootstrap antes de paint

El script inline de `layout.tsx` resuelve solo atributos:

- `data-theme`: `system` o `human` desde `javier-theme`.
- `data-motion`: preferencia de sistema o ajuste manual.
- `data-narrative`: `first`, `return`, `familiar` o `static`.

No renderiza contenido distinto, por lo que servidor y cliente conservan el mismo HTML. No mover estas lecturas al primer render React: produciría flash de tema o diferencias de hidratación.

## Live File

`app/components/live-file/` contiene:

- `NarrativeProvider`: consentimiento, memoria, tiers, escenas vistas, replay y motion.
- `EditorIntro`: reducer visual, timeline transform-only, skip y fallos.
- `LiveSceneDirector`: cursor singleton, exclusión, MotionPath, fast-scroll y eventos de acción.
- `LiveScene`: declaración y trigger ScrollTrigger sobre anchors DOM reales.
- `ExperienceSettings` y `MemoryConsent`: controles locales.

Los estados lógicos viven en React/atributos. GSAP solo interpola. El contenido semántico del hero está en `EditorIntro`; chrome, selecciones, cursor, asset tray y comentarios son decorativos.

El inicio espera a que el retrato activo decodifique o un máximo de 350 ms. Un fallo cancela la secuencia y fija el hero final. En retorno la secuencia empieza inmediatamente y dura menos de dos segundos. El hero conserva geometría final durante toda la intro; el frame editor es solo un transform visual.

## Memoria

Claves:

- `javier-narrative-consent`
- `javier-narrative-memory-v1`
- `javier-narrative-session-v1`
- `javier-narrative-counted-v1`
- `javier-motion`

`NarrativeMemory` guarda únicamente schema, visitCount, seenCueIds, lastVisitAt y expiresAt. La persistencia se habilita tras `Allow`; sessionStorage funciona como fallback y no identifica al visitante.

## Motion progresivo

`MotionController` conserva `.js-hero-reveal`, `.js-reveal` y `.theme-swap`. Los reveals parten de contenido visible y nunca dejan transforms inline que anulen hover. `data-motion="reduce"` y `prefers-reduced-motion` eliminan intro, cues y transiciones no esenciales.

## Home y escenas

El hero termina antes de `#experience`. Home declara ocho `LiveScene` posteriores: Profile, Work, Expertise, AI, Playground, About preview, Testimonials y Footer. Cada una tiene verbo, target, duración, tier y estado final propios.

`LiveSceneDirector` garantiza una sola escena activa. ScrollTrigger arma la escena en `top 66%` desktop o `top 74%` touch y espera `450–750 ms` antes de intervenir. Ese estado `armed` deja leer primero la sección; los comentarios aparecen aproximadamente un segundo después de empezar la corrección. No hay scrub, pinning, snapping ni bloqueo. Fast-scroll, salida de viewport, pestaña oculta, retorno o escenas ya vistas fijan `settled`; reduced motion fija `reduced`. El límite de tres se aplica a comentarios prominentes —Profile, Work y AI—, no a las trazas silenciosas.

AI y Playground escuchan `portfolio-live-scene-play` y ejecutan controles React reales. Pointer/foco del visitante sobre cualquier escena gana y fuerza handoff. El contrato completo está en `IMPLEMENTATION-08-LIVE-FILE-SCORE.md`.

Testimonials es un componente de servidor y usa una unión discriminada en `app/data.ts`: `placeholder` conserva título/prompt sin atribución y `verified` exige quote, name, role, source y `approvedForPublication: true`. `Verify` solo presenta el estado de procedencia; no inventa prueba social ni vuelve esencial la animación.

## Temas

`data-theme` define tokens compartidos. ThemeToggle actualiza atributo, `colorScheme`, `javier-theme` y `portfolio-theme-change`.

Las fotografías de Hero y About comparten geometría, usan AVIF/WebP responsive con JPEG fallback y se intercambian por CSS para evitar saltos. Human añade Instrument Serif y una composición editorial propia; la semántica y el orden se mantienen.

## Evidencia de casos

`CaseBlock` admite:

- `text`, `image`, `gallery`, `before-after`;
- `token-propagation`;
- `video`, `figma`, `prototype`.

Cada bloque tiene id, eyebrow, título y descripción. Media exige alt/caption/aspect ratio. `CaseEvidence` renderiza el bloque y mantiene tabs con roving focus. Figma y prototipos muestran fallback local y solo crean el iframe tras interacción explícita.

Northstar usa `token-propagation` como demostrador ficticio. Los otros tipos están listos para contenido real; no crear condicionales por slug.

## Fallbacks

- Sin JavaScript: hero final, contenido, navegación y CTAs visibles.
- Reduced motion: resultado final inmediato.
- Storage bloqueado: experiencia de sesión sin persistencia.
- Retrato fallido: intro cancelada, identidad y navegación intactas.
- Embed no cargado: fallback y caption permanecen.

## QA

- `npm run lint`
- `npm test`: build + smoke tests de HTML.
- `npm run test:e2e`: coreografía, interacción real, teclado, axe, no-JS, reduced motion, memoria, fallo de imagen y matriz visual full-page.
- `node tests/performance-audit.mjs <url>`: intro, CLS/LCP local, transferencia, overflow y posiciones de secciones contra build de producción.

## Starter preservado

La infraestructura opcional D1/Drizzle/Auth proviene del starter, pero no participa en el portfolio. No añadas persistencia o login sin una necesidad aprobada y documentada.
