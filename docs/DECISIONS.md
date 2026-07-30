# Decisiones vigentes

Este documento resume lo que necesita un colaborador si recibe solo el repositorio `site/`.

> Plan 15 y ADR-028 son la dirección vigente desde el 30 de julio de 2026. Sustituyen las decisiones de intro, editor propio, Snapshot obligatorio y chrome persistente de Plan 14.

## Producto y narrativa

- Concepto: `Live File`. Javier hace una última pasada de criterio sobre un portfolio abierto; la web profesional sigue siendo el producto principal.
- Primer viewport: Javier Ortiz, `I design the calm inside complex products.`, Senior Product Designer, retrato y `Explore`. La explicación de evidencia empieza en Snapshot.
- Posicionamiento: diseñador senior de sistemas y productos complejos, con responsabilidad reciente de lead y práctica explícita de AI + coded prototypes.
- Idioma principal: inglés.
- Orden de Home: Hero → Snapshot → Work → Product practice → AI-native workflow → About → References → Playground → Contact.
- Los casos actuales, escenarios, outcomes y métricas son ficticios y permanecen rotulados.
- References es una preview honesta. No contiene citas ni identidades inventadas; una recomendación futura exige fuente, atribución, permiso y aprobación.
- La capa de editor es decorativa. Ningún dato profesional depende de ver una animación o comentario.

## Dirección Plan 15 — vigente

- La primera visita abre durante `3–4 s` dentro de una recreación reconocible de Figma UI3; Javier está editando, reconoce al visitante y activa personalmente `Present`.
- ADR-013 se sustituye en esta rama: cursor, comments, selection bounds, panels y Present adoptan deliberadamente la gramática visual de Figma para que el chiste se entienda sin explicación.
- La intro es la única secuencia obligatoria. Snapshot ya no captura scroll; cualquier Follow posterior es voluntario, cancelable y visualmente discreto.
- En Presentation mode desaparece el chrome de Figma. El portfolio debe sentirse editorial, fotográfico y humano, no como un dashboard ni como una herramienta persistente.
- La comparación con la versión anterior fue aprobada. Toda evolución debe preservar el contraste entre Figma durante la edición y la dirección editorial durante Presentation mode.

## Dirección visual

- Grid editorial asimétrico de doce columnas y recomposición específica en móvil.
- Hero, About y Contact usan stages editoriales; Work/Practice/AI usan evidence viewers; References usa un ledger; Playground un shelf.
- Dark es la única dirección visual: grafito, hueso, latón apagado, Instrument Sans + Fragment Mono y fotografía oscura. No existe tema alternativo ni selector.
- `Complexity Engine`, partículas, `Living Fold`, Three y R3F están retirados.
- La capa de edición usa deliberadamente la gramática reconocible de Figma UI3; el portfolio en Presentation mode conserva identidad propia.

## Live WIP y Spotlight

- El resultado final se diseña antes que su desviación WIP. Cada escena debe mostrar una diferencia observable, no un highlight arbitrario.
- Gramática: `Notice → Follow → Select → Adjust → Comment? → Resolve → Return`.
- Estados: `settled → wip → observing → spotlight-entering → editing → commenting? → settling → settled`; reduced motion usa `reduced`.
- El director elige solo un target legible cuando supera su umbral de visibilidad y el scroll lleva estable `220–280 ms`; los targets altos no dependen de que su centro geométrico esté dentro del viewport.
- La primera visita abre con un loading breve, un comentario de Javier y una acción `Present` que causa la expansión al hero; no ofrece Skip salvo reduced motion o fallo.
- Ningún capítulo posterior a la intro es obligatorio. Snapshot, Work, Product practice, AI, About, References, Playground y Contact solo entran en Spotlight tras `Follow Javier`.
- No hay cola entre capítulos. En primera visita, la escena requerida más temprana ya alcanzada se reencuadra aunque el visitante la haya atravesado con fast scroll.
- La intro y cada Spotlight devuelven un estado desarmado: el siguiente capítulo exige un scroll nuevo del visitante. Los scroll/resize internos de restauración no cuentan como avance.
- Al salir de Present la navegación queda libre y el avatar ofrece Follow. No hay una segunda captura obligatoria en Snapshot.
- Al salir de Present, el cursor se entrega sin espera a `hero-headline-indecision`: selecciona el h1 completo, prueba nombre y rol, comete una errata y termina en el posicionamiento semántico. Este beat es la continuación de la intro, no una acción ambiental elegible.
- No existe focus trap. El cursor visitante nunca se sustituye. Con pointer fino, Javier permanece conectado mediante avatar/estado y una partitura finita de microajustes; se pausa durante Spotlight y nunca captura scroll.
- `DirectorPresence` mantiene una utility AI local con estados `observing → considering → approaching → commenting/editing → cooldown`. Combina visibilidad, centro, puntero, dwell, velocidad de cursor y velocidad/dirección de scroll; el foco del visitante domina cuando es claro y un sesgo autoral pequeño permite que Javier conserve agenda propia.
- Fuera del handoff inicial, tras `0,85–1,2 s` sobre un target estable puede acercar el cursor, comentar y hacer un cambio pequeño; deja `6,5 s` de silencio y no repite beats en la pestaña.
- Cada beat utiliza un pool de aperturas y resoluciones. Triggers adicionales responden a Allow/No thanks, visitas 1–5, tiempo de sesión, fast scroll, lectura pausada, final alcanzado, retorno arriba y revisita. Son reglas locales con copy escrito, no IA generativa.
- Los comentarios contextuales se limitan a cuatro por pestaña y guardan `22 s` de silencio, salvo la respuesta directa a la decisión de memoria.
- Los cambios de copy se seleccionan y escriben carácter a carácter, con typo y backspace. El hero permite selecciones completas y varias alternativas; un espejo `aria-hidden` preserva el heading semántico y termina exactamente en su copy original.
- Cualquier scroll cancela cursor, comentario y edición en la misma tarea; Director nunca mueve cámara ni sigue al target mientras se desplaza.
- Director es fail-open: el contexto de escenas tiene un modo pasivo y la presencia tiene boundary + circuit breaker. Un error apaga solo la simulación, restaura estilos y deja contenido, navegación y scroll operativos.
- Un target sticky solo es elegible en su zona narrativa. El wordmark no puede desplazar el gag correspondiente a Work, Snapshot u otra sección.
- Comentario máximo uno por escena, solo para explicar criterio, y visible al menos `1,3 s`.
- El tono de la capa Live File es seco, autocrítico y amable; se ríe de hábitos de diseño, nunca de clientes, compañeros, accesibilidad, privacidad o resultados.
- La primera visita explica la regla dentro del editor: `You caught me at “one last tweak”`; Javier pulsa `Present` antes de ceder el hero.
- Paneles y comentarios de Spotlight se anclan al viewport y se recolocan dentro de una zona segura. Una prueba geométrica verifica que no queden recortados.
- Pulsar el avatar activa `Follow Javier`; el mismo avatar, rueda, teclado o `Stop following` lo cancelan.
- Las escenas vistas son session-only: la memoria persistente puede acortar la intro, pero nunca suprime Live File en una pestaña nueva.
- Una visita `familiar` muestra el hero final inmediatamente; no comprime el cursor en una animación sub-segundo que pueda parecer un destello.

## Tecnología

- Next.js 16 + React 19 sobre vinext/Sites y TypeScript estricto.
- CSS nativo + CSS Modules; GSAP Timeline/MotionPath como motor de Home.
- `MotionController` no ejecuta reveals genéricos en Home. ScrollTrigger se importa dinámicamente únicamente en rutas secundarias con `.js-reveal`.
- Sin Three.js, R3F, WebGL, Lenis, Motion, XState, React Flow o Liveblocks.
- `NarrativeProvider` controla consentimiento, tiers, `guidedFirstVisit`, motion y Replay. `LiveSceneDirector` controla Follow/Spotlight; `DirectorPresence` controla observación y presencia ambiental no bloqueante.
- `CaseBlock` controla evidencia; Figma y prototipos externos solo cargan tras click.
- Sin base de datos, autenticación, analytics o persistencia remota.

## Accesibilidad y privacidad

- Contenido final semántico en servidor; duplicados WIP/editor fuera del árbol accesible.
- Skip real, skip link, foco visible, roving tabs, reflow móvil y scroll nativo.
- Reduced motion y no-JS resuelven directamente el resultado final sin Spotlight.
- `sessionStorage` evita repetir la intro y puede guardar Auto-follow en la pestaña.
- `seenCueIds` persistente conserva contexto de retorno y, con consentimiento, ids de variantes `director-copy:*`; no decide la elegibilidad de escenas ni guarda señales de comportamiento. Esa exclusión usa `javier-live-scenes-v2` en sessionStorage.
- `localStorage` de narrativa solo tras `Allow`, esquema 1 y expiración lógica de 90 días.
- Los tiers de visita se limitan a cinco. Rechazar memoria provoca una respuesta session-only y elimina la memoria narrativa; no se escribe ningún dato de comportamiento.
- La preferencia de memoria se ofrece después de Snapshot y `2,4 s` de calma. Se desmonta durante Spotlight y durante Follow para no competir con la coreografía ni provocar layout shift.
- Sin cookies ni identificadores personales.

## Hosting

- Preview accesible para cualquiera con la URL en el proyecto Sites existente; `noindex`, `nofollow` y `robots.txt` siguen bloqueando indexación.
- Netlify es opción de lanzamiento, no migración aprobada.
- Nunca crear otro proyecto, habilitar indexación o conectar un dominio sin autorización explícita.

## Contrato de entrega

- Gates: `npm run lint`, `npm test` y `npm run test:e2e` para cambios interactivos.
- Matriz Dark: 1440×900, 1280×800, 768×1024 y 390×844; axe; teclado; mobile; reduced; no-JS; memoria; fallo de imagen.
- Contrato vigente mínimo: `PROJECT-CONTEXT.md`, este documento, `ARCHITECTURE.md`, Plan 15 y Plan 16. `CONTENT-AND-RELEASE.md` y `ASSETS.md` se consultan según la tarea.
- Plan 11 y su Implementation/Audit documentan la base UI/WIP y fallos ya resueltos; Planes 12–13 conservan el razonamiento histórico que desembocó en Plan 14, pero no prevalecen sobre él.
- Los documentos 07–10 se consolidaron y retiraron para evitar contratos contradictorios; Git conserva el historial.

## Siguiente evolución

El siguiente salto no es añadir más efectos. Es reemplazar un case ficticio por evidencia real, recibir recomendaciones verificadas o retirar References del candidato público, añadir contacto/CV/LinkedIn y ejecutar QA cross-browser + CWV sobre media final.
