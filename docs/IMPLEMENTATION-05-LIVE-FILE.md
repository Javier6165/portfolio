# Implementación 05 — Live File

Fecha: 25 de julio de 2026.

## Estado

Implementado y validado localmente. La publicación debe seguir siendo privada sobre el proyecto Sites existente.

## Hero e intro

`EditorIntro.tsx` contiene un único hero semántico y una capa de editor decorativa. La intro de primera visita:

1. muestra archivo, nombre, rol y frame;
2. selecciona/revela `Designer`;
3. mueve el asset de retrato al placeholder;
4. ajusta dos píxeles y muestra `Two pixels. Much better.`;
5. expande el frame al viewport con Flip.

La timeline dura aproximadamente 5,5 s desde su arranque. En primera visita espera el decode del retrato activo o 800 ms; el peor caso queda dentro del objetivo de 6,5 s. Return y Familiar empiezan inmediatamente y terminan por debajo de dos segundos.

Controles:

- botón `Skip intro` disponible solo después de hidratar;
- `Escape`, `PageDown`, rueda, touchmove o pestaña oculta completan la intro;
- fallo de imagen fija `failed` y muestra el hero final;
- no-JS y reduced motion parten del resultado final.

Estados:

```ts
type IntroPhase =
  | "boot"
  | "ready"
  | "typing"
  | "placing-portrait"
  | "refining"
  | "expanding"
  | "complete"
  | "skipped"
  | "reduced"
  | "failed";
```

## Atributos de documento

- `data-theme="system|human"`
- `data-motion="full|reduce"`
- `data-narrative="first|return|familiar|static|complete"`
- `body[data-live-file="active|complete"]`
- `[data-phase]` y `[data-expanded]` dentro del hero

Estos atributos son contratos entre bootstrap, React, GSAP y CSS. No sustituirlos por lectura de storage durante render.

## Componentes

- `NarrativeProvider.tsx`: consentimiento, memoria, cues, cooldown, replay y motion.
- `EditorIntro.tsx`: composición y timeline.
- `EditorIntro.module.css`: editor, hero final y adaptación móvil.
- `NarrativeCue.tsx`: IntersectionObserver y cue declarativo.
- `NarrativeCue.module.css`: selección/cursor/comentario sin layout shift.
- `ExperienceSettings.tsx`: consentimiento y controles del footer.
- `CaseEvidence.tsx`: renderer de evidencia y token propagation.

## Memoria

```ts
type NarrativeMemory = {
  schema: 1;
  visitCount: number;
  seenCueIds: string[];
  lastVisitAt: string;
  expiresAt: string;
};
```

Claves:

```text
javier-narrative-consent
javier-narrative-memory-v1
javier-narrative-session-v1
javier-narrative-counted-v1
javier-motion
```

- Session evita repetir intro en una pestaña sin pedir consentimiento.
- `Allow` crea memoria; `No thanks` no crea `NarrativeMemory`.
- Una visita cuenta una vez por sesión.
- Expiración lógica: 90 días.
- Tier 1: intro completa; tier 2: Return; tier 3+: Familiar.
- Todas las operaciones usan `try/catch` y degradan a sesión.
- Footer: Replay intro, Reduce motion/Use device setting y Forget this device.

Parámetros de desarrollo: `?narrative=first`, `return`, `familiar` y `reset`. Reduced motion o sesión ya completada prevalecen sobre una intro forzada.

## Cues

Home declara:

1. `trajectory-refinement`;
2. `work-framing`;
3. `prototype-handoff`.

Reglas implementadas:

- máximo tres por sesión;
- un ID una vez por sesión;
- cooldown de diez segundos;
- duración aproximada 4,4 s;
- no se activan durante los 800 ms posteriores a scroll;
- scroll o pestaña oculta cancelan el cue;
- overlays sin pointer events e información no esencial.

## Móvil

Por debajo de 720 px:

- no existe cursor ficticio visible;
- chrome compacto `Javier is editing`;
- frame vertical con título, retrato y asset tray inferior;
- selección y comentario se reposicionan;
- los cues posteriores conservan bounds/comentario, sin depender de hover.

## System y Human

System mantiene Instrument Sans/Fragment Mono, canvas oscuro y señal lima. Human añade Instrument Serif, fondo crema, tinta cobalto, señal coral, diagonales suaves, wordmark y tarjetas de geometría distinta. Ambos usan el mismo DOM, orden y accesibilidad.

## Case-study framework

`CaseBlock` exige id, eyebrow, title y description. Los bloques multimedia reservan aspect ratio y aportan alt/caption. `CaseEvidence` implementa:

- texto, imagen, galería y before/after;
- token propagation con tabs/keyboard;
- vídeo con poster, controls y `preload="none"`;
- Figma/prototype con fallback local e iframe click-to-load.

Northstar usa `system-behaviour`, un demostrador ficticio de un token aplicado a Operations, Knowledge y Player.

## Dependencias retiradas y añadidas

Retiradas:

- `three`
- `@react-three/fiber`
- `@types/three`
- `LivingFold.tsx` y `LivingFoldScene.tsx`

Añadidas:

- `@fontsource/instrument-serif`
- `@playwright/test`
- `@axe-core/playwright`

El build ya no emite el warning del chunk de Living Fold superior a 500 KB.

## QA ejecutada

- `npm run lint`
- `npm test` — build + tres smoke tests SSR.
- `npm run test:e2e` — Chromium desktop/móvil.
- axe en Home y Northstar sin violaciones automáticas.
- teclado en AI Practice y token propagation.
- skip, reduced motion, no-JS, fallo de retrato y memoria 1/2/3.
- ausencia de overflow horizontal.
- revisión visual System/Human en 1440×900, 1280×800, 768×1024 y 390×844.

La QA automática no sustituye Lighthouse ni field data. Medir LCP/INP/CLS cuando entren screenshots, vídeo y embeds reales.

## Limitaciones conocidas

- Los tres casos y métricas siguen siendo ficticios.
- Solo Northstar usa un bloque de evidencia; los demás tipos esperan contenido real.
- No existe reacción de proximidad entre cursor real y ficticio; se dejó fuera del MVP por riesgo de distracción.
- No hay analytics, contacto real, CV o embeds activos.
- `globals.css` conserva estilos editoriales previos; los sistemas nuevos ya están co-localizados, pero la migración completa puede continuar por zonas.

## Cómo extender sin romper el concepto

- Añade un cue solo si demuestra refinamiento, sistema, colaboración o comportamiento.
- No aumentes el máximo de Home sin una auditoría de atención.
- No cargues iframes o media externa antes de interacción.
- No conviertas el editor en navegación principal.
- Mantén un único cursor ficticio y nunca sustituyas el cursor del visitante.
- Añade cualquier nuevo formato de caso a la unión, renderer, fallback, teclado y tests.
