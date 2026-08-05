# Decisiones vigentes

Este documento resume lo que necesita un colaborador si recibe solo el repositorio `site/`.

> Plan 15 y ADR-028 son la dirección vigente desde el 30 de julio de 2026. Sustituyen las decisiones de intro, editor propio, Snapshot obligatorio y chrome persistente de Plan 14.

## Producto y narrativa

- Concepto: `Live File`. Javier hace una última pasada de criterio sobre un portfolio abierto; la web profesional sigue siendo el producto principal.
- Primer viewport: Javier Ortiz, `I design the calm inside complex products.`, Senior Product Designer, retrato y `Explore`. La explicación de evidencia empieza en Snapshot.
- Posicionamiento: diseñador senior de sistemas y productos complejos, con responsabilidad reciente de lead y práctica explícita de AI + coded prototypes.
- Idioma principal: inglés.
- Orden de Home: Hero → Snapshot → Meet me in 60 seconds → Work → Product practice → AI-native workflow → About → References → Playground → Contact.
- `Meet me in 60 seconds` es un atajo humano temprano. Participa en Live File solo mediante un cambio de poster; mientras no exista media real permanece rotulado como placeholder y no simula reproducción ni usa autoplay.
- Snapshot es una banda de cuatro señales, no un segundo manifiesto: nivel, experiencia, alcance `B2B platforms & systems` y práctica `AI + coded prototypes`.
- Product practice explica una secuencia concreta `Map → Frame → Prove`; AI se reduce a `Frame → Build → Validate` y muestra solo output y human check.
- Los casos actuales, escenarios, outcomes y métricas son ficticios y permanecen rotulados.
- References es una preview honesta del layout final. No contiene citas ni identidades inventadas; una recomendación futura exige fuente, atribución, permiso y aprobación.
- Playground se nombra como destino y enlaza al lab completo; no se presenta como una frase editorial abstracta.
- La capa de editor es decorativa. Ningún dato profesional depende de ver una animación o comentario.

## Dirección Plan 15 — vigente

- La primera visita abre durante aproximadamente `9 s` dentro de una recreación reconocible de Figma UI3. El hero parte de `Senior Product Designer`, `Portfolio WIP · Working title` y un frame de retrato vacío; Javier arrastra el retrato canónico, comprueba el drop, escribe su comentario en vivo, deja una pausa de lectura y activa personalmente `Present` con un recorrido deliberado.
- ADR-013 se sustituye en esta rama: cursor, comments, selection bounds, panels y Present adoptan deliberadamente la gramática visual de Figma para que el chiste se entienda sin explicación.
- La intro es la única secuencia obligatoria. Snapshot ya no captura scroll; cualquier Follow posterior es voluntario, cancelable y visualmente discreto.
- En Presentation mode desaparece el chrome de Figma. El portfolio debe sentirse editorial, fotográfico y humano, no como un dashboard ni como una herramienta persistente.
- La comparación con la versión anterior fue aprobada. Toda evolución debe preservar el contraste entre Figma durante la edición y la dirección editorial durante Presentation mode.

## Dirección visual

- Grid editorial asimétrico de doce columnas y recomposición específica en móvil.
- Hero, la introducción en vídeo y About usan stages editoriales; Atlas conserva el case dominante, Northstar/Pulse se comprimen como pruebas secundarias y cada case usa un campo visual inequívoco. Practice/AI usan artefactos planos y References un ledger de integridad compacto.
- References deja de competir como capítulo principal: permanece visible y honesto, pero sale de la navegación primaria hasta disponer de recomendaciones verificadas.
- Dark es la única dirección visual: grafito, hueso, latón apagado, Instrument Sans + Fragment Mono y fotografía oscura. No existe tema alternativo ni selector.
- `Complexity Engine`, partículas, `Living Fold`, Three y R3F están retirados.
- La capa de edición usa deliberadamente la gramática reconocible de Figma UI3; el portfolio en Presentation mode conserva identidad propia.
- El Hero usa Instrument Sans a ancho natural en tres líneas y ocupa el centro vertical del primer viewport; ya no aplica la firma condensada que lo convertía en caption del retrato.
- Home incorpora cinco entradas editoriales acotadas —columnas, corte de vídeo, case, split y timeline—. No existe un reveal genérico por sección y reduced motion conserva el estado final inmediato.

## Live WIP y Spotlight

- El resultado final se diseña antes que su desviación WIP. El portfolio debe seguir pareciendo terminado durante el WIP: cada escena introduce un único detalle observable y pequeño, no un highlight arbitrario ni un estado roto.
- Gramática: `Notice → Follow → Select → Adjust → Comment? → Resolve → Return`.
- Estados: `settled → wip → observing → spotlight-entering → editing → commenting? → settling → settled`; reduced motion usa `reduced`.
- Director mantiene dos planos: una primera agenda canónica Hero → Snapshot → vídeo → Work → resto de Home y un selector contextual limitado a targets visibles. La primera conserva los mismos beats visuales completos que Follow y termina antes de habilitar el segundo; ninguna reacción contextual puede hacer que la pasada inicial parezca aleatoria.
- Tras Northstar, la pasada corrige Practice `-2 px`, el typo `Valdiate` en AI, un crop de About apenas demasiado cerrado, la opacidad de `Source required`, el easing del Playground y la alineación del CTA final. Al terminar Contact, Director reutiliza los ajustes repetibles como microtrabajo silencioso y puede recorrerlos libremente; el gran titular y el swap del póster no se repiten.
- La primera visita abre con un loading breve, un comentario de Javier y una acción `Present` que causa la expansión al hero; no ofrece Skip salvo reduced motion o fallo.
- Ningún capítulo posterior a la intro es obligatorio. Snapshot, Work, Product practice, AI, About, References, Playground y Contact solo entran en Spotlight tras `Follow Javier`.
- No hay cola entre capítulos. En primera visita, la escena requerida más temprana ya alcanzada se reencuadra aunque el visitante la haya atravesado con fast scroll.
- La intro y cada Spotlight devuelven un estado desarmado: el siguiente capítulo exige un scroll nuevo del visitante. Los scroll/resize internos de restauración no cuentan como avance.
- Al salir de Present la navegación queda libre y el avatar ofrece Follow. No hay una segunda captura obligatoria en Snapshot.
- Al salir de Present, el cursor se entrega sin espera a `hero-headline-indecision`: conserva visualmente el working title, selecciona solo `Senior`, escribe `Lead`, deja que la alternativa se lea, selecciona el h1 completo, comete una errata y termina en el posicionamiento semántico. Es un beat deliberadamente largo: cada selección, alternativa, pausa y corrección debe poder leerse como una decisión humana. Es la continuación de la intro, no una acción ambiental elegible.
- No existe focus trap. El cursor visitante nunca se sustituye. Con pointer fino, Javier permanece conectado mediante avatar/estado, trabaja sobre coordenadas del documento y puede salir de cámara; se pausa durante Spotlight y nunca captura scroll.
- `DirectorPresence` mantiene una utility AI local. La primera pasada autoral es global, continua y ordenada; después puede rotar libremente. Visibilidad, centro, puntero, dwell y ritmo de scroll solo deciden cuándo insertar una respuesta contextual, nunca qué edit canónico viene después.
- Mover el puntero o hacer scroll puede aplazar o cancelar una reacción contextual, pero no detiene la agenda autoral ni la rotación posterior. Follow, Spotlight, pestaña oculta, touch, reduced motion, resize material o fallo sí transfieren o cancelan trabajo.
- Tras completar la primera pasada, un dwell claro o un trigger contextual puede acercar el cursor y comentar. Después vuelve al microtrabajo autónomo y debe completarlo antes de otro comentario contextual; sin Follow no mueve la cámara.
- Cada beat utiliza intercambios de apertura/resolución emparejados. Triggers adicionales responden a Allow/No thanks, visitas 1–5, etapas amplias de sesión, fast scroll, lectura pausada, final alcanzado, retorno arriba, cambio de dirección, vuelta de pestaña, revisita y salida de Follow. Son reglas locales con copy escrito, no IA generativa.
- El catálogo editorial se divide por mantenimiento: `director-copy/sections.ts` para copy ligado al contenido, `generic.ts` para voz independiente del contenido y `context.ts` para sesión/acciones. Los ids son estables; un cambio de redacción no cambia el id salvo que cambie su significado.
- El presupuesto contextual es adaptativo: dos comentarios en una sesión corta, cuatro al asentarse y crecimiento gradual hasta siete en una sesión larga. El silencio normal es `18 s`; respuestas directas de privacidad o control pueden anticiparse sin consumir ese presupuesto.
- Los cambios de copy se seleccionan y escriben carácter a carácter, con typo y backspace. El hero permite selecciones completas y varias alternativas; un espejo `aria-hidden` preserva el heading semántico y termina exactamente en su copy original.
- El scroll conserva comentarios y ediciones pertenecientes a la agenda autoral o al microtrabajo posterior: cámara y cursor pueden separarse mientras la misma tarea continúa. Solo una reacción contextual dirigida a la zona del visitante se desmonta al navegar. Director nunca mueve cámara ni sigue al viewport.
- Director es fail-open: el contexto de escenas tiene un modo pasivo y la presencia tiene boundary + circuit breaker. Un error apaga solo la simulación, restaura estilos y deja contenido, navegación y scroll operativos.
- Un target sticky solo es elegible en su zona narrativa. El wordmark no puede desplazar el gag correspondiente a Work, Snapshot u otra sección.
- Comentario máximo uno por escena, solo para explicar criterio. Intro, Director y Follow lo escriben carácter a carácter con cadencia irregular y, una vez completo, reservan al menos `1,25 s` de lectura. Como en Cursor Chat de Figma, el bocadillo nace junto al cursor y la flecha queda inmóvil mientras el mensaje está visible.
- El tono de la capa Live File es seco, autocrítico y amable; se ríe de hábitos de diseño, nunca de clientes, compañeros, accesibilidad, privacidad o resultados.
- La primera visita explica la regla dentro del editor: `You caught me at “one last tweak”`; Javier pulsa `Present` antes de ceder el hero.
- Los paneles de propiedades se anclan al target; los comentarios de Spotlight se anclan al cursor y eligen únicamente uno de cuatro lados seguros. Una prueba geométrica verifica proximidad y ausencia de recorte.
- Durante todo Follow, un marco violeta comparte color con cursor, avatar `JO` y selection bounds. Follow solo añade cámara y Spotlight: no cambia el orden ni desbloquea una clase superior de edición.
- Tras Present, una invitación temporal con progreso ofrece `Follow Javier` en la derecha de la top bar; al expirar o cerrarse queda el avatar violeta `JO`. Pulsarlo activa Follow; el mismo avatar, rueda, teclado o `Stop following` lo cancelan.
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
- Sites v33 es la versión publicada y validada al cierre del 5 de agosto de 2026. Añade una primera pasada estrictamente canónica antes del contexto, la invitación temporal de Follow en Presentation y el nuevo cierre editorial de Playground, además del resto del refinamiento acumulado de intro, copy y microajustes.
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
