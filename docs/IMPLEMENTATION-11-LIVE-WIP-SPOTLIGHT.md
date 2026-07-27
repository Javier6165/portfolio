# Implementation 11 — Live WIP + Spotlight

Fecha: 25 de julio de 2026.

Addendum: 27 de julio de 2026 — onboarding conceptual, chrome viewport-safe y ritmo revisado. Plan 12 sustituye después el ritmo y las salidas de primera visita; leer `PLAN-12-GUIDED-FIRST-PASS.md`.

Estado: **implementado y validado**. Hosting: proyecto Sites existente, accesible por enlace y bloqueado para indexación.

## 1. Resultado

Plan 11 sustituye la Home anterior por una landing que funciona primero como portfolio estático de alto nivel y después como archivo vivo. Cada capítulo tiene una silueta final propia, una desviación WIP deliberada y una corrección observable. El editor ya no es un presenter colocado encima de una sección terminada.

Orden vigente:

```text
Hero → Snapshot → Work → Product practice → AI-native workflow
     → About → References → Playground → Contact
```

Los case studies interiores no forman parte de esta implementación. Atlas, Northstar, Pulse y sus métricas continúan marcados como contenido ficticio.

## 2. Rediseño base

- **Hero:** stage editorial de viewport completo; el titular cruza el frame del retrato y comparte baseline, estado de archivo y cue `Explore`.
- **Snapshot:** cuatro señales profesionales a escala de lectura real; sustituye el antiguo lateral de microtexto.
- **Work:** conserva cards grandes y prepara el primer case para screenshots, exports y prototipos reales.
- **Product practice:** tabs `Map → Frame → Prove` con artefactos que explican reglas, decisión, output y disciplinas alineadas.
- **AI-native workflow:** pipeline `Frame → Explore → Build → Validate`, tools reales, output, human check y prototipo ejecutable.
- **About:** spread fotográfico y una idea de liderazgo/craft, sin repetir el snapshot.
- **References:** `Reference Ledger` navegable y tipado. No existen comillas, identidades ni atribuciones inventadas.
- **Playground:** shelf experimental posterior a la prueba profesional.
- **Contact:** handoff honesto en estado privado y sin contacto ficticio.

Dark y Light comparten exactamente componentes, tipografía, geometría y timings. Solo cambian tokens cromáticos y fotografías.

## 3. Estados WIP y editor

`LiveScene` renderiza el resultado semántico final en servidor y añade una capa visual progresiva. Los estados vigentes son:

```text
settled (SSR) → wip → observing → spotlight-entering
              → editing → commenting? → settling → settled
```

`reduced` resuelve directamente el final. `interrupted` es transitorio y se normaliza a `settled` en el siguiente frame.

Primitives en `app/components/live-file/EditorPrimitives.tsx`:

- frame de selección y handles;
- label de layer;
- panel contextual con herramienta y tres propiedades;
- comment thread anclado;
- status WIP/final.

Las diferencias WIP son estructurales: Snapshot comprime cuatro facts, Work deja un drop zone, Product practice muestra skills sin agrupar, AI muestra tools sin operating model, About usa un crop deficiente, References simula las cards descartadas, Playground desajusta el estudio y Contact permanece en editing.

## 4. Director y Spotlight

`LiveSceneDirector` mantiene un registro central de escenas y calcula el único target dominante después de `220–280 ms` de scroll estable. Una escena necesita su `minVisibility`, centro dentro de la zona segura y `readMs` completo. No existe observer/timeline independiente por wrapper, auto-scroll ni cola atrasada.

Durante Spotlight:

- se guarda la posición exacta;
- `body` se fija y se compensa el scrollbar;
- una máscara deja visible el target y una barra anuncia `Following Javier`;
- el cursor global usa MotionPath solo en dispositivos finos;
- toolbar, selección y comentario siguen el estado lógico de la escena;
- toolbar y comentario visibles se renderizan en el overlay fijo y se recolocan arriba o abajo del target con clamp de viewport;
- al terminar se restauran estilos y scroll sin salto.

Corrección de activación del 27 de julio: algunos browser shells emiten un `resize` al aplicar el fixed-body lock. Ese evento cerraba Spotlight inmediatamente y dejaba solo un flash de cursor. El director conserva ahora las dimensiones reales, ignora la ventana de resize producida por su propio lock y cancela únicamente ante un cambio material posterior.

Salidas: `Stop following`, `Escape`, `PageDown`, Space, cambio de tamaño, pestaña oculta, touch move o segunda rueda en `700 ms`. La primera rueda solo explica cómo salir. Detener Auto-follow fija todas las escenas futuras en final durante la sesión.

Timings:

| Escena | Lectura | Spotlight |
| --- | ---: | ---: |
| Snapshot | 1,8 s | 4,4 s |
| Work | 2,1 s | 4,8 s |
| Product practice | 2,0 s | 4,6 s |
| AI | 2,3 s | 4,9 s |
| About | 1,8 s | 3,7 s |
| References | 2,1 s | 4,6 s |
| Playground | 1,7 s | 4,1 s |
| Contact | 1,5 s | 2,8 s |

Los comentarios aparecen después del ajuste y permanecen legibles más de `1,3 s`. No contienen información necesaria.

## 5. Intro, móvil y fallbacks

La intro desktop dura aproximadamente `6,3 s` y la segunda visita menos de dos segundos. En primera visita, un comentario inicial explica `You caught me making the final pass` y `Follow Javier’s edits as you scroll` antes de mover el cursor. No es un loader: identidad, rol y retrato mantienen espacio desde el primer frame. Una visita familiar muestra el hero final directamente. Un skip temprano fija explícitamente opacidad del titular, reveal y posición del retrato.

En móvil no aparece cursor de ratón. El hero conserva titular, retrato y `Explore` dentro del primer viewport y Spotlight usa una barra inferior. El menú móvil cerrado no participa en layout; al abrirse usa un panel fijo dentro del viewport.

Fallbacks:

- sin JavaScript: HTML final y escenas `settled`;
- reduced motion: intro, WIP, cursor, Spotlight y scroll lock desactivados;
- imagen fallida: hero final inmediato;
- storage bloqueado: sesión funcional sin persistencia;
- interacción del visitante dentro de una escena: handoff y final estable.

## 6. Memoria y controles

`NarrativeProvider` añade:

- `autoFollow` y `javier-auto-follow-v1` en sessionStorage;
- `liveReplayToken` para `Replay live edits`;
- reset de Auto-follow al usar `Forget this device`.

La memoria persistente de visitas sigue necesitando `Allow`; solo modifica el tratamiento de la intro. La preferencia se ofrece tras dos escenas vistas, con `900 ms` de separación, y usa una superficie fija para no desplazar contenido. La exclusión de escenas y Auto-follow son session-only. El dock expone `Following Javier · Next edit when you pause`, se pliega al primer scroll y ofrece `Replay edits` y `Pause` tras expansión.

## 7. Motion y peso

GSAP continúa como único motor. Home no ejecuta los reveals genéricos de `MotionController`: el director posee toda su partitura y el contenido no se atenúa antes de una escena. ScrollTrigger se carga dinámicamente solo en About, Playground y case studies, donde siguen existiendo hooks `.js-reveal`.

No se añadieron canvas, WebGL, Three, R3F, Lenis, Motion, XState o colaboración real.

## 8. QA

Cobertura automatizada:

- build y HTML server-rendered;
- intro, skip temprano y fallo de retrato;
- WIP/final forzados con `?live=wip|settled`;
- visibilidad, pausa de lectura, Spotlight, comentario, lock y restauración de scroll;
- Stop/Escape y Auto-follow;
- tabs con roving focus, simulación AI y Replay;
- Reference Ledger sin prueba social inventada;
- Dark/Light con geometría y tipografía idénticas;
- reduced motion, no-JS, storage bloqueado y memoria recurrente;
- axe en Home Dark/Light y case study;
- matriz visual 1440×900, 1280×800, 768×1024 y 390×844.

Comandos obligatorios:

```bash
npm run lint
npm test
npm run test:e2e
```

Resultado del addendum: lint, build y smoke verdes; 42 combinaciones E2E descubiertas, 24 ejecutadas y 18 skips intencionales de cobertura duplicada. Axe queda limpio, la matriz Dark/Light completa no tiene overflow y Spotlight comprueba que el comentario esté completamente dentro del viewport.

## 9. Límites conocidos

- Work necesita screenshots y relatos reales para completar su nivel de evidencia.
- References debe mantenerse como preview privada o retirarse del candidato público hasta recibir citas verificadas y permiso.
- Contact, CV y LinkedIn definitivos siguen pendientes.
- Las métricas locales de desarrollo no sustituyen una medición CWV del build publicado con media final.
- Spotlight es una captura breve y cancelable; no debe extenderse a case studies hasta validar primero un patrón con contenido real.
