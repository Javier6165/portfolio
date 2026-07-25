# Plan 11 — Live File WIP + Spotlight

Fecha: 25 de julio de 2026.

Estado: **plan propuesto para la siguiente implementación; todavía no implementado**.

Alcance: Home completa, incluido el hero y las previews de proyecto. Los case studies interiores quedan fuera hasta una fase posterior y continúan usando contenido ficticio.

## 1. Veredicto

La implementación actual contiene una partitura técnicamente completa, pero no comunica con suficiente fuerza que el portfolio es un archivo vivo todavía en proceso.

Las causas observables son:

1. Las escenas duran entre `1,35` y `2,7 s`; cursor, selección, cambio y comentario compiten dentro de ese intervalo.
2. El estado inicial ya parece terminado. La mayor parte de los cambios son transforms, highlights o labels pequeños, no correcciones que el visitante pueda comparar.
3. Los comentarios aparecen solo en tres escenas y permanecen visibles durante una fracción del timeline.
4. Scroll rápido superior a `1.800 px/s` fuerza actualmente `settled`; el visitante ve el resultado final sin la causa.
5. El trigger depende del wrapper y de una línea de viewport, no de que el objeto editado esté suficientemente visible y estable.
6. El chrome contextual no explica qué propiedad se está modificando. El cursor actúa, pero el visitante no siempre puede leer la intención.

La siguiente fase no debe sumar más overlays al mismo sistema. Debe rediseñar cada sección como dos composiciones reales:

```text
WIP INTENCIONAL → EDICIÓN LEGIBLE → RESULTADO FINAL
```

## 2. Nueva tesis

> El visitante no recorre un portfolio terminado con adornos de editor. Entra en un archivo abierto y presencia la última pasada de criterio que lo convierte en producto.

El estado WIP será deliberado y reconocible, no una web rota:

- `LIVE FILE / WIP` permanece en el chrome ligero de Home;
- los objetos pendientes muestran frame label, selección, asset o propiedad sin resolver;
- el contenido profesional sigue siendo legible;
- cada corrección tiene una diferencia visual suficiente para recordarse sin explicación;
- el comentario aparece solo cuando añade el porqué.

La nueva gramática es:

```text
NOTICE → FOLLOW → SELECT → ADJUST → COMMENT → RESOLVE → RETURN
```

- `Notice`: la sección y su imperfección se ven antes de cualquier movimiento.
- `Follow`: Spotlight declara que el visitante está siguiendo a Javier.
- `Select`: un objeto concreto recibe frame y handles.
- `Adjust`: aparece la herramienta necesaria y cambia una propiedad visible.
- `Comment`: Javier explica criterio cuando la acción no basta por sí sola.
- `Resolve`: comentario y chrome se retiran; el estado final permanece.
- `Return`: el scroll y la interacción vuelven exactamente al visitante.

## 3. Spotlight: contrato de experiencia

Figma Spotlight permite seguir la vista, acciones y cursor de otra persona y muestra quién se está siguiendo, un borde de presencia y un control para detenerlo. Esta implementación conserva esa relación de seguimiento, no su interfaz literal. [Figma — Present to collaborators using spotlight](https://help.figma.com/hc/en-us/articles/360040322673-Present-to-collaborators-using-spotlight)

### 3.1 Cuándo puede empezar

Una escena solo será elegible si cumple simultáneamente:

- la intro ha terminado;
- no existe otra escena activa;
- el visitante no ha desactivado `Auto-follow`;
- el target real tiene al menos `68 %` visible en un pico o `58 %` en un beat corto;
- el centro del target está dentro de la zona segura entre cabecera + `32 px` y viewport − `48 px`;
- el scroll lleva estable al menos `220 ms`;
- la sección ha permanecido legible durante su `readMs` completo;
- la pestaña está visible y la ventana tiene foco.

No se hará auto-scroll para colocar una escena. Spotlight solo empieza cuando la composición ya está bien encuadrada. Por tanto, una acción nunca se reproduce por encima o por debajo de la zona que el visitante está mirando.

### 3.2 Fast scroll

Fast scroll deja de significar “marcar terminado”. El nuevo comportamiento será:

1. mientras exista velocidad alta, no comienza ninguna escena;
2. al detenerse, se calcula el único stage dominante del viewport;
3. solo ese stage puede iniciar lectura y Spotlight;
4. las secciones atravesadas no se marcan como vistas ni se reproducen fuera de pantalla;
5. si el visitante vuelve, conservan su oportunidad de mostrar WIP → final.

No se mantiene una cola de animaciones. Nunca se reproduce una escena atrasada porque el usuario haya llegado a otra sección.

### 3.3 Captura de atención

Durante la edición:

- se conserva la posición exacta y se bloquea el desplazamiento de la página;
- un borde cobalto/coral según tema recorre el viewport;
- cuatro scrims atenúan el exterior del stage sin aplicar blur al texto seleccionado;
- una barra superior muestra avatar `JO`, `Following Javier`, el nombre de la acción y `Stop following`;
- un progreso discreto comunica la duración restante;
- la captura dura entre `2,8` y `4,9 s`; nunca es indefinida;
- al terminar se restaura scroll sin salto ni cambio de anchura.

El primer gesto de rueda/touch durante Spotlight se contiene y revela `Scroll again to stop following`. Un segundo gesto deliberado dentro de `700 ms`, `Escape`, PageDown, Space o el botón `Stop following` cancelan la escena, fijan el resultado final y ejecutan la intención de navegación. El visitante siempre conserva una salida inmediata.

No hay focus trap ni foco programático. Spotlight no es un modal. El control Stop es un botón real y la página conserva su orden de foco.

### 3.4 Entrada en Auto-follow

Al terminar el hero aparece una preferencia no bloqueante:

```text
LIVE FILE · Javier is still editing    Auto-follow on · Stop
```

No requiere aceptar para usar el portfolio. `Stop` fija todos los stages futuros en final durante la sesión. Tras consentimiento de memoria se puede recordar esta preferencia; antes de él solo vive en `sessionStorage`.

### 3.5 Accesibilidad

- `prefers-reduced-motion` y el ajuste manual eliminan Spotlight, cursor, scroll lock y estados WIP animados.
- Reduced motion y no-JS renderizan directamente la versión terminada.
- La versión semántica final existe siempre en servidor; las variantes WIP visuales son `aria-hidden` cuando duplican texto.
- El resultado final no depende de ver o completar la animación.
- Todos los movimientos automáticos pueden detenerse. W3C recomienda permitir desactivar motion no esencial y ofrecer pausa o stop a contenido automático. [WAI — Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) [WAI — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

## 4. Chrome contextual

No se construirá un editor completo. Se reutilizarán cinco primitives propias que recuerdan a una herramienta de diseño sin copiar Figma:

1. `SelectionFrame`: bounds, handles, nombre de layer y medidas.
2. `PropertyStrip`: tipografía, auto-layout, color o estado; máximo tres controles legibles.
3. `AssetTray`: asset local, thumbnail y drag source.
4. `TimelineStrip`: playhead, duración y easing.
5. `CommentThread`: pin, burbuja, respuesta breve y estado resuelto.

Reglas:

- solo se muestra el chrome necesario para entender esa corrección;
- entra después de seleccionar y sale antes de devolver el control;
- nunca tapa el heading, CTA ni contenido editado;
- cada panel tiene exactamente los valores que cambian; no contiene controles falsos irrelevantes;
- Dark y Light usan la misma geometría, tipografía, timing y componentes; solo cambian tokens y retratos.

## 5. Comentarios

El límite actual de tres comentarios deja de ser válido. El nuevo límite es editorial, no numérico:

- comentario solo cuando explica criterio, integridad o intención;
- máximo uno por escena;
- aparece después de que el cambio sea visible, nunca al aterrizar;
- permanece completamente legible un mínimo de `1,3 s`;
- usa pin anclado al objeto, no una pill genérica al borde del wrapper;
- se resuelve antes de cerrar Spotlight y deja únicamente un pequeño check si aporta continuidad.

Comentarios propuestos:

| Sección | Comentario |
| --- | --- |
| Hero | `Two pixels. Much better.` |
| Profile | `Keep the signal. Lose the résumé.` |
| Work | `Show the decision, not the decoration.` |
| Expertise | `Make the decision once. Let the system carry it.` |
| AI | `Screens explain it. Behaviour proves it.` |
| Testimonials | `No source, no quote.` |

Playground, About y Footer son autoexplicativos y cierran con status, no con otra burbuja.

## 6. Score sección por sección

| Acto | Estado WIP evidente | Acción de Javier | Herramienta | Estado final | Read + Spotlight |
| --- | --- | --- | --- | --- | --- |
| Hero / Compose | rol incompleto, frame de retrato vacío y asset fuera | termina rol, coloca retrato y corrige crop | Text strip + Asset tray | Hero final | `0,5 + 5,8–6,2 s`; sin scroll lock |
| Profile / Clarify | cuatro hechos comprimidos en un bloque denso y desalineado | divide y ordena en cuatro flashes | Auto-layout strip | `PROFILE / REFINED` | `1,4 + 4,4 s` |
| Work / Frame | primer caso con media vacía y screenshot fuera del frame | inserta asset, elige Fill y alinea capas | Asset tray + image properties | `CASE 01 / LIVE` | `1,6 + 4,8 s` |
| Expertise / Propagate | tres cards usan variables locales inconsistentes | cambia Local → Shared y propaga token | Variable popover | `1 CHANGE → 3 SURFACES` | `1,3 + 4,0 s` |
| AI / Activate | pantalla plana rotulada `STATIC FRAME` | cambia Design → Prototype y ejecuta regla | Prototype sidebar | `PROTOTYPE / LIVE` | `1,7 + 4,9 s` |
| Playground / Experiment | composición fuera de ritmo en `00:00` | arrastra playhead y aplica easing | Timeline strip | `EXPERIMENT / PLAYED` | `1,2 + 4,1 s` |
| About / Reframe | crop corta la mirada y desequilibra columnas | ajusta posición y escala de máscara | Image crop strip | `CROP / APPROVED` | `1,3 + 3,5 s` |
| Testimonials / Verify | cards parecen citas pese a no tener fuente | revisa status y retira lenguaje de quote | Content status panel + comment | `REFERENCES / SOURCE PENDING` | `1,5 + 4,4 s` |
| Footer / Hand off | archivo sigue en `Editing` y CTA no tiene señal | cambia a `Ready for review` y cede | File status menu | `PREVIEW READY / YOUR TURN` | `1,0 + 2,8 s` |

## 7. Storyboard detallado

### 7.1 Hero / Compose

El hero ya posee la idea correcta, pero necesita legibilidad temporal.

WIP:

- chrome de archivo visible desde el primer frame;
- `Senior Product Design_` dentro de una caja de texto activa;
- placeholder de retrato con checker sutil;
- chip `portrait_dark_02` o `portrait_light_02` en la bandeja.

Edición:

1. cursor termina `Designer`;
2. `PropertyStrip` confirma Instrument Sans y ajusta leading;
3. cursor arrastra el asset al frame;
4. el retrato aparece en Fill;
5. nudge de dos píxeles;
6. comentario y resolución;
7. chrome se retira y queda el hero profesional.

El nombre y el rol final continúan en el `<h1>` semántico desde servidor. `Skip intro`, scroll, Escape y fallo de imagen entregan el resultado final.

### 7.2 Profile / Clarify

WIP:

- la misma información real aparece visualmente como un párrafo demasiado largo;
- labels y valores no comparten columnas;
- layer label: `PROFILE_NOTES / DRAFT`.

Edición:

1. Javier selecciona el bloque completo;
2. `PropertyStrip` muestra `Auto layout · Vertical`, `Gap 0`, `Rows 1`;
3. activa `Split into 4`;
4. las cuatro filas ocupan la geometría final con stagger legible;
5. cambia gap y alinea labels;
6. comentario `Keep the signal. Lose the résumé.`;
7. resuelve y deja `PROFILE / REFINED`.

La diferencia principal no es movimiento: es pasar de una masa de CV a cuatro señales escaneables.

### 7.3 Selected Work / Frame

WIP:

- copy y CTA del primer case son legibles;
- el área de media es un drop zone vacío con checker;
- `atlas_rule_builder_v04` espera en `AssetTray`;
- capas back/mid están visiblemente desalineadas.

Edición:

1. Javier arrastra el asset al drop zone;
2. la imagen entra inicialmente en Fit y deja espacio incorrecto;
3. aparece el panel `Image · Fit / Fill / Crop`;
4. Javier selecciona Fill y ajusta el encuadre;
5. las capas encajan detrás del frame;
6. `Open case study` pasa a ready;
7. comentario `Show the decision, not the decoration.`;
8. final `CASE 01 / LIVE`.

Las otras dos cards no repiten autoplay. Hover, foco o touch pueden mostrar su frame/asset label manualmente.

### 7.4 Expertise / Propagate

WIP:

- las tres cards tienen la misma estructura pero variables locales distintas;
- accent, radio y espaciado muestran una inconsistencia deliberada pero legible;
- token superior: `Decision model · Local`.

Edición:

1. Javier selecciona las tres instancias;
2. abre `VariablePopover`;
3. cambia scope `Local` → `Shared`;
4. una dependency line confirma propagación;
5. accent, radio y spacing se sincronizan por orden;
6. comentario sobre decidir una vez;
7. final `1 CHANGE → 3 SURFACES`.

Los valores WIP se derivan de tokens por tema. Light y Dark muestran la misma inconsistencia y la misma resolución con colores propios.

### 7.5 AI + code / Activate

WIP:

- la preview es una imagen/plano visual con label `STATIC FRAME`;
- el step `Frame` está seleccionado;
- los controles funcionales no parecen disponibles todavía.

Edición:

1. Javier selecciona la preview;
2. aparece una sidebar contextual con tabs `Design / Prototype`;
3. cambia a `Prototype`;
4. añade `On click → Run simulation`;
5. selecciona `Build` en el stepper real;
6. ejecuta la simulación y espera el resultado real;
7. comentario `Screens explain it. Behaviour proves it.`;
8. devuelve controles a Javier visitante y deja `PROTOTYPE / LIVE`.

Si el visitante toca un tab o control durante el read time, la escena automática cede y esa interacción activa la versión funcional sin cursor ficticio.

### 7.6 Playground / Experiment

WIP:

- `MAKE / IT / REAL` está sin ritmo, con baseline y espaciado provisionales;
- timeline en `00:00`, easing `Linear` y status `Paused`.

Edición:

1. Javier selecciona el grupo tipográfico;
2. aparece `TimelineStrip` inferior;
3. cambia easing a `Cubic out`;
4. arrastra el playhead a `00:02`;
5. el estudio ejecuta una única composición cinética;
6. final `EXPERIMENT / PLAYED` y Replay real.

No hay comentario: la relación timeline → movimiento se entiende visualmente.

### 7.7 About / Reframe

WIP:

- el retrato está en su máscara, pero el crop corta la mirada y empuja el peso visual contra el copy;
- label `IMAGE / FILL · Y 31 %`.

Edición:

1. Javier selecciona solo la máscara;
2. aparece una strip con Fill, zoom y posición Y;
3. ajusta Y y escala con dos nudges lentos;
4. la mirada y la columna de copy recuperan equilibrio;
5. final `CROP / APPROVED`.

No se repite el drag de asset del hero; aquí la acción es composición, no colocación.

### 7.8 Testimonials / Verify

WIP:

- las cards todavía utilizan comillas y jerarquía de testimonial;
- el contenido sigue siendo placeholder sin identidad, pero la forma podría sugerir una cita real;
- un pin `Source?` está pendiente.

Edición:

1. Javier abre el pin y comenta `No source, no quote.`;
2. selecciona las tres cards;
3. `ContentStatusPanel` muestra `Quote / Unverified`;
4. cambia el tipo a `Reference request`;
5. se retiran comillas y entra `Placeholder · source required` como status dominante;
6. el comentario se resuelve;
7. queda `REFERENCES / SOURCE PENDING`.

Esta es una mejora real del producto: evita que una preview provisional parezca prueba social fabricada.

### 7.9 Footer / Hand off

WIP:

- status global `Editing`;
- contacto temporal y CTA visibles pero sin señal de entrega;
- file label `PRIVATE PREVIEW`.

Edición:

1. Javier abre el menú de estado;
2. cambia `Editing` → `Ready for review`;
3. el CTA recibe señal y el rail completa el último capítulo;
4. cursor sale del viewport;
5. queda `PREVIEW READY / YOUR TURN`.

No se usa `Ready to share` mientras falten contacto, CV, casos y testimonials reales.

## 8. Timings

El timing deja de comprimir todos los eventos en el mismo segundo.

```text
0.0–1.2/1.7  sección visible; WIP se puede comparar
0.0–0.3      Spotlight entra al terminar readMs
0.3–1.0      cursor llega y selecciona
1.0–2.4      toolbar/sidebar y ajuste principal
2.2–3.8      comentario cuando exista
3.6–4.7      resolución, status y salida
```

Reglas:

- cursor visible al menos `1,8 s` en una escena con acción;
- un cambio importante tarda al menos `650 ms` y no más de `1,4 s`;
- comentario visible completo al menos `1,3 s`;
- Spotlight máximo `4,9 s` para cualquier escena automática;
- no se combina cambio de layout, comentario y salida en el mismo instante;
- picos Work/AI duran más; About/Footer son más breves.

## 9. Móvil y touch

Móvil conserva Follow mode, pero no dibuja un ratón:

- barra `Javier is editing` y borde de Spotlight;
- halo táctil y handles;
- panels como bottom sheets de máximo `36 %` del viewport;
- drag de asset y playhead con recorrido corto;
- scroll freeze máximo `3,4 s`;
- primer segundo toque/gesto cancela Follow y devuelve el scroll;
- comments como pin + sheet breve, nunca sobre el copy.

Si el stage no cabe con el bottom sheet sin ocultar su resultado, esa escena usa una property strip superpuesta dentro del objeto, no un panel externo.

## 10. Visitas, memoria y replay

### Primera visita

- intro completa;
- Auto-follow activo, con Stop siempre visible;
- todos los actos de Home elegibles una vez;
- ninguna escena empieza fuera de viewport;
- status final permite `Replay edit` por interacción.

### Segunda visita

- intro corta;
- Work, AI y Testimonials pueden reproducirse automáticamente;
- el resto nace final y ofrece replay manual.

### Tercera y posteriores

- Home final casi inmediata;
- ninguna captura automática;
- `Replay live edit` en Experience settings reinicia WIP y Follow mode.

Sin consentimiento, tiers y Auto-follow solo persisten en la pestaña. Analytics no lee estos estados.

## 11. Arquitectura propuesta

Estados:

```ts
type LiveScenePhase =
  | "wip"
  | "eligible"
  | "observing"
  | "spotlight-entering"
  | "editing"
  | "commenting"
  | "settling"
  | "settled"
  | "interrupted"
  | "reduced";
```

Definición:

```ts
type LiveSceneDefinition = {
  id: string;
  verb: LiveSceneVerb;
  stageSelector: string;
  targetSelector: string;
  tool: "type" | "layout" | "asset" | "variable" | "prototype" | "timeline" | "crop" | "content-status" | "file-status";
  readMs: number;
  spotlightMs: number;
  minVisibility: number;
  commentId?: string;
  autoVisitTier: 1 | 2;
};
```

Componentes:

- `LiveSceneDirector`: exclusión, dominant stage, scroll stability, tiers y estados.
- `SpotlightController`: entrada/salida, scroll lock, Stop, Escape y restauración exacta.
- `SpotlightChrome`: borde, scrims, avatar, progress y acción actual.
- `EditorPrimitives`: selection, property strip, panels, tray, timeline y comments.
- un presenter co-localizado por sección para WIP y final; no un transform genérico.
- `NarrativeProvider`: memoria y preferencia de Follow, sin analytics.

`GSAP` continúa siendo el único motor. React/atributos gobiernan estado; GSAP interpola. DOM/CSS resuelve todo, sin canvas, WebGL, Lenis o XState.

El lock guardará `scrollY`, compensará el scrollbar y restaurará la posición con tolerancia de `1 px`. El estado lógico se fija antes de liberar para evitar que el usuario vea un frame WIP al continuar.

## 12. Fases de implementación

### Fase 0 — Storyboard estático

- implementar únicamente snapshots WIP/final de cada sección bajo query de desarrollo;
- revisar que cada diferencia sea evidente sin motion;
- validar Dark/Light y 1440/390 antes de construir Spotlight.

Gate: una persona puede señalar qué estaba mal y qué se corrigió en cada sección viendo dos capturas.

### Fase 1 — Infraestructura Spotlight

- estados nuevos, dominant stage y scroll stability;
- Spotlight chrome, lock/restauración, Stop y Auto-follow;
- reduced motion, no-JS y sesión;
- playground de desarrollo para probar interrupciones sin recorrer Home.

Gate: una escena aislada nunca empieza fuera de viewport y devuelve el scroll a ±`1 px`.

### Fase 2 — Vertical slice

- hero revisado;
- Profile, Work y AI completos con chrome y comentarios;
- fast scroll, interacción temprana y tiers.

Gate: en 30–45 s se entiende WIP, edición y entrega sin explicación externa.

### Fase 3 — Resto de Home

- Expertise, Playground, About, Testimonials y Footer;
- status global y Replay edit;
- polish de ritmos y contraste entre picos/respiraciones.

Gate: todas las secciones tienen WIP/final distintos y ninguna repite exactamente la misma acción.

### Fase 4 — Mobile, accesibilidad y hardening

- touch translation, bottom sheets y cancelación por gesto;
- teclado, focus, hidden tab, resize/orientation y storage bloqueado;
- visual regression WIP/final y cuatro viewports.

Gate: Follow mode aporta narrativa sin impedir completar Home.

### Fase 5 — Auditoría y publicación privada

- auditoría creativa, UX, performance, axe y QA completa;
- actualizar ADR, arquitectura, handoff e implementation docs;
- retirar reglas/documentos superseded solo tras consolidar decisiones durables;
- publicar nueva versión privada en el proyecto Sites existente.

## 13. QA obligatoria

### Narrativa

- WIP reconocible antes de cursor;
- cambio principal visible en capturas before/after;
- comentario posterior al cambio y legible ≥`1,3 s`;
- una acción y una herramienta específica por sección;
- Spotlight no comienza con target fuera de safe zone.

### Scroll

- slow scroll, fast scroll, trackpad, wheel, touch flick, anchor link y scroll inverso;
- una sola escena dominante, sin cola;
- Stop/Escape/segundo gesto cancelan;
- scroll restaurado ±`1 px` y sin salto lateral;
- hidden tab, blur, resize y orientación liberan cualquier lock.

### Accesibilidad

- reduced motion y ajuste manual sin WIP animado ni lock;
- no-JS final completo;
- teclado puede abandonar Follow y continuar;
- sin focus trap, pérdida de foco o cambio programático de sección;
- axe y contraste Dark/Light.

### Visual y rendimiento

- baselines separados `wip`, `editing` y `settled` para cada acto principal;
- 1440×900, 1280×800, 768×1024 y 390×844;
- Dark/Light con geometría exacta;
- CLS ≤`0,03` en Home y sin overflow;
- Spotlight responde en el siguiente frame y no añade canvas/WebGL.

## 14. Decisiones que esta fase sustituirá al implementarse

El plan requiere actualizar formalmente los ADR solo cuando el código esté validado:

- ADR-006: scroll seguirá siendo nativo fuera de Spotlight, pero existirá una captura temporal, acotada y cancelable.
- ADR-016: deja de limitar comments prominentes a tres; el límite pasa a ser uno justificado por escena.
- ADR-017: fast-scroll ya no fija automáticamente `settled`; difiere la escena hasta que exista stage dominante y scroll estable.
- los timings actuales `450–750 ms` + `1,35–2,7 s` se sustituyen por read time `1–1,7 s` y Spotlight `2,8–4,9 s`.
- `idle` deja de ser visualmente final: en primera visita representa un WIP intencional y accesible.

Hasta completar la implementación, `NARRATIVE-07` e `IMPLEMENTATION-08` siguen describiendo el comportamiento publicado.

## 15. Fuera de alcance

- contenido real de case studies;
- coreografía dentro de `/work/[slug]`;
- clon completo de Figma o toolbar permanente;
- colaboración real, red o cursores múltiples;
- scroll timeline global, snap o pinning entre secciones;
- estados WIP que oculten información esencial;
- animación automática en tercera visita;
- publicación pública, indexación o cambio de hosting.

La medida de éxito no será el número de efectos. Será que el visitante pueda explicar, después de Home: “Entré en un archivo sin terminar, seguí a Javier mientras corregía decisiones concretas y terminé viendo un portfolio entregado.”
