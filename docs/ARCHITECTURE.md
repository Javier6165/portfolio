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
- `EditorIntro`: recreación Figma UI3, timeline del hero, bloqueo inicial, fallback de imagen y entrega final explícita mediante `Present`.
- `LiveSceneDirector`: registro central, orden requerido, reencuadre, lectura, Spotlight mandatory/opcional, lock/restauración y cursor.
- `LiveSceneContext`: identidad estable del contexto y fallback pasivo fuera del módulo que cambia con Fast Refresh.
- `DirectorPresence`: observación local de viewport/pausa, selección contextual, cursor ambiental, comentarios y escritura humana cancelable.
- `DirectorCommentary`: índice y selector puro; `director-copy/sections.ts` concentra el copy ligado al contenido, `generic.ts` la voz reutilizable, `context.ts` las respuestas a sesión/acciones y `types.ts` el esquema editorial estable.
- `LiveScene`: declaración de id, target, tool, propiedades, timings y estado visual.
- `EditorPrimitives`: selection frame, handles, property panel y comment thread.
- `SpotlightChrome`: dock informativo o recurrente, número de edit, fase de observación, foco, progreso y panel/comment thread fijos; calcula arriba/abajo y clamp horizontal desde la geometría real del target.
- `ExperienceSettings` / `MemoryConsent`: preferencias locales.

El servidor entrega cada escena en `settled`. Tras hidratación, el director la lleva a `wip` solo si es elegible. La máquina de atributos es:

```text
wip → observing → spotlight-entering → editing
    → commenting? → settling → settled
```

La lógica vive en React, refs y atributos; GSAP solo interpola cursor/intro. No hay ScrollTrigger por escena, auto-scroll ni queue.

Fuera de Spotlight, `DirectorPresence` separa dos sistemas. Una agenda global recorre targets explícitos de todo el documento y encadena microajustes silenciosos aunque queden fuera de cámara; no usa `considering` ni cooldown entre beats. En paralelo, `IntersectionObserver` alimenta una utility AI con un blackboard efímero de visibilidad, puntero, velocidades, dirección, profundidad, pausa, revisita, tiempo de sesión y estado de pestaña. La máquina contextual `observing → considering → approaching → commenting/editing` solo interrumpe la agenda cuando una señal o un dwell claro justifican volver a la zona visible. Después debe ocurrir trabajo autónomo antes de otra intervención contextual. La única excepción es el handoff de Present: `EditorIntro` deja coordenadas efímeras en `body.dataset` y Director consume una vez `hero-headline-indecision` sin cooldown. Ninguno de los dos sistemas mueve la cámara. Los modos son `text`, `comment`, `nudge`, `crop` y `easing`; los cambios grandes de copy o asset quedan retirados.

`DirectorCommentary` separa contenido y lógica. El catálogo contiene 220 líneas atómicas organizadas en intercambios editoriales con id estable, intención, registro, humor, compatibilidad, rareza y peso. Los beats de sección seleccionan apertura/resolución como pareja; los triggers cubren memoria, visitas 1–5, etapas de sesión, fast scroll, lectura pausada, final, retorno, cambio de dirección, vuelta de pestaña, revisita y salida de Follow. El selector filtra incompatibilidades, puntúa utilidad y novedad y penaliza fatiga de id, familia y registro. Una sesión corta admite hasta dos comentarios contextuales, una asentada hasta cuatro y una larga crece gradualmente hasta siete; el silencio estándar es `18 s`, con respuestas directas fuera del presupuesto normal.

Cursor, notas y espejos tipográficos viven en coordenadas absolutas del documento; el scroll mueve la cámara, no al colaborador. Un beat de texto mide el fragmento mediante `Range`, superpone un espejo visual `aria-hidden`, selecciona, escribe con cadencia irregular y hace que el cursor acompañe el extremo escrito; puede volver a seleccionar el texto completo, comete un typo y lo corrige con backspace. Nudge, crop, easing y lectura incluyen también un gesto mínimo del cursor para que una secuencia activa nunca parezca congelada. El heading semántico permanece en DOM y conserva su accessible name. Scroll, resize, pestaña oculta, Spotlight o Follow cancelan síncronamente nota, overlay y estilos medidos, pero conservan la posición documental del cursor. Touch, `<=720 px` y reduced motion no ejecutan Director. `javier-director-beats-v1` recuerda solo ids ya vistos durante la pestaña.

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

`Follow Javier` es una decisión explícita del visitante. Marca los capítulos no vistos como WIP, mueve la cámara al siguiente target en orden DOM y activa su Spotlight. Al resolver, avanza al siguiente después de un descanso breve. Avatar, botón, rueda, touch o teclado pueden terminar Follow y fijan todas las secciones en final. Fuera de este estado no hay auto-scroll ni Spotlight espontáneo.

Los movimientos internos de Follow se marcan como reposicionamiento y solo la partitura explícita puede iniciar el siguiente capítulo.

Spotlight fija `body`, compensa scrollbar, guarda la posición ya reencuadrada y la restaura al cerrar. El resize sintético que puede emitir el propio lock se ignora durante una guarda breve. No existe focus trap y reduced motion elimina toda captura.

El chrome co-localizado de `EditorPrimitives` sigue disponible para snapshots WIP/editing. Durante Spotlight, panel y comentario locales se ocultan y la copia viewport-owned garantiza que ambos queden dentro de `16–32 px` de margen incluso a `1280×720`. En móvil el mismo contrato se convierte en una bandeja inferior.

## Home

Orden y escenas:

| Capítulo | Scene id | Verbo | Target principal |
| --- | --- | --- | --- |
| Snapshot | `snapshot-clarify` | clarify | facts |
| Meet me in 60 seconds | — | — | vídeo placeholder estático |
| Work | `work-frame` | frame | media del primer case |
| Product practice | `practice-connect` | connect | workflow/viewer |
| AI | `ai-operationalise` | operationalise | pipeline/viewer |
| About | `about-reframe` | reframe | portrait |
| References | `testimonials-verify` | verify | ledger |
| Playground | `playground-experiment` | experiment | timeline |
| Contact | `footer-handoff` | handoff | contacto |

`Meet me in 60 seconds` se renderiza en servidor entre Snapshot y Work. No pertenece al registro de `LiveScene`, no altera Follow y no expone un control falso mientras la media sea provisional. `app/HomePage.module.css` contiene composición y desviaciones WIP de las secciones server. `ProductPractice`, `AIPractice`, `Testimonials` y `PlaygroundStudy` son islands únicamente porque tienen controles reales.

## Motion progresivo

- Home: `EditorIntro` + `LiveSceneDirector` + `DirectorPresence` son la partitura exclusiva.
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

Dark es la única dirección visual y `:root` define `color-scheme: dark`. No existe `ThemeToggle`, `data-theme`, evento o persistencia de apariencia. Hero y About montan un único retrato oscuro mediante AVIF/WebP responsive con JPEG fallback. Los nombres `*-system.*` son históricos, no representan un modo seleccionable.

## References

`TestimonialSlot` es una unión discriminada:

- `placeholder`: perspective, title y prompt;
- `verified`: quote, name, role, source y `approvedForPublication: true`.

`Testimonials` implementa un ledger compacto con tablist vertical, roving focus y un tabpanel. La preview no renderiza `<blockquote>` hasta que exista un slot verificado y no aparece en la navegación primaria mientras todas sus fuentes estén pendientes.

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
