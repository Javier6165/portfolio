# Instrucciones del repositorio de la web

## Antes de editar

Lee, en este orden:

1. `README.md`
2. `docs/PROJECT-CONTEXT.md`
3. `docs/DECISIONS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/PLAN-11-LIVE-WIP-SPOTLIGHT.md`
6. `docs/IMPLEMENTATION-11-LIVE-WIP-SPOTLIGHT.md`
7. `docs/AUDIT-11-LIVE-WIP-SPOTLIGHT.md`
8. `docs/PLAN-12-GUIDED-FIRST-PASS.md`
9. `docs/CONTENT-AND-RELEASE.md`
10. `docs/ASSETS.md` si vas a tocar imágenes.

Los documentos 07–10 fueron consolidados y retirados; Git conserva su historial.

## Contratos que debes preservar

- `app/config.ts` es la única fuente para URL y estado preview/público.
- Dark es la única dirección visual. No existe selector, `data-theme`, persistencia de apariencia ni set fotográfico Light; los nombres `*-system.*` que quedan son nombres históricos de los assets canónicos.
- `Live File` es la firma vigente. Sus estados visuales se resuelven con `data-narrative`, `data-motion`, `data-live-file` e `IntroPhase`; no conviertas GSAP en la fuente de verdad lógica.
- El hero semántico contiene nombre, rol, retrato y `Explore`. El editor es decorativo y no puede ocultar ese contenido a lectores de pantalla ni dejarlo inaccesible sin JavaScript.
- `NarrativeProvider` es el único propietario de consentimiento, tiers, `guidedFirstVisit`, Replay y motion manual. `LiveSceneDirector` posee registro, orden requerido, reencuadre, Spotlight, cursor singleton, exclusión y restauración de scroll. El contrato vigente está en `PLAN-12-GUIDED-FIRST-PASS.md`.
- La memoria persistente solo se escribe tras `Allow`; `sessionStorage` puede evitar repetir la intro en la pestaña sin consentimiento.
- `.js-hero-reveal` y `.js-reveal` solo se ejecutan en rutas secundarias; Home pertenece exclusivamente al director Live File. Reduced motion resuelve final.
- Los estados viven en `data-live-state`; GSAP no es fuente de verdad. Preserva `wip → observing → spotlight-entering → editing → commenting? → settling → settled`.
- Primera visita: la escena requerida más temprana ya alcanzada se reencuadra y bloquea desde la lectura WIP; rueda, touch y teclado no cancelan. Visita recurrente: vuelve el target dominante y las salidas Skip/Escape.
- Spotlight es la única captura temporal de scroll autorizada. Debe conservar reduced motion, no focus trap y restauración exacta de la posición capturada. No añadas snap, cola entre capítulos o scroll global.
- Cada sección debe tener UI final fuerte y WIP inequívocamente peor. No uses un presenter genérico para fingir una edición.
- `CaseBlock` es la unión discriminada para evidencia. Figma y prototipos externos son click-to-load; no añadas iframes automáticos por slug.
- Los casos conceptuales deben seguir rotulados como ficticios.
- Testimonials permanece en estado preview hasta recibir fuentes reales. No conviertas un slot a `verified` sin cita aprobada, atribución, permiso de publicación y validación de Javier.
- `.openai/hosting.json` identifica el sitio existente; no cambies ni derives su `project_id`.

## Estilo de implementación

- Prefiere componentes de servidor; añade cliente solo si una interacción lo necesita.
- Usa tokens de `globals.css` y CSS Modules co-localizados para nuevos sistemas complejos.
- GSAP es el único motor de coreografía; CSS puede resolver hover, focus y microestados locales.
- Añade comentarios para fallbacks, privacidad o contratos entre archivos, no para narrar JSX evidente.
- Conserva navegación semántica, roving focus, skip link y estados de teclado/touch.
- No añadas smooth scroll, scroll-jacking global, canvas, WebGL o motion imprescindible para entender contenido. Spotlight es la única excepción acotada.

## Validación

Ejecuta `npm run lint` y `npm test`. Para cambios interactivos ejecuta también `npm run test:e2e`. La matriz Dark cubre 1440×900, 1280×800, 768×1024 y 390×844, axe, memoria, no-JS, reduced motion y fallos de imagen.

Los cambios desplegables se publican como una nueva versión del mismo proyecto Sites mediante las skills de Sites. El preview actual es accesible por enlace y no indexable. El contrato vigente de QA está en Plan 12 e Implementation/Audit 11.
