# Decisiones vigentes

Este documento resume lo que un colaborador necesita si recibe solo el repositorio `site/`.

## Producto y narrativa

- Concepto: `Live File` con modos Dark / Light coordinados.
- Primer viewport: Javier Ortiz, Senior Product Designer, retrato y `Explore`; la explicación empieza en la segunda sección.
- Idioma principal: inglés.
- Posicionamiento: Senior Product Designer de sistemas complejos, con experiencia reciente de lead y práctica explícita de IA + prototipos con código.
- Los casos actuales son ficticios y permanecen rotulados.
- Testimonials es una preview explícita: no contiene citas ni identidades inventadas. Cada recomendación futura exige fuente, atribución, permiso y aprobación.
- La narrativa del editor es decorativa: nunca comunica información necesaria.
- El guion transversal distingue escenas, comentarios y microinteracciones: una escena breve por sección, máximo tres comentarios prominentes después del hero y reproducción automática limitada por tier de visita.
- El contenido siempre llega antes que el efecto: cada escena se arma al entrar, respira `450–750 ms` y solo entonces corrige. Los comentarios de Profile, Work y AI aparecen después de esa corrección, nunca al aterrizar.
- La orientación es chrome de producto, no una décima escena: cabecera fija, progreso global y capítulos laterales de Home en desktop. El scroll sigue siendo nativo.

## Dirección visual

- Grid editorial asimétrico de doce columnas en desktop; recomposición específica en móvil.
- `Dark` (`system` internamente): Instrument Sans/Fragment Mono, grafito y señal lima, con retratos oscuros.
- `Light` (`human` internamente): la misma tipografía, geometría, composición y motion; cambia a crema, azul/coral y retratos claros.
- El cambio de tema solo coordina tokens de color, `color-scheme` y fotografías. No admite excepciones tipográficas o estructurales.
- `Complexity Engine`, partículas, controles sobre la foto y `Living Fold` están retirados.
- Live File usa chrome mínimo, frames, selecciones, handles, asset tray, cursor y comentarios propios; no copia Figma.

## Tecnología

- Next.js 16 + React 19 sobre vinext/Sites.
- CSS nativo + CSS Modules; GSAP Timeline/MotionPath/ScrollTrigger como único motor de coreografía. La entrega del hero es transform-only; Flip ya no participa en esa transición.
- Sin Three.js, R3F, WebGL, Lenis, Motion, XState, React Flow o Liveblocks.
- `NarrativeProvider` controla memoria, escenas vistas y motion manual; `LiveSceneDirector` controla exclusión y timing de escenas.
- `CaseBlock` controla evidencia; iframes externos solo tras click.
- Sin base de datos, autenticación, analytics o persistencia remota.

## Accesibilidad y privacidad

- Hero final semántico; simulación `aria-hidden`.
- Skip real, foco visible, roving tabs, reflow a 320 px y scroll nativo.
- Reduced motion resuelve directamente al resultado final.
- `sessionStorage` puede evitar repetir la intro en la pestaña.
- `localStorage` de narrativa solo después de `Allow`, esquema 1, expiración lógica de 90 días.
- Sin cookies ni identificadores personales.

## Hosting

- Preview privado en el proyecto Sites existente de `.openai/hosting.json`.
- Netlify es una opción de lanzamiento, no una migración aprobada.
- Nunca crear un segundo proyecto, habilitar indexación o conectar dominio por iniciativa propia.

### Por qué se descartaron las direcciones anteriores

Los primeros recursos de wow resolvían impacto local, pero no explicaban el resto de la experiencia. `Living Fold` añadía un chunk cliente cercano a 866 KB y seguía siendo un hero aislado. Live File se eligió porque convierte el refinamiento en una gramática transversal y puede resolverse con DOM/CSS/GSAP, manteniendo semántica, responsive y fallback sin JavaScript. El razonamiento durable está aquí; las auditorías intermedias se retiraron del árbol activo y permanecen en Git.

Consulta `NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`, `IMPLEMENTATION-08-LIVE-FILE-SCORE.md` y `AUDIT-08-LIVE-FILE-TRANSVERSAL.md` para el contrato vigente.

## Siguiente evolución propuesta — todavía no implementada

`PLAN-11-LIVE-WIP-SPOTLIGHT.md` empieza por rediseñar la landing final: hero con stage editorial, Snapshot legible, Product practice como workflow real, AI como operating model con tools/outputs/guardrails, Testimonials como reference ledger y Playground después de la prueba profesional. Solo después crea estados WIP/final distintos, herramientas contextuales, comentarios y Follow mode. Spotlight solo podrá activarse con el target mayoritariamente visible y scroll estable; dura menos de cinco segundos, ofrece Stop/Escape, se interrumpe con una segunda intención de scroll y desaparece en reduced motion. Hasta completar y validar sus fases, los ADR y documentos 07–08 continúan describiendo la versión publicada.

## Partitura transversal aprobada

- Tesis: Javier deja el archivo abierto y hace una última pasada de criterio durante el recorrido.
- Gramática: `Frame → Select → Change → Settle → Hand off`.
- Un solo cursor global en desktop; touch halo y handles en móvil.
- Verbos de Home: `Compose`, `Clarify`, `Frame`, `Propagate`, `Activate`, `Experiment`, `Reframe`, `Verify` y `Hand off`.
- Profile, Work y AI son los únicos comentarios prominentes posteriores al hero.
- Work y AI son los picos principales; el resto mantiene continuidad con beats silenciosos.
- ScrollTrigger sustituye al observer anterior con triggers deterministas, sin scrub, pinning, snapping ni scroll-jacking.
- `PageProgress` puede leer scroll con listener pasivo + `requestAnimationFrame`; no es un segundo motor de animación ni controla la posición del visitante.
- El contrato completo vive en `NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md` y su implementación en `IMPLEMENTATION-08-LIVE-FILE-SCORE.md`.
