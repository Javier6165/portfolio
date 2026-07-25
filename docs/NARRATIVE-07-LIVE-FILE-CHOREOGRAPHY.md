# Narrativa 07 — Coreografía transversal de Live File

Fecha: 25 de julio de 2026.

Estado: **implementado y validado**. El contrato técnico, métricas y deltas finales están en `IMPLEMENTATION-08-LIVE-FILE-SCORE.md`.

Este documento define la respuesta al problema original: el hero tenía una escena, pero el resto de Home solo overlays ocasionales. La implementación vigente trata la landing como una pieza completa, con una acción breve y específica en cada sección.

## 1. Tesis creativa

La historia ya no es solo “Javier abre y termina su portfolio”. Es:

> **Javier deja el archivo abierto y hace una última pasada de criterio mientras el visitante lo recorre.**

Cada sección es una escena de esa revisión. El cursor no aparece para señalar decoración: ejecuta un verbo que cambia algo visible y deja la sección en un estado mejor, más claro o más vivo.

La gramática común es:

```text
FRAME → SELECT → CHANGE → SETTLE → HAND OFF
```

- `Frame`: queda claro qué objeto se está revisando.
- `Select`: el cursor y una selección aportan contexto.
- `Change`: ocurre una decisión observable.
- `Settle`: el resultado queda integrado en la sección; no desaparece como un overlay.
- `Hand off`: Javier se retira y el visitante conserva control completo.

El concepto no exige que todas las escenas tengan la misma intensidad. La Home necesita picos y respiraciones, no ocho demos compitiendo entre sí.

## 2. Lo aprendido de las referencias

- Figma explica que cursor y selección son valiosos porque responden “quién está aquí” y “dónde está trabajando”. Por eso el cursor ficticio siempre debe estar unido a un objeto y una acción, nunca flotando sin propósito. [Figma — Multiplayer Editing](https://www.figma.com/blog/multiplayer-editing-in-figma/)
- Sketch ancla los comentarios al canvas u objeto que les da contexto y permite ocultarlos para volver al trabajo. Los comentarios de Javier seguirán el cambio y se resolverán; no serán banners globales. [Sketch — on-canvas commenting](https://www.sketch.com/blog/get-started-with-on-canvas-commenting/)
- 21st.dev confirma que un cursor puede pertenecer a una zona concreta en vez de sustituir el puntero del sistema. Se toma el patrón de presencia localizada, no su implementación con Motion ni su estética. [21st.dev — Cursor](https://21st.dev/@ibelick/components/cursor)
- Una buena experiencia narrativa compone cada sección como una escena con intención, pero este portfolio conserva scroll nativo y contenido editorial. Se adopta la lógica de “una escena, un beat”, no el mundo 3D ni el scroll dirigido. [Codrops — More Than a Portfolio](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- GSAP ScrollTrigger permite disparadores por posición, `once`, velocidad, `fastScrollEnd`, responsive y cleanup. Resuelve mejor esta partitura que un `intersectionRatio` sobre wrappers altos. No se usarán `scrub`, pinning, snapping ni scroll-jacking. [GSAP — ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

## 3. Ritmo general de Home

```text
PEAK       Hero         Compose
BREATH     Profile      Clarify
PEAK       Work         Frame
BREATH     Expertise    Propagate
PEAK       AI           Activate
PLAY       Playground   Experiment
BREATH     About        Reframe
CODA       Contact      Hand off
```

Tres escenas concentran el mayor `wow`: Hero, Selected Work y AI. Profile, Expertise, Playground, About y Footer mantienen la continuidad mediante acciones más breves. Así el visitante percibe una pieza diseñada de principio a fin sin sufrir motion fatigue.

El timeline profesional detallado sale de Home y pasa a `/about`. La segunda sección se comprime a cuatro flashes profesionales y Selected Work sube. Esto protege tanto la narrativa como la velocidad de comprensión.

## 4. El reparto visual

### Un solo cursor

`Javier` es un cursor único y global en desktop, renderizado una vez y trasladado a los anchors reales. No habrá un cursor distinto dentro de cada wrapper ni trayectorias codificadas con `vw`.

- `pointer-events: none` siempre.
- Label legible con fondo y texto explícitos, nunca `currentColor` ambiguo.
- Entra desde el borde cercano del objeto; no atraviesa media página.
- Desaparece al terminar la acción; nunca sigue al visitante.
- El puntero nativo no se sustituye ni se oculta.

### Trazas persistentes

Cada escena deja una prueba mínima después del movimiento:

- status monoespaciado;
- frame label;
- conexión entre objeto y resultado;
- estado `Live`, `Reviewed`, `Shared` o `Ready`;
- resultado funcional de una acción.

Estas trazas son la razón por la que Live File seguirá presente aunque el visitante llegue con reduced motion, haga fast-scroll o ya haya visto una escena.

### Comentarios

Solo habrá tres comentarios prominentes después del hero:

1. Profile: `Keep the signal. Lose the résumé.`
2. Selected Work: `Show the decision, not the decoration.`
3. AI: `Screens explain it. Behaviour proves it.`

El hero conserva `Two pixels. Much better.`. Las demás escenas usan status o labels silenciosos. Un comentario siempre se ancla al elemento modificado y se resuelve antes de que termine la escena.

## 5. Score sección por sección

| Acto | Sección | Verbo | Acción visible | Estado que permanece | Intensidad |
| --- | --- | --- | --- | --- | --- |
| 0 | Hero | `compose` | Completa titular, coloca retrato y convierte frame en producto | Hero final | Peak |
| 1 | Profile | `clarify` | Selecciona información y la agrupa en cuatro flashes | `PROFILE / REFINED` | Breath |
| 2 | Selected Work | `frame` | Convierte el primer frame de proyecto en una card/evidencia viva | `CASE 01 / LIVE` | Peak |
| 3 | Expertise | `propagate` | Cambia una regla compartida y la propaga por tres superficies | `1 CHANGE → 3 SURFACES` | Breath |
| 4 | AI + code | `activate` | Pasa de pantalla estática a simulación ejecutable | Resultado funcional | Peak |
| 5 | Playground | `experiment` | Mueve el playhead y activa el estudio cinético | `EXPERIMENT / PLAYED` | Play |
| 6 | About | `reframe` | Ajusta el crop del retrato y aprueba la versión humana | `CROP / APPROVED` | Breath |
| 7 | Contact | `handoff` | Cambia el archivo de `Editing` a `Ready to share` y abandona el frame | `READY / YOUR TURN` | Coda |

## 6. Storyboard detallado

### Acto 0 — Hero / Compose

Propósito: abrir con la firma visual y demostrar craft.

- Se mantiene el guion actual, comprimido a `3,8–4,3 s`.
- Nombre y rol completo son legibles desde el primer segundo.
- La expansión futura será transform-only, sin alterar la geometría semántica.
- La escena termina antes de mostrar consentimiento u otros overlays.

Resultado: el visitante entiende que está dentro de un archivo vivo y que Javier es quien lo revisa.

### Acto 1 — Profile / Clarify

Propósito: responder quién es Javier sin convertir Home en un CV largo.

Estado editorial final:

1. `Senior Product Designer`;
2. `5+ years at GiG`;
3. `Rules · CMS · Backoffice · Systems`;
4. `AI-assisted design + coded prototypes`.

Coreografía desktop, `1,6–1,8 s`:

1. Al entrar la sección, cuatro flashes ya son legibles y ocupan su geometría final.
2. Javier entra desde el gutter, dibuja una selección breve alrededor de los cuatro.
3. Los separadores y alineaciones encajan mediante transforms; no cambia el alto del layout.
4. Aparece el comentario `Keep the signal. Lose the résumé.` anclado al grupo.
5. El comentario se resuelve y queda `PROFILE / REFINED`.

No se simula borrar texto esencial. La animación refuerza una edición que la arquitectura de información ya ha realizado.

### Acto 2 — Selected Work / Frame

Propósito: crear el segundo gran momento y llevar al recruiter a la evidencia.

Coreografía desktop, `2,1–2,4 s`:

1. El heading y las tres cards están visibles; cada una conserva una pequeña etiqueta de frame.
2. Cuando el primer card cruza el trigger, Javier entra por el lateral más cercano y selecciona únicamente su área visual.
3. La etiqueta cambia `FRAME / 01` → `CASE 01 / LIVE`.
4. Capas de placeholder se alinean y una pieza de evidencia ocupa el frame mediante Flip/transform, sin mover el listado.
5. La affordance real `Open case study` toma su estado listo.
6. Aparece `Show the decision, not the decoration.` y se resuelve.
7. Javier se retira; la card queda totalmente interactiva.

Las cards segunda y tercera no repiten el espectáculo. En hover, foco o touch usan la misma gramática de selección, label y profundidad como microinteracción manual.

### Acto 3 — Expertise / Propagate

Propósito: convertir “pienso en sistemas” en un comportamiento visible.

Coreografía desktop, `1,4–1,7 s`:

1. Un token compacto aparece asociado a la primera capability: `decision / local`.
2. Javier selecciona el token y cambia su estado a `decision / shared`.
3. Una línea de dependencia recorre las tres cards.
4. Sus artefactos actualizan el mismo atributo con un stagger corto.
5. Queda el contador `1 CHANGE → 3 SURFACES`.

La acción es silenciosa. El cambio compartido aporta el significado; un comentario sería redundante.

### Acto 4 — AI + coded prototypes / Activate

Propósito: demostrar el diferencial de IA y prototipos con comportamiento real.

Coreografía desktop, `2,4–2,8 s`:

1. La escena comienza en `Frame`: una pantalla estática con la incertidumbre principal.
2. Javier selecciona `Build` en el stepper real.
3. Pulsa un control real `Run simulation`, no un botón decorativo.
4. La regla entra en ejecución, el resultado se actualiza y aparece evidencia observable.
5. El comentario `Screens explain it. Behaviour proves it.` se ancla al resultado.
6. Javier desaparece y el visitante puede volver a `Frame`, `Explore` o `Build`.

Si el visitante toca o enfoca antes de la reproducción automática, su interacción gana: la misma secuencia se ejecuta como respuesta, sin cursor ficticio interfiriendo.

### Acto 5 — Playground / Experiment

Propósito: dar una respiración lúdica sin romper la usabilidad.

Coreografía desktop, `1,5–1,8 s`:

1. El canvas muestra un playhead real y la composición en pausa.
2. Javier arrastra el playhead de `00:00` a `00:02`.
3. `MAKE / IT / REAL` ejecuta una única variación cinética contenida.
4. La escena se detiene en un frame final fuerte y deja `EXPERIMENT / PLAYED`.

No hay comentario. En hover/foco/touch, `Replay` permite al visitante repetir el estudio sin autoplay infinito.

### Acto 6 — About / Reframe

Propósito: cerrar la parte profesional con presencia humana y una repetición intencional del gesto de craft del hero.

Coreografía desktop, `1,2–1,5 s`:

1. Javier selecciona la máscara del retrato, no la sección completa.
2. Ajusta el crop unos píxeles con un único gesto.
3. El label cambia `ASSET / PORTRAIT` → `CROP / APPROVED`.
4. La selección desaparece y la foto queda limpia.

La repetición del ajuste de imagen funciona como rima visual con el hero. No se añade una frase autobiográfica ni un comentario sentimental.

### Acto 7 — Footer / Hand off

Propósito: señalar que la revisión terminó y ceder la experiencia al visitante.

Coreografía desktop, `1,2–1,4 s`:

1. Un status discreto muestra `Editing`.
2. Javier lo selecciona y cambia a `Ready to share`.
3. El CTA de contacto recibe una señal visual, nunca foco programático.
4. El cursor sale por el borde y queda `READY / YOUR TURN`.

No se implementará el destino definitivo hasta recibir email, LinkedIn y CV reales.

## 7. Trigger y comportamiento durante scroll

El sistema actual espera un `intersectionRatio` alto y reintenta cada dos segundos. Se reemplazará por una partitura determinista con GSAP ScrollTrigger:

- trigger en el wrapper que contiene el objeto real de acción;
- armado en `top 66%` desktop y `top 74%` touch;
- pausa editorial de `450–750 ms` antes de cualquier selección, corrección o cambio;
- una reproducción por sesión, gobernada por memoria y tier de visita;
- comentarios solo después de que la corrección haya empezado: aproximadamente `1,6–1,75 s` después del armado;
- una sola escena activa;
- si entra una escena nueva, la anterior completa su estado final antes de ceder;
- fast-scroll lleva inmediatamente a `settled` sin reproducir una animación a medias;
- resize y cambio de orientación recalculan anchors;
- salida de la escena, navegación o pestaña oculta cancelan espera/timeline y fijan estado final;
- `scrub`, pinning, snapping y normalización de scroll quedan prohibidos.

No se animarán coordenadas entre secciones. El cursor global desaparece al terminar una escena y reaparece cerca del siguiente anchor; la continuidad es de personaje y gramática, no una línea imposible que atraviesa el documento.

## 8. Móvil, touch y reduced motion

### Móvil

No se dibuja un ratón flotante. Cada verbo se traduce a lenguaje táctil:

- selección con handles;
- halo táctil;
- drag corto;
- comment pin anclado;
- propagación o cambio de estado.

Las escenas duran `0,9–1,4 s`, no usan coordenadas absolutas entre bloques y nunca dependen de hover.

### Reduced motion

- No se muestra cursor, drag, playhead automático ni trayectoria.
- Cada sección nace en su estado `settled` con la traza persistente correspondiente.
- La información y los controles son idénticos.
- Los prototipos siguen siendo ejecutables por acción explícita.

### Sin JavaScript

- Contenido final y CTAs siguen visibles.
- Se ven las labels finales solo si aportan significado visual; no aparecen comentarios decorativos.
- Ningún bloque empieza oculto ni necesita completar una animación para funcionar.

## 9. Primera visita y retorno

### Primera visita

- Hero completo.
- Todas las escenas se descubren una vez al entrar en su sección.
- Solo Profile, Work y AI muestran comentario.
- Presupuesto de motion posterior al hero: aproximadamente `11–13 s`, repartido a lo largo del scroll, nunca seguido.

### Segunda visita

- Hero corto.
- Se reproducen automáticamente solo Work y AI si el visitante llega a ellas.
- El resto aparece directamente en `settled`, con microinteracción disponible.

### Tercera y posteriores

- Hero casi inmediato.
- Ninguna escena secundaria toma la iniciativa; se activa únicamente mediante interacción del visitante.
- La memoria persistente de estos tiers continúa requiriendo consentimiento. Sin consentimiento, la lógica es solo de sesión.

## 10. System y Human

El guion y el significado son idénticos. Cambia la interpretación artística:

| Elemento | System | Human |
| --- | --- | --- |
| Trayectoria | segmentos rectos y snap preciso | curva breve y asentamiento más suave |
| Handles | cuadrados, 1 px | redondeados, algo más grandes |
| Status | Fragment Mono, mayúsculas | serif + micro-label mono |
| Señal | lima para resultado, azul para Javier | coral para resultado, cobalto para Javier |
| Geometría | alineación técnica | tensión editorial/asimétrica |

Javier conserva una identidad cromática reconocible en ambos temas. El modo nunca cambia el orden, el timing esencial ni qué contenido se comunica.

## 11. Contrato técnico propuesto

Estados de una escena:

```ts
type LiveScenePhase =
  | "idle"
  | "armed"
  | "playing"
  | "settling"
  | "settled"
  | "skipped"
  | "reduced";
```

Definición declarativa:

```ts
type LiveSceneDefinition = {
  id: string;
  route: string;
  anchorId: string;
  verb: "clarify" | "frame" | "propagate" | "activate" | "experiment" | "reframe" | "handoff";
  intensity: "peak" | "breath" | "play" | "coda";
  durationMs: number;
  commentId?: string;
  settledLabel: string;
  autoVisitTier: 1 | 2 | "interaction-only";
};
```

Arquitectura:

- `NarrativeProvider` conserva consentimiento, visitas, motion y escenas vistas.
- `NarrativeDirector` decide qué escena puede ejecutarse y garantiza exclusión mutua.
- `JavierCursor` es un singleton global con anchors medidos desde DOM real.
- `LiveScene` declara trigger, estado y fallback.
- Cada verbo se implementa en un presenter co-localizado; no habrá un componente genérico que dibuje el mismo rectángulo sobre todo.
- GSAP controla interpolación; React/atributos controlan estados lógicos.
- ScrollTrigger reemplaza el observer de `NarrativeCue`; sigue siendo GSAP y no introduce un segundo motor.

`NarrativeCue` dejará de significar “overlay de cuatro segundos”. El sistema distinguirá:

- `scene`: una acción persistente por sección;
- `comment`: como máximo tres después del hero;
- `microinteraction`: respuesta manual de hover, foco o touch.

## 12. Extensión a otras rutas

La Fase 3 cubre Home. Las rutas secundarias aplicarán la misma gramática cuando entre contenido real:

- `/about`: conectar etapas y mostrar Lead como una responsabilidad reciente que parte de Senior, no como una identidad separada; verbo `connect`.
- `/work/[slug]`: seleccionar problema, anclar comentarios a evidencia, comparar before/after, propagar tokens y resolver anotaciones; nunca un cursor por cada bloque.
- `/playground`: controles reales de play, scrub, remix y reset; verbo `experiment`.
- 404: archivo no encontrado con estado estático; sin secuencia automática larga.

En case studies la evidencia manda. Live File aparece solo donde ayuda a explicar una decisión, contribución, sistema o comportamiento.

## 13. Orden de prototipado

1. Construir `NarrativeDirector`, el cursor singleton y el contrato `LiveScene`.
2. Prototipar los tres picos: Profile, primer proyecto y AI.
3. Validar el ritmo completo en una captura de scroll desktop y móvil.
4. Añadir Expertise, Playground, About y Handoff como beats silenciosos.
5. Ajustar System/Human sin cambiar el guion.
6. Convertir cada estado final en fallback no-JS/reduced.
7. Automatizar pruebas de triggers, fast-scroll, interacción temprana y orden.

La estabilización del hero sin CLS precede o acompaña a la infraestructura, pero no se considera Live File transversal hasta completar los ocho actos.

## 14. Gates de aceptación creativa

- En `30 s` se entienden nombre, nivel, experiencia, territorio y diferencial.
- En `60 s` se perciben Hero, Profile y Selected Work como partes de la misma obra.
- Al completar Home, todas las secciones conservan una traza de Live File.
- Work y AI son los dos momentos más memorables después del hero.
- Cada escena tiene un verbo diferente y cambia algo observable.
- Ninguna escena requiere esperar quieto, hacer hover o conocer el concepto.
- Ningún cursor tapa heading, CTA o texto en lectura.
- El visitante puede seguir desplazándose y usar cualquier control durante la experiencia.
- Fast-scroll, reduced motion y no-JS aterrizan en un resultado compuesto, no en una web “sin efecto”.
- System y Human ejecutan la misma partitura con dirección artística propia.

## 15. Lo que queda fuera

- Cursor permanente o sustitución del puntero nativo.
- Comentario en todas las secciones.
- Animaciones que solo añaden brillo sin cambiar un estado.
- Timeline global ligada píxel a píxel al scroll.
- Pinning, scroll-jacking, smooth scroll o escenas que retienen al visitante.
- Canvas, WebGL, Liveblocks o colaboración real.
- Coordenadas hardcoded con `vw` para simular recorrido entre secciones.
- Reproducir todas las escenas automáticamente en cada visita.

La medida de calidad no será cuántas veces aparece Javier, sino si el visitante siente que cada parte fue revisada, conectada y entregada con intención.
