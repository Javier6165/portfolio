# Plan 15 — Figma UI3 intro y sprint de dirección visual

Estado: **aprobado e incorporado como dirección principal el 30 de julio de 2026**.

## Objetivo

Elevar la calidad visual con una apertura Figma UI3 reconocible y un portfolio editorial más sobrio. La comparación con la versión anterior fue aprobada por Javier; este plan sustituye a Plan 14 en apertura, obligatoriedad posterior y dirección visual.

## Apertura

1. La primera visita entra directamente en una recreación reconocible de Figma UI3.
2. Javier está editando el frame real de la Home durante aproximadamente `3–4 s`.
3. El cursor colaborativo reconoce al visitante con humor seco: `Oh—sorry. You caught me working.`
4. Javier se desplaza al control `Present` y lo activa.
5. El mismo frame se expande y se convierte en el hero semántico.

La apertura es la única secuencia obligatoria. Reduced motion, no-JS, fallo de media y visita familiar entregan el portfolio final sin comprimir la coreografía.

## Gramática Figma

- UI3 actual: navegación/capas a la izquierda, propiedades a la derecha, canvas claro, toolbar flotante inferior y colaboración/Present arriba.
- Frame, selection bounds, handles, cursor, name tag, pins y comments deben leerse como Figma antes que como un editor inventado.
- La recreación es funcionalmente decorativa: no simula herramientas que el visitante deba aprender ni suplanta el cursor real.
- El editor usa únicamente contenido del portfolio y datos ficticios explícitos; no representa archivos o colaboradores reales.

## Presentation mode

- La interfaz Figma se retira por completo durante la transición.
- El portfolio recupera una dirección editorial y humana; no conserva un shell de herramienta.
- El hero integra fotografía y tipografía en una sola composición, sin tarjeta flotante genérica.
- El primer viewport mantiene Javier Ortiz, Senior Product Designer, retrato y `Explore`.

## Después de la intro

- Scroll nativo y navegación libre desde el hero.
- Snapshot deja de ser obligatorio y no captura scroll.
- Presencia ambiental permitida solo si no bloquea, no mueve la cámara y no compite con lectura o consentimiento.
- `Follow Javier` permanece voluntario y cancelable, pero su acceso se reduce a una presencia discreta.
- Toda selección, comentario o cursor posterior utiliza el mismo lenguaje visual de Figma.

## Distill visual

- Retirar el rail lateral y el progreso persistente si no aportan orientación material.
- Reducir píldoras, badges, microtexto y lima; toda etiqueta significativa debe ser legible.
- Reservar los headings monumentales para momentos concretos y variar ritmo, densidad y composición.
- Replantear portrait cards y dashboards como campos editoriales y evidencia, no como chrome de producto.
- Mantener accesibilidad, labels de contenido ficticio y contratos de privacidad.

## Validación

- Dos rondas visuales agrupadas: desktop `1440×900` y móvil `390×844`.
- Comprobar comprensión de la apertura, transición causal, lectura del hero, ausencia de overlays invasivos y libertad de scroll.
- `npm run lint`, `npm test` y `npm run test:e2e` antes de comparar con `main`.
- Cualquier ampliación posterior de la presencia de Javier debe conservar scroll nativo, reduced motion y la primacía del contenido.
