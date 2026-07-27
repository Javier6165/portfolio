# Decisiones vigentes

Este documento resume lo que necesita un colaborador si recibe solo el repositorio `site/`.

## Producto y narrativa

- Concepto: `Live File`. Javier hace una última pasada de criterio sobre un portfolio abierto; la web profesional sigue siendo el producto principal.
- Primer viewport: Javier Ortiz, Senior Product Designer, retrato y `Explore`. La explicación empieza en Snapshot.
- Posicionamiento: diseñador senior de sistemas y productos complejos, con responsabilidad reciente de lead y práctica explícita de AI + coded prototypes.
- Idioma principal: inglés.
- Orden de Home: Hero → Snapshot → Work → Product practice → AI-native workflow → About → References → Playground → Contact.
- Los casos actuales, escenarios, outcomes y métricas son ficticios y permanecen rotulados.
- References es una preview honesta. No contiene citas ni identidades inventadas; una recomendación futura exige fuente, atribución, permiso y aprobación.
- La capa de editor es decorativa. Ningún dato profesional depende de ver una animación o comentario.

## Dirección visual

- Grid editorial asimétrico de doce columnas y recomposición específica en móvil.
- Hero, About y Contact usan stages editoriales; Work/Practice/AI usan evidence viewers; References usa un ledger; Playground un shelf.
- Dark es la única dirección visual: grafito, señal lima, Instrument Sans + Fragment Mono y fotografía oscura. No existe tema alternativo ni selector.
- `Complexity Engine`, partículas, `Living Fold`, Three y R3F están retirados.
- UI de editor propia: frames, handles, property panels, asset treatment y comments. No copia la estructura ni el branding de Figma.

## Live WIP y Spotlight

- El resultado final se diseña antes que su desviación WIP. Cada escena debe mostrar una diferencia observable, no un highlight arbitrario.
- Gramática: `Notice → Follow → Select → Adjust → Comment? → Resolve → Return`.
- Estados: `settled → wip → observing → spotlight-entering → editing → commenting? → settling → settled`; reduced motion usa `reduced`.
- El director elige solo un target legible cuando supera su umbral de visibilidad y el scroll lleva estable `220–280 ms`; los targets altos no dependen de que su centro geométrico esté dentro del viewport.
- La primera visita abre con un loading breve, un comentario de Javier y una acción `Present` que causa la expansión al hero; no ofrece Skip salvo reduced motion o fallo.
- Snapshot, Work y Product practice usan `comentario sobre WIP → edición breve → comentario resuelto` y son los únicos tres capítulos obligatorios. AI, About, References, Playground y Contact usan el mismo patrón abreviado, pero son opcionales y saltable.
- No hay cola entre capítulos. En primera visita, la escena requerida más temprana ya alcanzada se reencuadra aunque el visitante la haya atravesado con fast scroll.
- La intro y cada Spotlight devuelven un estado desarmado: el siguiente capítulo exige un scroll nuevo del visitante. Los scroll/resize internos de restauración no cuentan como avance.
- En primera visita, Spotlight es obligatorio solo para los tres primeros capítulos: rueda, touch y teclas de scroll se contienen hasta terminar. Tras el tercero aparecen controles opcionales. En una visita recurrente consentida son opcionales desde el principio.
- No existe focus trap. El cursor visitante nunca se sustituye. Con pointer fino, Javier permanece conectado mediante avatar/estado y una partitura finita de microajustes; se pausa durante Spotlight y nunca captura scroll.
- Comentario máximo uno por escena, solo para explicar criterio, y visible al menos `1,3 s`.
- La primera visita explica la regla dentro del editor: `You caught me at “one last tweak”`; Javier pulsa `Present` antes de ceder el hero.
- Paneles y comentarios de Spotlight se anclan al viewport y se recolocan dentro de una zona segura. Una prueba geométrica verifica que no queden recortados.
- El dock de primera visita muestra retrato, conexión y `Three guided edits`. Tras el tercero cambia a presencia opcional con Replay y `Show finished file`.
- Las escenas vistas son session-only: la memoria persistente puede acortar la intro, pero nunca suprime Live File en una pestaña nueva.
- Una visita `familiar` muestra el hero final inmediatamente; no comprime el cursor en una animación sub-segundo que pueda parecer un destello.

## Tecnología

- Next.js 16 + React 19 sobre vinext/Sites y TypeScript estricto.
- CSS nativo + CSS Modules; GSAP Timeline/MotionPath como motor de Home.
- `MotionController` no ejecuta reveals genéricos en Home. ScrollTrigger se importa dinámicamente únicamente en rutas secundarias con `.js-reveal`.
- Sin Three.js, R3F, WebGL, Lenis, Motion, XState, React Flow o Liveblocks.
- `NarrativeProvider` controla consentimiento, tiers, `guidedFirstVisit`, motion y Replay. `LiveSceneDirector` controla orden requerido, reencuadre, timing, scroll lock y cursor.
- `CaseBlock` controla evidencia; Figma y prototipos externos solo cargan tras click.
- Sin base de datos, autenticación, analytics o persistencia remota.

## Accesibilidad y privacidad

- Contenido final semántico en servidor; duplicados WIP/editor fuera del árbol accesible.
- Skip real, skip link, foco visible, roving tabs, reflow móvil y scroll nativo.
- Reduced motion y no-JS resuelven directamente el resultado final sin Spotlight.
- `sessionStorage` evita repetir la intro y puede guardar Auto-follow en la pestaña.
- `seenCueIds` persistente conserva contexto de retorno, pero no decide la elegibilidad de las escenas; esa exclusión usa `javier-live-scenes-v2` en sessionStorage.
- `localStorage` de narrativa solo tras `Allow`, esquema 1 y expiración lógica de 90 días.
- La preferencia de memoria se ofrece después de los tres momentos guiados y `2,4 s` de calma. Se desmonta mientras Spotlight esté activo para no competir con la coreografía ni provocar layout shift.
- Sin cookies ni identificadores personales.

## Hosting

- Preview accesible para cualquiera con la URL en el proyecto Sites existente; `noindex`, `nofollow` y `robots.txt` siguen bloqueando indexación.
- Netlify es opción de lanzamiento, no migración aprobada.
- Nunca crear otro proyecto, habilitar indexación o conectar un dominio sin autorización explícita.

## Contrato de entrega

- Gates: `npm run lint`, `npm test` y `npm run test:e2e` para cambios interactivos.
- Matriz Dark: 1440×900, 1280×800, 768×1024 y 390×844; axe; teclado; mobile; reduced; no-JS; memoria; fallo de imagen.
- Documentos vigentes: `PLAN-11-LIVE-WIP-SPOTLIGHT.md`, `PLAN-12-GUIDED-FIRST-PASS.md`, `PLAN-13-NARRATIVE-VERTICAL.md`, `PLAN-14-HUMAN-AUDIT-PASS.md`, `IMPLEMENTATION-11-LIVE-WIP-SPOTLIGHT.md`, `AUDIT-11-LIVE-WIP-SPOTLIGHT.md`, `ARCHITECTURE.md` y `CONTENT-AND-RELEASE.md`.
- Los documentos 07–10 se consolidaron y retiraron para evitar contratos contradictorios; Git conserva el historial.

## Siguiente evolución

El siguiente salto no es añadir más efectos. Es reemplazar un case ficticio por evidencia real, recibir recomendaciones verificadas o retirar References del candidato público, añadir contacto/CV/LinkedIn y ejecutar QA cross-browser + CWV sobre media final.
