# Plan 16 — Director: presencia contextual y edición humana

Estado: **integrado en `main` local; pendiente de publicación**.

## Objetivo

`Director` añade una presencia viva después de Presentation mode sin convertir el portfolio en una visita guiada automática. Javier puede trabajar de forma ambiental en la zona visible y, cuando el visitante se detiene, acercarse al punto de atención, comentar y hacer una corrección pequeña y comprensible.

No añade funcionalidades de producto, analítica, personalización remota ni nuevas coreografías obligatorias.

## Señales observadas

Todo ocurre en el documento y se descarta al cerrar la pestaña:

- visibilidad y proporción de targets mediante `IntersectionObserver`;
- posición del viewport y tiempo desde el último scroll;
- posición reciente del puntero y distancia al target;
- teclado, pointer down, foco y visibilidad de la pestaña;
- velocidad del puntero, velocidad/dirección del scroll y tiempo de estabilidad;
- exclusión mutua con intro, consentimiento, Spotlight y Follow.

No se registra texto introducido, historial, identidad, analytics ni datos remotos. La única memoria es un conjunto session-only de beats ya vistos para evitar repetición.

## Modelo de comportamiento

Director no es una secuencia aleatoria ni una IA remota. Es una `utility AI` similar a las usadas en videojuegos: mantiene un blackboard efímero, evalúa el contexto varias veces por segundo y cambia entre `observing`, `considering`, `approaching`, `commenting/editing`, `cooldown`, `roaming`, `paused` y `done`.

El foco del visitante tiene más peso cuando el puntero permanece sobre un target. Cuando esa señal no existe, visibilidad, centralidad, prioridad y un sesgo autoral suave permiten que Javier continúe con su propia agenda. La velocidad reciente eleva el tiempo de espera: Director no interpreta una navegación activa como atención.

## Decisión de atención

1. Director espera a que intro y cualquier overlay terminen.
2. Descarta targets con menos de aproximadamente `28%` visible.
3. Puntúa visibilidad, centralidad, proximidad y dwell del puntero, ritmo de interacción y prioridad autoral.
4. Mantiene un único candidato estable entre `1,15–2,1 s` según la atención observada.
5. Ejecuta una intervención y deja aproximadamente `8,5 s` de silencio.

Director nunca mueve la cámara. Si no encuentra target legible, el estado puede indicar que Javier trabaja en otra zona del archivo.

## Contención de fallos

Director debe fallar abierto. La identidad del contexto vive en `LiveSceneContext`, separada del componente que Fast Refresh reemplaza; además `LiveScene` recibe un valor pasivo durante cualquier desajuste transitorio y muestra la UI final sin lanzar una excepción. La presencia visual está aislada por un error boundary y su loop asíncrono por un circuit breaker. Si algo falla, se limpian cursor, comentario, overlay y transforms, se detiene el loop y la web continúa con navegación y scroll normales.

## Contrato de scroll

Las coordenadas de cursor, comentario y texto se miden en viewport al comenzar. Cualquier scroll, resize, cambio de pestaña o entrada en Follow invalida esas medidas y cancela de inmediato:

- cursor y comentario pasan a opacidad cero en la misma tarea de scroll;
- el overlay tipográfico se desmonta;
- el target recupera sus estilos originales;
- la intervención no se reanuda hasta una nueva pausa estable.

Así el cursor nunca queda visualmente pegado a una pieza que se desplaza bajo él.

## Escritura humana

Los headings editables incluyen Hero, Snapshot, AI y References. Cada beat:

1. mide el fragmento real con `Range`;
2. mueve el cursor a su extremo;
3. arrastra la selección con el azul Figma;
4. escribe carácter a carácter con cadencia irregular;
5. comete un error pequeño y visible;
6. usa backspace y corrige;
7. termina en el texto semántico original.

El heading real permanece en DOM y conserva su accessible name. Durante la escritura solo se vuelve visualmente transparente mientras un espejo `aria-hidden` ocupa exactamente su caja. No se usa `contenteditable` ni se despachan eventos de input sintéticos.

## Tipos de intervención

- `text`: selección, escritura, error y corrección.
- `comment`: observación contextual sin cambio.
- `nudge`: ajuste de dos píxeles, siempre restaurado.
- `crop`: respiración mínima del encuadre, nunca sustitución de asset.
- `easing`: pequeña comparación temporal sobre el playhead.

Se retira el gag de sustituir una imagen completa y los cambios de copy instantáneos: eran demasiado grandes para leerse como una edición humana.

## Accesibilidad y límites

- Desktop `pointer:fine` únicamente; touch y anchuras de `720 px` o menos no montan actividad.
- Reduced motion desactiva toda la capa.
- Ninguna información esencial vive en cursor, nota u overlay.
- Ninguna intervención bloquea scroll, foco o navegación.
- Spotlight y Follow siguen siendo opt-in y poseen su cursor de forma excluyente.

## Base técnica investigada

- [Intersection Observer](https://www.w3.org/TR/intersection-observer/) para visibilidad relativa al viewport.
- [Selection API](https://www.w3.org/TR/selection-api/) y `Range` para medir el fragmento seleccionado.
- [Input Events Level 2](https://www.w3.org/TR/input-events-2/) confirma que los eventos trusted pertenecen a intención real de usuario; Director representa la escritura visualmente.
- [ContentEditable](https://www.w3.org/TR/content-editable/) no se adopta: no hace falta convertir headings en superficies editables reales.

## QA requerido

- selección y escritura legibles en Hero y al menos un heading inferior;
- typo, backspace y retorno exacto al accessible name original;
- cancelación inmediata con rueda/trackpad durante selección y typing;
- comentario contextual dentro del viewport;
- ausencia completa en touch, reduced motion, no-JS, Spotlight, Follow y consentimiento;
- `npm run lint`, `npm test` y `npm run test:e2e`.
