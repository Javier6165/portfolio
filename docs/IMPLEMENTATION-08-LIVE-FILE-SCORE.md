# Implementación 08 — Live File como partitura transversal

Fecha: 25 de julio de 2026.

Estado: **implementado y validado localmente**. Sustituye la arquitectura temporal de cues descrita en Implementación 05. El guion creativo original permanece en `NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`.

## Resultado

Home ya no depende de que el hero explique por sí solo el concepto. Después de `Compose`, cada sección ejecuta un verbo distinto, modifica un objeto real y conserva una traza pequeña:

| Acto | ID | Verbo | Cambio observable | Resultado persistente |
| --- | --- | --- | --- | --- |
| Hero | — | Compose | completa rol, coloca retrato y entrega el frame | hero final |
| Profile | `profile-clarify` | Clarify | alinea los cuatro flashes profesionales | `Profile / Refined` |
| Work | `work-frame` | Frame | encaja capas y evidencia del primer caso | `Case 01 / Live` |
| Expertise | `expertise-propagate` | Propagate | cambia una decisión local a compartida y la propaga | `1 change → 3 surfaces` |
| AI | `ai-activate` | Activate | selecciona Build y ejecuta una simulación funcional | `Prototype / Live` + resultado |
| Playground | `playground-experiment` | Experiment | reproduce playhead y estudio cinético | `Experiment / Played` + Replay |
| About preview | `about-reframe` | Reframe | ajusta el crop del retrato | `Crop / Approved` |
| Footer | `footer-handoff` | Hand off | señala el contacto y cede la experiencia | `Ready / Your turn` |

Solo Profile, Work y AI muestran comentario después del hero. Las demás escenas son silenciosas.

## Arquitectura

### `LiveSceneDirector`

Se renderiza una sola vez en `layout.tsx`, dentro de `NarrativeProvider`.

- posee el único cursor ficticio desktop;
- mide el anchor real con `getBoundingClientRect`;
- mueve el cursor con GSAP MotionPath desde el borde cercano;
- garantiza una sola escena activa;
- si empieza otra escena, fija la anterior en `settled`;
- fast-scroll por encima de `1.800 px/s` evita la reproducción parcial y entrega el resultado;
- en rutas distintas de Home considera la experiencia lista aunque no exista `EditorIntro`;
- emite `portfolio-live-scene-play` para que un control funcional ejecute la misma acción que la escena.

El director no cambia scroll, foco ni contenido. El cursor usa `pointer-events: none` y nunca sustituye el puntero del visitante.

### `LiveScene`

Es el contrato declarativo entre contenido y director:

```ts
type LiveSceneConfig = {
  id: string;
  verb: LiveSceneVerb;
  targetSelector: string;
  durationMs: number;
  autoVisitTier: 1 | 2;
};
```

`LiveScene` añade `dwellMs` como timing editorial. ScrollTrigger arma el wrapper con `start: "top 66%"` en desktop o `"top 74%"` en touch. La escena permanece en `armed` durante `450–750 ms`; solo después solicita la reproducción al director. El target es siempre un elemento real de la sección. `data-live-state="idle|armed|playing|settled|reduced"` es la fuente de verdad para CSS y tests; GSAP solo interpola el cursor.

Timings de observación: Profile y AI `750 ms`, Work y Expertise `650 ms`, Playground y About `600 ms`, Footer `450 ms`. Los comentarios comienzan a aparecer cerca del 62 % de su animación de `1,6 s`, por lo que el visitante recibe aproximadamente `1,6–1,75 s` de lectura antes del comentario. Si acelera el scroll, abandona la escena, cambia de pestaña, enfoca o interactúa, la espera/timeline se cancela y queda el resultado final.

Pointer o foco del visitante dentro de una escena ejecutan handoff inmediato. Su interacción gana sobre la reproducción automática.

### Presentación por verbo

`LiveScene` aporta selección, handles, status y comentario opcional. La acción no es genérica: cada wrapper implementa su propio presenter en CSS mediante `data-live-verb`/`data-live-state` y clases de sección.

- Clarify escalona filas sin ocultar copy.
- Frame alinea tres capas y la evidencia, conservando el link completo.
- Propagate cambia un token y actualiza tres artefactos.
- Activate controla estado React real.
- Experiment controla estado React real y ofrece Replay.
- Reframe solo transforma el asset.
- Hand off anima una señal asociada al contacto.

## Interacciones funcionales

### AI Practice

Los tabs mantienen roving `tabIndex`, flechas, Home y End. La escena selecciona `Build` y llama a una simulación real con tres estados:

```ts
type SimulationState = "idle" | "running" | "complete";
```

`Run simulation`/`Run again` son botones reales. El resultado, la barra de progreso y `12,480 states checked` cambian de forma observable. Los antiguos controles sin comportamiento fueron retirados o convertidos en status.

### Playground Study

`PlaygroundStudy` escucha el mismo evento del director y expone `Replay study`. El autoplay sucede una vez al entrar; después el usuario puede repetirlo. Reduced motion conserva el control, pero las animaciones se resuelven prácticamente de inmediato por CSS.

## Memoria y tiers

`NarrativeProvider` sigue siendo el único propietario de consentimiento, visita y motion. Además expone `hasSeenCue` y `markCueSeen` al director.

- Sin `Allow`, `javier-live-scenes-v1` evita repetir escenas solo en la pestaña.
- Tras `Allow`, IDs vistos se incorporan a `NarrativeMemory.seenCueIds`.
- Primera visita: todas las escenas son elegibles.
- Segunda: solo Work y AI pueden tomar iniciativa.
- Tercera+: todas nacen settled y quedan disponibles como interacción manual.
- `Forget this device` limpia memoria y reinicia la intro.

El consentimiento está integrado después de Profile, no superpuesto al hero. No hay cookies, identificadores ni envío al servidor.

## Hero estabilizado

`EditorIntro` mantiene el hero semántico en su geometría final. El frame inicial es un transform visual; la entrega termina en `transform: none` y ya no cambia layout.

- desktop: `translate(7%, 5.2rem) scale(.86)`;
- móvil: `translate(4%, 3.9rem) scale(.92)`;
- rol completo visible desde el primer frame;
- intro medida: `3,92 s` desktop y `3,90 s` móvil;
- CLS: `0,0073` desktop y `0` móvil.

El retrato activo espera decode un máximo de 350 ms. Skip, Escape, PageDown, wheel, touch, fallo de imagen, reduced motion y no-JS fijan el resultado final.

## Assets

Hero y About tienen AVIF/WebP responsive a 960/1440 px y conservan JPEG como fallback. Los JPEG originales servidos no se sobrescribieron; los originales de trabajo siguen fuera de `site/`.

- hero AVIF: aproximadamente 13–25 KB por variante;
- about AVIF: aproximadamente 13–30 KB por variante;
- primera carga de retratos medida: ~31 KB;
- el bootstrap precarga solo el AVIF del tema activo.

## Rendimiento medido

Build local de producción, Chromium, contenido actual:

| Métrica | 1440×900 | 390×844 |
| --- | ---: | ---: |
| Intro completa | 3,92 s | 3,90 s |
| CLS | 0,0073 | 0 |
| LCP observado local | 160 ms | 136 ms |
| Transferencia codificada inicial | 727 KB | 699 KB |
| JS codificado | 453 KB | 453 KB |
| CSS codificado | 95 KB | 95 KB |
| Inicio de Selected Work | 1.521 px / 1,69 vp | 1.690 px / 2,00 vp |
| Overflow horizontal | no | no |

El script reproducible es `tests/performance-audit.mjs`. Las cifras locales permiten comparar versiones; no sustituyen Lighthouse público ni field data.

## Accesibilidad y fallbacks

- El contenido final está renderizado en servidor y parte visible.
- Cursor, selección, handles y comentarios son decorativos.
- Reduced motion fija todas las escenas en `reduced` y mantiene controles funcionales.
- En touch no se dibuja cursor de ratón; la selección recibe un halo táctil.
- Fast-scroll entrega el estado settled.
- Sin JavaScript permanecen hero, copy, links, cards y CTAs.
- Status decorativos se ajustaron para contraste AA aunque estén fuera del árbol accesible.
- ThemeToggle anuncia destino y estado con `aria-label` y `aria-pressed`.
- Menú móvil cierra tras navegación y Escape.

## QA ejecutada

- `npm run lint`: limpio.
- `npm test`: build + 3 smoke tests SSR, todos pasan.
- `npm run test:e2e`: 26 pasan y 10 duplicaciones móviles se omiten intencionalmente.
- axe: Home y Northstar sin violaciones automáticas en desktop/móvil.
- teclado: AI Practice y token propagation.
- interacción: simulación AI, Replay Playground, tema con storage bloqueado y menú móvil.
- narrativa: armado y pausa editorial, comentario diferido, cancelación al seguir navegando, settled, tiers y reduced motion.
- resiliencia: no-JS y fallo de retrato.
- matriz visual full-page: System/Human en 1440×900, 1280×800, 768×1024 y 390×844.
- `npm audit --omit=dev`: 0 vulnerabilidades.

## Riesgos residuales

- Los casos y resultados siguen siendo ficticios.
- No existen contacto, LinkedIn o CV definitivos.
- Las escenas secundarias se extienden a otras rutas cuando llegue contenido real; Home es la Fase 3 cerrada.
- La auditoría completa incluye ocho avisos en tooling de desarrollo, principalmente Drizzle y ESLint; producción tiene cero.
- `globals.css` todavía mezcla estilos de rutas y merece división progresiva.
- No hay field data, Safari/Firefox ni dispositivo físico en esta fase.

Consulta `AUDIT-08-LIVE-FILE-TRANSVERSAL.md` y `PLAN-09-NEXT-IMPROVEMENTS.md` antes del siguiente ciclo.
