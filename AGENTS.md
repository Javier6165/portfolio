# Instrucciones del repositorio de la web

## Lectura mínima antes de editar

Lee, en este orden:

1. `README.md`
2. `docs/PROJECT-CONTEXT.md`
3. `docs/DECISIONS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/PLAN-14-HUMAN-AUDIT-PASS.md`

Después, según la tarea:

- `docs/CONTENT-AND-RELEASE.md` para casos reales, contacto o lanzamiento;
- `docs/ASSETS.md` si vas a tocar imágenes;
- Plan 11 + Implementation/Audit 11 para UI/WIP y fallos ya resueltos;
- Plan 12 solo para el razonamiento histórico de captura/reencuadre;
- Plan 13 para la apertura causal y el origen del patrón comment-first.

Plan 14 y `DECISIONS.md` prevalecen ante cualquier contradicción con documentos históricos. Los documentos 07–10 anteriores fueron consolidados y retirados; Git conserva su historial.

## Contratos que debes preservar

- `app/config.ts` es la única fuente para URL y estado preview/público.
- Dark es la única dirección visual. No existe selector, `data-theme`, persistencia de apariencia ni set fotográfico Light; los nombres `*-system.*` que quedan son nombres históricos de los assets canónicos.
- `Live File` es la firma vigente. Sus estados visuales se resuelven con `data-narrative`, `data-motion`, `data-live-file` e `IntroPhase`; no conviertas GSAP en la fuente de verdad lógica.
- El hero semántico contiene nombre, rol, retrato y `Explore`. El editor es decorativo y no puede ocultar ese contenido a lectores de pantalla ni dejarlo inaccesible sin JavaScript.
- `NarrativeProvider` es el único propietario de consentimiento, tiers, `guidedFirstVisit`, Replay y motion manual. `LiveSceneDirector` posee registro, orden requerido, reencuadre, Spotlight, presencia/cursor singleton, exclusión y restauración de scroll. Plan 14 prevalece para obligatoriedad, capítulos 04–08 y presencia continua; Plan 13 sigue definiendo la apertura.
- La memoria persistente solo se escribe tras `Allow`; `sessionStorage` puede evitar repetir la intro en la pestaña sin consentimiento.
- `.js-hero-reveal` y `.js-reveal` solo se ejecutan en rutas secundarias; Home pertenece exclusivamente al director Live File. Reduced motion resuelve final.
- Los estados viven en `data-live-state`; GSAP no es fuente de verdad. Preserva `wip → observing → spotlight-entering → editing → commenting? → settling → settled`.
- Primera visita: solo Snapshot es obligatorio. Después, ninguna sección puede abrir Spotlight por scroll; el visitante activa `Follow Javier` desde el avatar si quiere seguir la secuencia Work → Contact.
- Spotlight es la única captura temporal de scroll autorizada. Debe conservar reduced motion, no focus trap y restauración exacta. Follow puede mover la cámara entre capítulos porque es explícito y se cancela en cualquier momento; fuera de Follow no existe auto-scroll.
- La presencia ambiental puede ejecutar microgags de copy, assets, crop, easing o píxeles, pero nunca captura scroll, elige contenido esencial ni se reproduce en touch/reduced motion.
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
