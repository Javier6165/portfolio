# Plan 14 — Human audit pass y presencia continua

Estado: **implementado; segunda auditoría humana y humor pass validados para v24**.

## Problema observado

La vertical de Plan 13 ya hacía comprensible la apertura y convertía Work en una corrección clara, pero una lectura humana completa detectó siete fricciones: tipografía secundaria demasiado pequeña en la intro; encuadres que podían ocultar headings; consentimiento compitiendo con Spotlight; capítulos 04–08 todavía lentos; ocho escenas obligatorias; WIP de Snapshot y Practice menos inequívoco que Work; y una resolución final demasiado breve.

Durante la iteración se añadió una decisión conceptual: `Live File` necesita distinguir presencia continua de intervención coreografiada. Javier debe sentirse conectado al archivo aunque no esté bloqueando la visita.

## Modelo narrativo

```text
PRESENCIA CONTINUA
avatar + estado + cursor + microajustes no bloqueantes

INTERVENCIÓN GUIADA OBLIGATORIA
solo Snapshot
WIP → comentario → ajuste → resolución → devolución exacta del scroll

RESTO DE HOME
navegación libre + Follow Javier voluntario, secuencial y cancelable
```

### Primera visita

- La apertura conserva working file, comentario, `Present` y hero.
- Snapshot es el único capítulo obligatorio y Spotlight lo numera `01 / 01`.
- Tras Snapshot, scroll y navegación quedan libres. Ninguna sección inferior dispara Spotlight por entrar en viewport.
- El avatar ofrece `Follow Javier`; al activarlo recorre Work → Contact en orden, mueve la cámara y permite `Stop following` en cualquier momento.

### Presencia continua

- El dock muestra un retrato real de Javier y el estado de conexión.
- Entre Spotlights, un guion determinista recorre nueve microescenas irrepetibles durante un máximo de cuatro minutos.
- Si el target está en viewport, el cursor prueba copy, coloca un asset equivocado, duda con un crop/easing o corrige dos píxeles sin bloquear scroll.
- Si está en otra parte, no se fuerza al viewport y el dock declara `Editing elsewhere in the file`.
- Spotlight, pestaña oculta, reduced motion, touch o Auto-follow desactivado pausan o eliminan la capa.
- Al terminar la partitura, el estado queda `File tidy. For now.`; no existe loop infinito.

### Segunda auditoría — humor y legibilidad

La primera presencia ambiental funcionaba técnicamente, pero una persona solo veía un cursor corrigiendo dos píxeles: parecía QA, no personalidad. El contrato corregido es:

```text
setup legible → intento o duda → remate → undo/final correcto → silencio
```

- Cada gag empieza con `0,68 s` de contexto antes del primer cambio.
- Cada alternativa permanece aproximadamente `1,05–1,15 s`; hay `8,5 s` de descanso entre microescenas.
- Tras intro, consentimiento o Spotlight hay `5,2 s` de calma antes de reanudar.
- El wordmark solo participa en el hero; una cabecera sticky nunca roba el turno a la sección observada.
- El cursor, comentario y estado `JAVIER EDITING` aparecen juntos; el scroll continúa nativo.
- Copy real y árbol accesible no cambian: las pruebas humorísticas son pseudoelementos decorativos y se limpian al finalizar o cancelar.
- La broma de References nunca crea contenido publicado: prueba durante segundos una hipérbole, muestra `[Citation very much needed]` y vuelve al heading real.

Partitura vigente:

| Zona | Microescena | Remate |
|---|---|---|
| Hero | +2 px, −1 px, vuelta | `Perfect. Probably.` |
| Snapshot | tres titulares | `Too LinkedIn.` |
| Work | retrato usado como evidencia | `That is my face.` |
| Practice | duda con una flecha | `It did not need an arrow.` |
| AI | promesa excesiva sobre IA | `That is simply not true.` |
| About | crop de “thought leader” | `Undo.` |
| References | quote inventada y cita ausente | `Sources first. Much better.` |
| Playground | indecisión con easing | `Designer stares at cubic-bezier.` |
| Contact | último nudge | `Okay. Your turn.` |

## Correcciones por capítulo

| Capítulo | WIP legible | Corrección | Régimen |
|---|---|---|---|
| Snapshot | párrafo de CV largo + facts comprimidos | cuatro facts editoriales | obligatorio, cámara baja 190 px |
| Work | screenshot ausente | evidencia colocada | Follow opt-in |
| Product practice | skills sueltas sin workflow | Map → Frame → Prove | Follow opt-in |
| AI workflow | herramientas antes que decisiones | operating model conectado | opcional, comment-first |
| About | crop que compite con la historia | retrato con aire | opcional, comment-first |
| References | cards sin procedencia | ledger source-required | opcional, comment-first |
| Playground | easing lineal sin intención | ritmo cubic | opcional, comment-first |
| Contact | handoff todavía abierto | archivo listo para revisión | opcional, comment-first |

## Ritmo y controles

- Snapshot conserva `readMs` de 1,4 s y acción de 3,4 s.
- La resolución final permanece aproximadamente 1,2 s.
- Los capítulos opcionales usan una espera de 0,9–1,1 s y acciones de 3–4,2 s.
- Los targets altos se evalúan por visibilidad real, no porque su centro geométrico caiga dentro del viewport.
- El consentimiento aparece después de Snapshot y 2,4 s de calma; se desmonta mientras Spotlight o Follow estén activos.

## Criterios de aceptación

- La apertura explica que Javier estaba editando antes de mostrar el producto.
- La primera visita entiende la regla con una escena; el resto demuestra profundidad solo si el visitante elige seguir.
- Snapshot, Work y Practice mantienen heading y contexto dentro del encuadre.
- El dock muestra presencia real, no un control abstracto.
- Los microajustes nunca bloquean scroll ni sustituyen al cursor nativo.
- El consentimiento no se superpone a una escena.
- Reduced motion, touch y no-JS entregan el portfolio final sin cursor ambiental.
- Los gags tienen setup, cambio y remate observables, nunca cambian semántica y no compiten con Spotlight o consentimiento.
- Lint, build, smoke, Playwright, axe y matriz Dark pasan antes de publicar.

## Relación con documentos anteriores

- Plan 11 continúa definiendo UI final y WIP base.
- Plan 12 queda sustituido en su obligación de ocho capítulos: solo Snapshot es obligatorio.
- Plan 13 continúa definiendo apertura y patrón comment-first; este plan lo extiende a 04–08 y añade presencia continua.
