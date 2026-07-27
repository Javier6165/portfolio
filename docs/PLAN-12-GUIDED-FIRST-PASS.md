# Plan 12 — Guided first pass

Fecha: 27 de julio de 2026.

Estado: **implementado, auditado y validado**. Este documento sustituye únicamente el contrato de ritmo, onboarding y salida de Plan 11. La UI final, los WIP y el guion sección a sección de Plan 11 continúan vigentes.

## 1. Problema observado

La metáfora `Live File` existía, pero una primera visita podía percibirla como una suma de overlays:

- la intro empezaba a editar antes de explicar el contexto;
- `Skip`, scroll y teclado podían convertir el hero en un destello;
- los Spotlights duraban menos de cinco segundos y podían cancelarse casi involuntariamente;
- `Replay`, `Pause` y `Following` otorgaban control antes de que el visitante entendiera qué controlaba;
- fast scroll permitía atravesar capítulos obligatorios;
- comentario, propiedad y cambio competían dentro del mismo intervalo.

El resultado correcto no es añadir más chrome. Es convertir la primera visita en una demostración dirigida y dejar la libertad avanzada para quien ya conoce la regla.

## 2. Guion vigente

### Apertura

La primera visita empieza con una superficie completa de archivo:

1. `Opening working file` identifica `Javier Ortiz / Portfolio` y `Senior Product Designer`.
2. Una barra progresa durante unos cuatro segundos y cambia de `Loading components` a `Restoring live layers` y `Javier is still editing`.
3. Javier comenta: `One second — I’m still polishing this.`
4. La segunda línea fija el contrato: `I’ll finish each section as you reach it.`
5. El loader se retira y la edición del hero comienza.

La intro completa dura aproximadamente `13,5 s`. La identidad profesional está presente en el loading y el hero semántico continúa renderizado desde servidor.

### Primera visita

- No existe botón Skip en la apertura.
- Rueda, touch y teclas de desplazamiento se contienen hasta la entrega del hero.
- El dock es informativo: `Guided first pass · Scroll on — edits play automatically`.
- Cada capítulo es obligatorio y se resuelve en orden DOM.
- La primera edición espera al primer scroll real después del hero; cada edición posterior espera otro avance real después de devolver el control.
- Si el visitante atraviesa un capítulo, el director reencuadra el siguiente target requerido dentro de la zona segura.
- Spotlight bloquea desde la lectura del WIP, no solo desde el movimiento del cursor.
- La barra diferencia `Spot the draft — Javier is about to fix it` de la acción de edición.
- Rueda, touch, Escape y teclas de scroll no cancelan. Explican `Scroll resumes when this edit is complete`.
- No aparecen Play, Pause o Stop.

Reduced motion y no-JS siguen resolviendo directamente el producto final. Una pestaña oculta o un fallo técnico pueden liberar el lock; la accesibilidad de contenido nunca depende del efecto.

### Visitas recurrentes

Solo una memoria aceptada puede convertir una visita en recurrente:

- la apertura corta permite `Skip opening`;
- las ediciones siguen disponibles, pero son opcionales;
- los controles se llaman `Replay guided edits` y `Show finished file`;
- Escape y `Skip this edit` devuelven el control;
- la tercera visita puede entregar el hero final directamente.

## 3. Ritmo

Los tiempos de lectura y edición se duplican respecto al addendum anterior:

| Escena | Lectura WIP bloqueada | Edición |
| --- | ---: | ---: |
| Snapshot | 3,6 s | 8,8 s |
| Work | 4,2 s | 9,6 s |
| Product practice | 4,0 s | 9,2 s |
| AI | 4,6 s | 9,8 s |
| About | 3,6 s | 7,4 s |
| References | 4,2 s | 9,2 s |
| Playground | 3,4 s | 8,2 s |
| Contact | 3,0 s | 5,6 s |

Dentro de una escena:

```text
READ WIP → ENTER SPOTLIGHT → CURSOR/SELECT → PROPERTY CHANGE
         → COMMENT → RESOLVE → RETURN CONTROL
```

- el cursor tarda el doble en llegar y ajustar;
- el panel aparece después de seleccionar;
- el comentario entra cuando el resultado ya se puede comparar;
- resolución y salida no comparten el mismo instante.

## 4. Copy y tono

El concepto se entiende por tres capas, no por una explicación larga:

1. loading: el archivo está abierto y Javier sigue trabajando;
2. dock: la primera pasada es guiada y continúa al hacer scroll;
3. Spotlight: primero se observa el borrador y después se ve la corrección.

Se añadieron comentarios a los actos que antes quedaban mudos:

- About: `A crop should hold the gaze, not fight it.`
- Playground: `Linear felt like a loading bar. Awkward.`
- Contact: `Okay. Your turn.`

Continúa el límite de un comentario por escena y ninguno contiene información profesional esencial.

## 5. Arquitectura

- `NarrativeProvider.guidedFirstVisit` deriva del tier consentido y del replay manual.
- `EditorIntro` posee loader, progreso, bloqueo de primera visita y apertura recurrente cancelable.
- `LiveSceneDirector` diferencia captura `mandatory` y opcional.
- La primera captura busca la escena requerida más temprana ya alcanzada, reencuadra su target y fija esa nueva posición.
- `SpotlightChrome` recibe posición/total, fase `observing` y contrato mandatory.
- `LiveScene` no cede por pointer/focus durante la primera pasada.
- GSAP sigue siendo el único motor; estados y reglas continúan en React/DOM.

No se añadió scroll global, snap, cola automática entre capítulos, canvas, WebGL o editor funcional.

## 6. QA

Validado:

- intro completa no cancelable en desktop y móvil;
- devolución efectiva de rueda, touch y teclado al terminar la intro, no solo restauración visual de `overflow`;
- loading Dark/Light y corrección específica del solapamiento móvil;
- reencuadre y restauración de la posición capturada;
- un gesto posterior a la primera escena desplaza realmente el documento y no reactiva Spotlight por una restauración interna;
- rueda y Escape contenidos durante una escena obligatoria;
- visita recurrente con Skip y salida de una escena;
- comentarios dentro del viewport;
- reduced motion, no-JS, fallo de retrato y storage;
- Dark/Light con geometría compartida;
- 1440×900, 1280×800, 768×1024 y 390×844;
- axe, teclado, tabs, References y controles funcionales.

Resultado: lint y build limpios; `42` combinaciones E2E descubiertas, `24` ejecutadas y `18` skips intencionales de contratos duplicados.

Corrección de continuidad del 27 de julio: los listeners globales de la apertura permanecen montados con el hero por diseño, pero ahora quedan inertes en el mismo instante en que `finish()` entrega la página. Antes restauraban el `overflow` y, aun así, podían seguir anulando rueda, touch y teclas en una primera visita.

El director también mantiene un gate de avance entre capítulos. Restaurar `overflow`, reencuadrar o devolver el `scrollY` puede emitir eventos nativos; ninguno arma una escena. Solo un gesto nuevo del visitante libera el gate y permite evaluar el siguiente edit obligatorio.

## 7. Riesgo deliberado

La primera visita es más restrictiva y larga. Es una decisión consciente para validar si la firma narrativa se entiende cuando recibe tiempo y atención reales. El siguiente feedback debe medir:

- si el concepto se puede explicar sin ayuda externa;
- si ocho capturas completas resultan excesivas;
- qué escenas aportan criterio y cuáles solo añaden duración;
- si el recruiter conserva suficiente sensación de avance.

Si la experiencia se siente demasiado lenta, se reducirán escenas o lectura; no se volverá primero a cancelaciones involuntarias ni a comprimir cursor, comentario y cambio en menos de cinco segundos.
