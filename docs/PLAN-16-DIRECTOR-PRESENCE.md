# Plan 16 — Director: presencia contextual y edición humana

Estado: **integrado en `main` local; pendiente de publicación**.

## Objetivo

`Director` añade una presencia viva después de Presentation mode sin convertir el portfolio en una visita guiada automática. Javier puede trabajar de forma ambiental en la zona visible y, cuando el visitante se detiene, acercarse al punto de atención, comentar y hacer una corrección pequeña y comprensible.

No añade funcionalidades de producto, analítica, personalización remota ni nuevas coreografías obligatorias.

## Señales observadas

Todo el modelo de comportamiento ocurre en el documento y se descarta al cerrar la pestaña:

- visibilidad y proporción de targets mediante `IntersectionObserver`;
- posición del viewport y tiempo desde el último scroll;
- posición reciente del puntero y distancia al target;
- teclado, pointer down, foco y visibilidad de la pestaña;
- velocidad del puntero, velocidad/dirección del scroll y tiempo de estabilidad;
- profundidad máxima, llegada al final, retorno al hero y revisita de una zona;
- tiempo transcurrido en la pestaña y decisión inmediata sobre memoria local;
- exclusión mutua con intro, consentimiento, Spotlight y Follow.

No se registra texto introducido, historial, identidad, URLs, analytics ni datos remotos. Los beats ya ejecutados viven en `sessionStorage`. Si existe consentimiento, `NarrativeMemory` puede guardar únicamente el nivel de visita y los ids de variantes ya mostradas para rotar el copy en sesiones futuras; nunca persiste el modelo de comportamiento.

## Modelo de comportamiento

Director no es una secuencia aleatoria ni una IA remota. Es una `utility AI` similar a las usadas en videojuegos: mantiene un blackboard efímero, evalúa el contexto varias veces por segundo y cambia entre `observing`, `considering`, `approaching`, `commenting/editing`, `cooldown`, `roaming`, `paused` y `done`.

El foco del visitante tiene más peso cuando el puntero permanece sobre un target. Cuando esa señal no existe, visibilidad, centralidad, prioridad y un sesgo autoral suave permiten que Javier continúe con su propia agenda. La velocidad reciente eleva el tiempo de espera: Director no interpreta una navegación activa como atención.

Sobre esa base hay disparadores contextuales finitos para decisión de memoria, visitas 1–5, `45 s`/`2 min`/`4 min`, scroll rápido, lectura pausada, final alcanzado, retorno arriba y revisita de sección. No son respuestas generadas: cada disparador elige entre un pool editorial amplio y determinista. El resultado imita percepción, no inteligencia remota.

## Decisión de atención

1. El handoff de Present activa inmediatamente `hero-headline-indecision`; el resto de Director espera a que intro y cualquier overlay terminen.
2. Descarta targets con menos de aproximadamente `28%` visible.
3. Puntúa visibilidad, centralidad, proximidad y dwell del puntero, ritmo de interacción y prioridad autoral.
4. Mantiene un único candidato estable entre `0,85–1,2 s` según la atención observada.
5. Ejecuta una intervención y deja aproximadamente `6,5 s` de silencio.

Director nunca mueve la cámara. Si no encuentra target legible, el estado puede indicar que Javier trabaja en otra zona del archivo.

Los comentarios puramente contextuales tienen un límite de cuatro por pestaña y al menos `22 s` entre ellos, salvo la respuesta directa a `Allow` o `No thanks`. La decisión inmediata tiene prioridad porque responde a una acción explícita; el resto cede siempre ante navegación activa.

## Pools y memoria narrativa

- Cada beat de edición dispone de `4–5` aperturas y `4` resoluciones.
- Cada disparador contextual dispone de `4–5` variaciones.
- Sin consentimiento, la selección es estable en la pestaña pero no se conserva al cerrarla.
- Con consentimiento, solo se añaden ids opacos `director-copy:*` a `seenCueIds`; se elige primero una variante no vista y se reinicia el pool cuando se agota.
- `visitTier` se limita a cinco niveles. A partir de la quinta visita conserva tier 5, pero sigue rotando comentarios disponibles.
- La frase coloquial sobre “cookies” aclara dentro del propio comentario que la función rechazada era memoria local. El sitio no usa cookies.

## Contención de fallos

Director debe fallar abierto. Las identidades de contexto viven en `LiveSceneContext` y `NarrativeContext`, separadas de los componentes provider que Fast Refresh reemplaza; además `LiveScene` recibe un valor pasivo durante cualquier desajuste transitorio y muestra la UI final sin lanzar una excepción. La presencia visual está aislada por un error boundary y su loop asíncrono por un circuit breaker. Si algo falla, se limpian cursor, comentario, overlay y transforms, se detiene el loop y la web continúa con navegación y scroll normales.

## Contrato de scroll

Las coordenadas de cursor, comentario y texto se miden en viewport al comenzar. Cualquier scroll, resize, cambio de pestaña o entrada en Follow invalida esas medidas y cancela de inmediato:

- cursor y comentario pasan a opacidad cero en la misma tarea de scroll;
- el overlay tipográfico se desmonta;
- el target recupera sus estilos originales;
- la intervención no se reanuda hasta una nueva pausa estable.

Así el cursor nunca queda visualmente pegado a una pieza que se desplaza bajo él.

## Escritura humana

Los headings editables incluyen Hero, Snapshot, AI y References. El primer beat del Hero selecciona el titular completo, prueba `Javier Ortiz`, `Senior Product Designer` y el posicionamiento final; los demás pueden trabajar sobre un fragmento. Cada beat:

1. mide el fragmento real con `Range`;
2. mueve el cursor a su extremo —o consume las coordenadas del cursor que acaba de pulsar Present—;
3. arrastra la selección con el azul Figma y puede volver a seleccionar el bloque completo;
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
- reacción específica a `No thanks` sin crear memoria narrativa;
- rotación de copy entre visitas consentidas y límite de tier 5;
- disparadores de tiempo, fast scroll, pausa, final, retorno y revisita sin persistir esas señales;
- ausencia completa en touch, reduced motion, no-JS, Spotlight, Follow y consentimiento;
- `npm run lint`, `npm test` y `npm run test:e2e`.
