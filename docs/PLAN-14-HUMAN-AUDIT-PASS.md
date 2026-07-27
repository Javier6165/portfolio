# Plan 14 — Human audit pass y presencia continua

Estado: **implementado, pendiente de validación final y publicación**.

## Problema observado

La vertical de Plan 13 ya hacía comprensible la apertura y convertía Work en una corrección clara, pero una lectura humana completa detectó siete fricciones: tipografía secundaria demasiado pequeña en la intro; encuadres que podían ocultar headings; consentimiento compitiendo con Spotlight; capítulos 04–08 todavía lentos; ocho escenas obligatorias; WIP de Snapshot y Practice menos inequívoco que Work; y una resolución final demasiado breve.

Durante la iteración se añadió una decisión conceptual: `Live File` necesita distinguir presencia continua de intervención coreografiada. Javier debe sentirse conectado al archivo aunque no esté bloqueando la visita.

## Modelo narrativo

```text
PRESENCIA CONTINUA
avatar + estado + cursor + microajustes no bloqueantes

INTERVENCIÓN GUIADA
solo Snapshot → Work → Product practice
WIP → comentario → ajuste → resolución → devolución exacta del scroll

RESTO DE HOME
edits opcionales, breves, comment-first y siempre saltable
```

### Primera visita

- La apertura conserva working file, comentario, `Present` y hero.
- Snapshot, Work y Product practice son los únicos tres capítulos obligatorios.
- Spotlight los numera `01 / 03` a `03 / 03`.
- Tras el tercero, el dock libera Replay y `Show finished file`; AI, About, References, Playground y Contact son opcionales.

### Presencia continua

- El dock muestra un retrato real de Javier y el estado de conexión.
- Entre Spotlights, un guion determinista recorre doce microajustes durante aproximadamente dos minutos.
- Si el target está en viewport, el cursor se desplaza y corrige dos píxeles sin bloquear scroll.
- Si está en otra parte, no se fuerza al viewport y el dock declara `Editing elsewhere in the file`.
- Spotlight, pestaña oculta, reduced motion, touch o Auto-follow desactivado pausan o eliminan la capa.
- Al terminar la partitura, el estado queda `File tidy. For now.`; no existe loop infinito.

## Correcciones por capítulo

| Capítulo | WIP legible | Corrección | Régimen |
|---|---|---|---|
| Snapshot | párrafo de CV largo + facts comprimidos | cuatro facts editoriales | obligatorio, cámara baja 190 px |
| Work | screenshot ausente | evidencia colocada | obligatorio |
| Product practice | skills sueltas sin workflow | Map → Frame → Prove | obligatorio, cámara baja 380 px |
| AI workflow | herramientas antes que decisiones | operating model conectado | opcional, comment-first |
| About | crop que compite con la historia | retrato con aire | opcional, comment-first |
| References | cards sin procedencia | ledger source-required | opcional, comment-first |
| Playground | easing lineal sin intención | ritmo cubic | opcional, comment-first |
| Contact | handoff todavía abierto | archivo listo para revisión | opcional, comment-first |

## Ritmo y controles

- Los tres capítulos guiados conservan `readMs` de 1,4–1,6 s y acciones de 3,4–4 s.
- La resolución final permanece aproximadamente 1,2 s.
- Los capítulos opcionales usan una espera de 0,9–1,1 s y acciones de 3–4,2 s.
- Los targets altos se evalúan por visibilidad real, no porque su centro geométrico caiga dentro del viewport.
- El consentimiento aparece después de tres momentos y 2,4 s de calma; además se desmonta mientras Spotlight esté activo.

## Criterios de aceptación

- La apertura explica que Javier estaba editando antes de mostrar el producto.
- La primera visita entiende la regla con tres escenas, sin soportar ocho capturas.
- Snapshot, Work y Practice mantienen heading y contexto dentro del encuadre.
- El dock muestra presencia real, no un control abstracto.
- Los microajustes nunca bloquean scroll ni sustituyen al cursor nativo.
- El consentimiento no se superpone a una escena.
- Reduced motion, touch y no-JS entregan el portfolio final sin cursor ambiental.
- Lint, build, smoke, Playwright, axe y matriz Dark pasan antes de publicar.

## Relación con documentos anteriores

- Plan 11 continúa definiendo UI final y WIP base.
- Plan 12 queda sustituido en su obligación de ocho capítulos: solo los tres primeros son obligatorios.
- Plan 13 continúa definiendo apertura y patrón comment-first; este plan lo extiende a 04–08 y añade presencia continua.
