# Decisiones vigentes

Este documento resume lo que un colaborador necesita si recibe solo el repositorio `site/`.

## Producto y narrativa

- Concepto: `Live File` dentro del sistema `Human / System`.
- Primer viewport: Javier Ortiz, Senior Product Designer, retrato y `Explore`; la explicación empieza en la segunda sección.
- Idioma principal: inglés.
- Posicionamiento: Senior Product Designer de sistemas complejos, con experiencia reciente de lead y práctica explícita de IA + prototipos con código.
- Los casos actuales son ficticios y permanecen rotulados.
- La narrativa del editor es decorativa: nunca comunica información necesaria.
- El guion transversal distingue escenas, comentarios y microinteracciones: una escena breve por sección, máximo tres comentarios prominentes después del hero y reproducción automática limitada por tier de visita.

## Dirección visual

- Grid editorial asimétrico de doce columnas en desktop; recomposición específica en móvil.
- `System`: Instrument Sans/Fragment Mono, oscuro, técnico y señal lima.
- `Human`: Instrument Serif, crema, cobalto/coral, más asimétrico y expresivo.
- El cambio de tema coordina tokens, tipografía, fotografía y tratamiento de componentes.
- `Complexity Engine`, partículas, controles sobre la foto y `Living Fold` están retirados.
- Live File usa chrome mínimo, frames, selecciones, handles, asset tray, cursor y comentarios propios; no copia Figma.

## Tecnología

- Next.js 16 + React 19 sobre vinext/Sites.
- CSS nativo + CSS Modules; GSAP Timeline/Flip/MotionPath como único motor de coreografía.
- Sin Three.js, R3F, WebGL, Lenis, Motion, XState, React Flow o Liveblocks.
- `NarrativeProvider` controla memoria, cues y motion manual.
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

Consulta `AUDIT-05-LIVE-FILE.md` e `IMPLEMENTATION-05-LIVE-FILE.md` para el razonamiento y los contratos completos.

## Partitura transversal aprobada

- Tesis: Javier deja el archivo abierto y hace una última pasada de criterio durante el recorrido.
- Gramática: `Frame → Select → Change → Settle → Hand off`.
- Un solo cursor global en desktop; touch halo y handles en móvil.
- Verbos de Home: `Compose`, `Clarify`, `Frame`, `Propagate`, `Activate`, `Experiment`, `Reframe` y `Hand off`.
- Profile, Work y AI son los únicos comentarios prominentes posteriores al hero.
- Work y AI son los picos principales; el resto mantiene continuidad con beats silenciosos.
- ScrollTrigger sustituirá al observer actual para triggers deterministas, sin scrub, pinning, snapping ni scroll-jacking.
- El contrato completo vive en `NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md` y aún no está implementado.
