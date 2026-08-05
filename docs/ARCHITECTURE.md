# Arquitectura de la aplicación

## Capas

1. **Servidor y contenido:** rutas de `app/`, `app/data.ts` y HTML semántico.
2. **Sistema visual:** tokens/layout en `app/globals.css`; CSS Modules para Home, Live File y evidencia.
3. **Interacción cliente:** narrativa, Spotlight, tabs, prototipos y settings.
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

- `data-motion`: sistema o ajuste manual.
- `data-narrative`: `first`, `return`, `familiar` o `static`.

El HTML cliente/servidor permanece idéntico. No leer storage durante el primer render React.

## Experience chrome

`PageProgress` solo actualiza el estado scrolled del header mediante listener pasivo + `requestAnimationFrame`. El rail de capítulos fue retirado. Los anchors usan `scroll-margin-top`; no hay smooth scroll ni timeline global de scroll.

## Live File

Directorio `app/components/live-file/`:

- `NarrativeProvider`: consentimiento, memoria, tiers, `guidedFirstVisit`, motion y Replay.
- `NarrativeContext`: identidad estable del contexto de memoria para que Fast Refresh no desacople provider y consumers.
- `EditorIntro`: recreación Figma UI3, working title decorativo, importación visible del retrato desde placeholder, bloqueo inicial, fallback de imagen y entrega final explícita mediante `Present`.
- `LiveSceneDirector`: registro central, orden requerido, reencuadre, lectura, Spotlight mandatory/opcional, lock/restauración y cursor.
- `LiveSceneContext`: identidad estable del contexto y fallback pasivo fuera del módulo que cambia con Fast Refresh.
- `DirectorPresence`: observación local de viewport/pausa, selección contextual, cursor ambiental, comentarios y escritura humana cancelable.
- `DirectorCommentary`: índice y selector puro; `director-copy/sections.ts` concentra el copy ligado al contenido, `generic.ts` la voz reutilizable, `context.ts` las respuestas a sesión/acciones y `types.ts` el esquema editorial estable.
- `commentTyping`: cadencia humana compartida y cálculo de duración para que Intro, Director y Follow escriban comentarios en vivo y dimensionen su pausa de lectura con la misma regla.
- `LiveScene`: declaración de id, target, tool, propiedades, timings y estado visual.
- `EditorPrimitives`: selection frame, handles, property panel y comment thread.
- `SpotlightChrome`: dock informativo o recurrente, número de edit, fase de observación, foco, progreso y panel/comment thread fijos; el panel de propiedades usa la geometría del target, mientras Cursor Chat usa la coordenada del cursor y uno de cuatro lados seguros.
- `ExperienceSettings` / `MemoryConsent`: preferencias locales.

El servidor entrega cada escena en `settled`. Tras hidratación, el director la lleva a `wip` solo si es elegible. La máquina de atributos es:

```text
wip → observing → spotlight-entering → editing
    → commenting? → settling → settled
```

La lógica vive en React, refs y atributos; GSAP solo interpola cursor/intro. No hay ScrollTrigger por escena, auto-scroll ni queue.

Fuera de Spotlight, `DirectorPresence` separa dos sistemas. Una primera agenda canónica recorre los targets en orden de documento y encadena los mismos beats completos de WIP → edición → settling que usa Follow, aunque queden fuera de cámara; solo después de completarla pasa a una rotación libre. Esa rotación excluye los momentos únicos de Hero y poster y conserva únicamente ajustes repetibles de baja amplitud. En paralelo, `IntersectionObserver` alimenta una utility AI con un blackboard efímero de visibilidad, puntero, velocidades, dirección, profundidad, pausa, revisita, tiempo de sesión y estado de pestaña. La máquina contextual `observing → considering → approaching → commenting/editing` permanece en escucha durante la primera agenda pero solo puede intervenir después de Contact. La única excepción de prioridad es el handoff de Present: `EditorIntro` deja coordenadas efímeras y un velo visual en `body.dataset`; Director los consume una vez al montar el espejo `Senior Product Designer`, selecciona el rango `Senior`, escribe `Lead` y después resuelve el titular completo sin ningún frame intermedio de copy final. Ninguno de los dos sistemas mueve la cámara. Los modos son `text`, `comment`, `nudge`, `spacing`, `swap`, `crop`, `contrast` y `easing`.

`DirectorCommentary` separa contenido y lógica. El catálogo contiene 220 líneas atómicas organizadas en intercambios editoriales con id estable, intención, registro, humor, compatibilidad, rareza y peso. Los beats de sección seleccionan apertura/resolución como pareja; los triggers cubren memoria, visitas 1–5, etapas de sesión, fast scroll, lectura pausada, final, retorno, cambio de dirección, vuelta de pestaña, revisita y salida de Follow. El selector filtra incompatibilidades, puntúa utilidad y novedad y penaliza fatiga de id, familia y registro. Una sesión corta admite hasta dos comentarios contextuales, una asentada hasta cuatro y una larga crece gradualmente hasta siete; el silencio estándar es `18 s`, con respuestas directas fuera del presupuesto normal.

Cursor, notas y espejos tipográficos viven en coordenadas absolutas del documento; el scroll mueve la cámara, no al colaborador. Intro, Director y Spotlight comparten `FigmaCursor`, una flecha violeta totalmente opaca con contorno blanco y name tag angular. `commentTyping` suministra una cadencia irregular común: cada comentario se monta vacío junto al cursor, se escribe con la flecha inmóvil y solo después comienza su hold. Un beat de texto mide el fragmento mediante `Range`, superpone un espejo `aria-hidden`, selecciona, escribe, comete un typo y lo corrige. En Hero la nota se difiere hasta resolver el copy para evitar comentario → edición → comentario. Spacing, swap, crop, contrast, nudge y easing ejecutan ciclos completos de inspección, ajuste y comprobación; no son saltos decorativos. El heading semántico permanece en DOM. Scroll actualiza el blackboard sin cancelar una tarea autoral o post-pass; únicamente desmonta una reacción `visitor-focus` o `contextual-response`. Resize material, pestaña oculta, Spotlight o Follow sí transfieren o cancelan la capa. Touch, `<=720 px` y reduced motion no ejecutan Director. `javier-director-beats-v1` recuerda ids completados tanto por Director como por Follow durante la pestaña.

La capa es fail-open. `LiveSceneContext` vive en un módulo estable separado para que provider y consumers no cambien de identidad durante Fast Refresh; además ofrece un valor pasivo que mantiene escenas finales ante cualquier desajuste transitorio. `DirectorPresence` añade un error boundary para render/lifecycle y un circuit breaker para su loop asíncrono; ambos eliminan solamente cursor, nota y efectos, nunca el contenido o el scroll.

Elegibilidad recurrente:

- intro terminada y Home activa;
- capa Live File activa;
- target visible por encima de `minVisibility`;
- centro dentro de zona segura;
- scroll estable `220–280 ms`;
- `readMs` cumplido;
- escena no vista en la sesión.

Después de la apertura no hay Spotlight obligatorio. `LiveSceneDirector` no evalúa escenas opcionales salvo que `followingRef` esté activo; `DirectorPresence` nunca bloquea ni reencuadra.

`Follow Javier` es una decisión explícita del visitante. `SpotlightChrome` porta su control dentro de `.site-header__actions`: primero muestra durante ocho segundos una invitación con barra lineal y después conserva solo el avatar violeta `JO`. No desbloquea beats distintos ni altera su orden: toma la misma edición de la primera agenda, marca el capítulo WIP, mueve la cámara al siguiente target y activa Spotlight. Al completar un capítulo comparte sus ids session-only con Director para que Stop no provoque una repetición. La duración se calcula como aproximación del cursor + escritura completa del comentario + hold + edición visible; la flecha no se mueve mientras Cursor Chat permanece abierto. Un marco perimetral `#9747ff` persiste durante todo Follow. Avatar, botón, rueda, touch o teclado pueden terminarlo. Fuera de este estado no hay auto-scroll ni Spotlight espontáneo.

Los movimientos internos de Follow se marcan como reposicionamiento y solo la partitura explícita puede iniciar el siguiente capítulo.

Spotlight fija `body`, compensa scrollbar, guarda la posición ya reencuadrada y la restaura al cerrar. El resize sintético que puede emitir el propio lock se ignora durante una guarda breve. No existe focus trap y reduced motion elimina toda captura.

El chrome co-localizado de `EditorPrimitives` sigue disponible para snapshots WIP/editing. Durante Spotlight, panel y comentario locales se ocultan y la copia viewport-owned garantiza que ambos queden dentro de `16–32 px` de margen incluso a `1280×720`. En móvil el mismo contrato se convierte en una bandeja inferior.

## Home

Orden y escenas:

| Capítulo | Scene id | Verbo | Target principal |
| --- | --- | --- | --- |
| Snapshot | `snapshot-clarify` | clarify | facts |
| Meet me in 60 seconds | `video-poster` | reframe | poster del vídeo |
| Work / crop | `work-crop` | frame | media de Atlas |
| Work / contrast | `work-contrast` | clarify | metadata de Northstar |
| Product practice | `practice-connect` | align | viewer `-2 px` |
| AI | `ai-operationalise` | correct | label `Validate` |
| About | `about-reframe` | reframe | portrait |
| References | `testimonials-verify` | clarify | status `Source required` |
| Playground | `playground-experiment` | refine | playhead / easing |
| Contact | `footer-handoff` | align | CTA final |

`Meet me in 60 seconds` se renderiza en servidor entre Snapshot y Work y pertenece al registro de `LiveScene` solo para cambiar su poster: empieza con el retrato de estudio y resuelve al plano actual con portátil. No expone un control falso mientras la media sea provisional. Snapshot corrige únicamente padding; Work separa el tanteo de crop de Atlas y el pequeño ajuste de contraste de Northstar. En la mitad inferior, Practice alinea el visor dos píxeles, AI corrige `Valdiate`, About respira un crop de `1.025×`, References eleva la opacidad del estado, Playground sustituye una llegada lineal y Contact alinea el CTA. No existen nubes, overlays o estados degradados que sustituyan la composición final.

## Motion progresivo

- Home: `EditorIntro` + `LiveSceneDirector` + `DirectorPresence` son la partitura exclusiva.
- `MotionController` añade en Home cinco entradas editoriales acotadas mediante `IntersectionObserver` y GSAP: facts, corte del vídeo, case dominante, split de About y timeline de Playground. El contenido es visible por defecto, cada tratamiento es distinto y se limpia al terminar para no competir con Live File.
- Rutas secundarias: `MotionController` importa ScrollTrigger dinámicamente y activa `.js-hero-reveal` / `.js-reveal`.
- CSS resuelve hover, focus, tabs locales y presenters de estado.
- `data-motion="reduce"` desactiva intro, WIP, cursor, Spotlight, reveals y transiciones no esenciales.

## Memoria

Claves:

- local: `javier-narrative-consent`, `javier-narrative-memory-v1`, `javier-motion`;
- session: `javier-narrative-session-v1`, `javier-narrative-counted-v1`, `javier-live-scenes-v2`, `javier-auto-follow-v1`, `javier-director-beats-v1`.

`NarrativeMemory` guarda schema, visitCount, seenCueIds, lastVisitAt y expiresAt. La persistencia de visita se activa solo con `Allow` y `visitTier` se limita a `1–5`. `seenCueIds` no suprime escenas: `javier-live-scenes-v2` limita cada escena una vez por pestaña y Replay limpia esa exclusión. Con consentimiento, los ids `director-copy:*` permiten priorizar variantes todavía no vistas; no guardan acciones, foco ni recorrido. Sin memoria, una pestaña nueva vuelve a ser primera visita.

`MemoryConsent` no aparece al terminar la intro. `NarrativeProvider` espera Snapshot y `2,4 s` antes de ofrecerlo; la superficie es fija y se desmonta durante Spotlight y Follow para no modificar geometría ni competir con la coreografía.

## Dirección visual y fotografías

Dark es la única dirección visual y `:root` define `color-scheme: dark`. No existe `ThemeToggle`, `data-theme`, evento o persistencia de apariencia. Hero y About montan un único retrato oscuro mediante AVIF/WebP responsive con JPEG fallback. El placeholder del vídeo usa una tercera toma claramente distinta, optimizada como JPEG local. Los nombres `*-system.*` son históricos, no representan un modo seleccionable.

## References

`TestimonialSlot` es una unión discriminada:

- `placeholder`: perspective, title y prompt;
- `verified`: quote, name, role, source y `approvedForPublication: true`.

`Testimonials` implementa un ledger compacto con tablist vertical, roving focus y un tabpanel. El estado pendiente enseña una medida editorial explícitamente rotulada como layout preview, nunca una cita simulada. No renderiza `<blockquote>` hasta que exista un slot verificado y no aparece en la navegación primaria mientras todas sus fuentes estén pendientes.

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

La matriz incluye Dark en cuatro viewports, axe, teclado, mobile, no-JS, reduced, storage, memoria, fallo de imagen, WIP/final, Spotlight y overflow.
