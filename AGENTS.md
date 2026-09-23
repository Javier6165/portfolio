# Instrucciones del repositorio de la web

> **Actualización 23-09-2026 (posicionamiento):** el copy vigente presenta a Javier como `Lead Product Designer` para alinearse con LinkedIn y su búsqueda actual. Prevalece sobre las referencias a `Senior` como objetivo en Plan 18 y documentos anteriores. Conserva los cargos históricos de los casos, las citas literales y el borrador `Senior → Lead` de la intro. El cambio se puede revertir si Javier modifica el objetivo profesional.

> **Actualización 23-09-2026 (motion/layout):** `docs/PLAN-22-EDITORIAL-MOTION-AND-CASE-LAYOUT.md` gobierna el layout actual de los casos y el motion editorial ligero. `MotionController.tsx` se reactivó con entrada breve por ruta y reveals acotados; durante la entrada establece `data-site-entrance="active"` para pausar el cursor. Preserva contenido visible sin JavaScript y con reduced motion. Sigue siendo preview local hasta aprobación de Javier.

> **Actualización 23-09-2026 (casos):** `docs/PLAN-21-CASE-STUDIES-DRAFT.md` registra los tres case studies actuales, sus fuentes editables y las verificaciones pendientes. LogicX y Backoffice Design System muestran capturas provisionales suministradas por Javier; Casino Customizer usa imágenes reales. Lab permanece oculto. La publicación de esta combinación queda autorizada para el proyecto Sites existente, manteniendo acceso por enlace y noindex.

> **Actualización 23-09-2026:** Javier ha aprobado rescatar una intro Figma breve y una presencia ambiental de cursor, sin Follow ni guion obligatorio. Contrato actual en `docs/PLAN-20-STUDIO-PRESENCE.md`, que prevalece sobre las prohibiciones de intro/Director de Plan 19 y sobre la arquitectura antigua de Planes 15–17. Plan 19 conserva el sistema visual light; Plan 18 conserva contenido y orden. Comentarios y microajustes son provisionales. La futura animación de entrada deberá suspender la presencia mediante `data-site-entrance="active"`.

> **Actualización 20-09-2026:** `docs/PLAN-19-STATIC-HOME-DESIGN-SYSTEM.md` sustituye para la Home todas las reglas de apariencia Dark, Live File, Director, Follow y motion de este documento. La Home nueva es clara y estática; no cargues las capas narrativas. Plan 18 continúa gobernando contenido y orden. Protecciones de evidencia, privacidad, preview y QA siguen vigentes. Los interiores de casos y rutas secundarias se revisarán por separado.

> **Actualización 19-09-2026:** lee también `docs/PLAN-18-HOME-CONTENT-RESTRUCTURE.md` antes de modificar la Home. El plan de contenido aprobado prevalece sobre los contratos antiguos de Live File, Director, Follow y la arquitectura anterior. Están desactivados en el render por defecto; no los restaures sin nueva aprobación. Las reglas de integridad de evidencia, privacidad, preview y QA de este documento siguen vigentes.

## Lectura mínima antes de editar

Lee, en este orden:

1. `README.md`
2. `docs/PROJECT-CONTEXT.md`
3. `docs/DECISIONS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/PLAN-15-FIGMA-INTRO-DESIGN-SPRINT.md`
6. `docs/PLAN-16-DIRECTOR-PRESENCE.md`
7. `docs/PLAN-17-DIRECTOR-COMMENTARY-ENGINE.md` si la tarea afecta a voz, variedad o selección de comentarios; es el contrato editorial vigente del Director.
8. `docs/PLAN-18-HOME-CONTENT-RESTRUCTURE.md` y `docs/PLAN-19-STATIC-HOME-DESIGN-SYSTEM.md` para Home, contenido y lenguaje visual actuales.
9. `docs/PLAN-20-STUDIO-PRESENCE.md` si la tarea afecta a intro/cursor; `docs/PLAN-21-CASE-STUDIES-DRAFT.md` si afecta a casos.
10. `docs/PLAN-22-EDITORIAL-MOTION-AND-CASE-LAYOUT.md` si afecta a motion o al layout de casos.

Después, según la tarea:

- `docs/CONTENT-AND-RELEASE.md` para casos reales, contacto o lanzamiento;
- `docs/ASSETS.md` si vas a tocar imágenes;
- Plan 11 + Implementation/Audit 11 para UI/WIP y fallos ya resueltos;
- Plan 12 solo para el razonamiento histórico de captura/reencuadre;
- Plan 13 para la apertura causal y el origen del patrón comment-first.

Planes 15–17 y `DECISIONS.md` prevalecen ante cualquier contradicción con documentos históricos. Los documentos 07–10 anteriores fueron consolidados y retirados; Git conserva su historial.

## Contratos que debes preservar

- `app/config.ts` es la única fuente para URL y estado preview/público.
- Dark es la única dirección visual. No existe selector, `data-theme`, persistencia de apariencia ni set fotográfico Light; los nombres `*-system.*` que quedan son nombres históricos de los assets canónicos.
- `Live File` es la firma vigente. Sus estados visuales se resuelven con `data-narrative`, `data-motion`, `data-live-file` e `IntroPhase`; no conviertas GSAP en la fuente de verdad lógica.
- El hero semántico contiene nombre, posicionamiento, rol, retrato y `Explore`. El editor es decorativo y no puede ocultar ese contenido a lectores de pantalla ni dejarlo inaccesible sin JavaScript.
- `NarrativeProvider` es el único propietario de consentimiento, tiers, `guidedFirstVisit`, Replay y motion manual. `LiveSceneDirector` posee Follow/Spotlight y restauración de scroll. `DirectorPresence` posee observación local, cursor ambiental y edición humana. Planes 15–16 prevalecen para apertura y presencia.
- La memoria persistente solo se escribe tras `Allow`; `sessionStorage` puede evitar repetir la intro en la pestaña sin consentimiento.
- `.js-hero-reveal` y `.js-reveal` solo se ejecutan en rutas secundarias; Home pertenece exclusivamente al director Live File. Reduced motion resuelve final.
- Los estados viven en `data-live-state`; GSAP no es fuente de verdad. Preserva `wip → observing → spotlight-entering → editing → commenting? → settling → settled`.
- La intro Figma es la única secuencia obligatoria. Ninguna sección puede abrir Spotlight por scroll; Director ejecuta siempre una primera pasada Hero → Snapshot → vídeo → casos → Contact en orden documental. `Follow Javier` solo añade cámara y Spotlight a esa misma pasada.
- Spotlight es la única captura temporal de scroll autorizada. Debe conservar reduced motion, no focus trap y restauración exacta. Follow puede mover la cámara entre capítulos porque es explícito y se cancela en cualquier momento; fuera de Follow no existe auto-scroll.
- Director puede seleccionar y escribir headings, comentar o ejecutar ajustes pequeños de spacing, poster, crop, contraste, easing o píxeles. La primera pasada Hero → Contact es exclusivamente autoral y no admite inserciones contextuales; después su utility AI local puede combinar foco visitante y agenda propia. Nunca captura scroll, altera el copy semántico ni se reproduce en touch/reduced motion. El scroll no detiene la pasada autoral ni la rotación posterior: solo cancela una reacción contextual dirigida al visitante. Cualquier fallo apaga solo esta capa.
- La intro muestra `Senior Product Designer` como working title y un portrait placeholder; Javier arrastra el retrato canónico al frame antes del comentario y Present. La salida entrega inmediatamente el cursor a `hero-headline-indecision`: el working title permanece visible, selecciona `Senior`, escribe `Lead`, reconsidera el cargo, selecciona el titular completo, comete una errata y termina en el posicionamiento semántico. Solo entonces deja un comentario; no introduzcas un cooldown ni una nota previa entre Figma y esta primera edición.
- Los triggers contextuales del Director son reglas locales, no IA remota. `director-copy/sections.ts` concentra el copy ligado al contenido; `generic.ts` contiene voz reutilizable y `context.ts` las respuestas a sesión/acciones. Cambia los textos sin cambiar sus ids estables salvo que cambie también su significado editorial. El comportamiento observado siempre es efímero; solo tras `Allow` pueden persistir `visitCount` e ids opacos de variantes ya mostradas. Nunca guardes recorrido, puntero, dwell o acciones del visitante.
- Cada sección debe estar visualmente resuelta también en WIP. La desviación introduce un único detalle pequeño y legible —dos píxeles, un typo, crop, contraste, opacidad o easing— para que la escena se lea como pulido, nunca como rescate o sustitución de una sección rota. No uses un presenter genérico para fingir una edición.
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

Los cambios desplegables se publican como una nueva versión del mismo proyecto Sites mediante las skills de Sites. El preview actual es accesible por enlace y no indexable. El contrato vigente de producto y QA está en `DECISIONS.md` y Planes 15–17; Implementation/Audit 11 conserva los fallos históricos ya resueltos.
