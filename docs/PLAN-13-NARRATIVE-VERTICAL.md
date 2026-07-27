# Plan 13 — vertical narrativa `Live File`

Estado: implementado como primera prueba de concepto. Prevalece sobre Plan 12 para la apertura y para Snapshot, Work y Product practice. Los capítulos posteriores conservan temporalmente la partitura anterior.

## Problema

La pasada guiada hacía visibles los efectos, pero no construía una causa clara. El editor desaparecía sin una acción reconocible; los comentarios llegaban después de la corrección y funcionaban como captions; y duplicar todos los tiempos convertía algunas ediciones en pausas largas sin más significado.

## Hipótesis

El concepto se entiende si cada escena responde, en este orden, a cuatro preguntas:

1. ¿Dónde estoy? En un archivo de portfolio todavía abierto.
2. ¿Quién actúa? Javier, identificado por cursor, avatar y comentario.
3. ¿Por qué cambia algo? Existe una desviación WIP concreta y se nombra antes de tocarla.
4. ¿Qué ha pasado? Una acción breve produce un resultado final visiblemente mejor y el comentario queda resuelto.

La capa narrativa puede tener humor seco; la información profesional permanece seria.

## Apertura

Storyboard desktop de primera visita, objetivo aproximado `5 s`:

1. Loading breve del working file.
2. Se revela el editor con el hero ya compuesto, toolbar y control `Present`.
3. Javier deja el comentario `Oh. Hi. You caught me at “one last tweak”.`
4. Añade `Right. Let’s make this less awkward — full screen.`
5. El cursor pulsa `Present` y ese gesto expande el frame al hero final.

La transición deja de ser un morph inexplicado: una acción visible causa el cambio. Primera visita sigue sin Skip; retorno consentido mantiene apertura corta y Skip. Reduced motion, no-JS y fallo entregan el hero final.

## Vertical piloto

| Capítulo | WIP legible | Comentario previo | Corrección | Tiempo total |
|---|---|---|---|---:|
| Snapshot | Facts como mini-CV pequeño y comprimido | `This is becoming a résumé. Nobody asked.` | Cuatro señales grandes y escaneables | 4,8 s |
| Work | Caso sin screenshot/evidencia | `A case study without evidence. Brave.` | Se coloca la pieza visual | 5,4 s |
| Product practice | Lista de habilidades desconectadas | `A list of skills. Groundbreaking.` | Se convierte en workflow y output | 5,5 s |

El comentario se ve durante la versión WIP. Después aparece selección/property UI, se ejecuta la edición y el comentario vuelve como resuelto al cerrar. Los tiempos de lectura son `1,4–1,6 s`; la acción no se ralentiza para llenar el bloqueo.

## Spotlight reconocible

- Borde azul en todo el viewport durante seguimiento.
- Barra superior `Following Javier`, número de edición y acción actual.
- Target con selection outline azul y oscurecimiento del resto del canvas.
- Comentario anclado con pin, autor y estado `now`/`resolved`.
- Panel de propiedades acoplado a la derecha en desktop.
- Cursor único solo en pointer fino; móvil traduce el beat a comentario, selección y panel.

Es una gramática colaborativa inspirada en herramientas de diseño, no una copia de marca, iconografía o layout completo.

## Contratos que no cambian

- El contenido final está en HTML desde servidor; la simulación es decorativa.
- Spotlight es la única captura temporal de scroll y restaura exactamente la posición.
- La primera pasada es obligatoria; visitas recurrentes consentidas recuperan salidas.
- Reduced motion resuelve el final sin coreografía.
- No se introduce canvas, WebGL, scroll-jacking global ni un segundo motor de motion.
- Casos, métricas y References continúan explícitamente ficticios/pendientes de fuente.

## Qué queda deliberadamente pendiente

AI, About, References, Playground y Contact todavía usan el guion posterior-a-la-edición de Plan 12. La siguiente iteración debe escribir para cada uno un WIP real, comentario previo, acción breve y punchline con el mismo criterio de esta vertical. No se extenderá la gramática si las tres escenas piloto no resultan comprensibles y agradables en uso real.

## Gate

- Apertura causal legible en desktop y móvil.
- Comentario visible antes de la corrección en los tres pilotos.
- UI WIP y final distinguibles sin depender del cursor.
- Scroll bloqueado solo mientras dura la escena y restaurado al terminar.
- Teclado, reduced motion, no-JS, storage y axe sin regresiones.
- Capturas revisadas en 1440×900, 1280×800, 768×1024 y 390×844.
