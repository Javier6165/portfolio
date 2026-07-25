# Plan 10 — Experience chrome

Estado: **implementado y validado**.

## Veredicto de la auditoría

La página ya tiene una firma visual y una coreografía transversal. El problema prioritario no es falta de escenas: después del hero, una Home extensa pierde orientación porque la cabecera deja de acompañar la visita, no existe una lectura de progreso y varias respuestas de las tarjetas de proyecto son exclusivas del ratón.

Añadir otro efecto aumentaría el ruido sin mejorar la comprensión. Esta iteración refuerza el sistema de navegación que envuelve la experiencia y deja intacta la partitura `Live File`.

## Objetivos

1. Mantener navegación y cambio Dark/Light disponibles durante toda la visita.
2. Hacer visible la posición dentro de la Home sin convertir el scroll en una timeline controlada.
3. Dar a las secciones una estructura de capítulos discreta y accesible.
4. Igualar la calidad de respuesta de teclado y ratón en los casos.
5. Mejorar el coste del seguimiento del puntero sin añadir dependencias.

## Implementación

### 1. Cabecera persistente y progreso

- La cabecera pasa a ser fija.
- En la parte superior conserva el aspecto ligero actual.
- Tras el primer desplazamiento adopta una superficie translúcida, borde y altura más compacta.
- Una línea de un píxel indica el progreso total de página.
- Durante la intro sigue obedeciendo a `data-narrative`; no aparece antes del momento previsto.
- Los destinos con `id` reservan espacio para que la cabecera no oculte sus títulos.

### 2. Navegación contextual de Home

Un componente cliente pequeño observa la posición de scroll y expone ocho capítulos:

1. Profile
2. Work
3. Approach
4. AI + code
5. Playground
6. About
7. Testimonials
8. Contact

En escritorio se muestra como un rail lateral derecho con `aria-current`. En tablet y móvil se oculta: la línea de progreso y la navegación móvil persistente ya resuelven orientación y acceso sin invadir el contenido.

El cálculo usa eventos pasivos y una única actualización por frame. El scroll permanece nativo; no hay scroll-jacking ni suavizado impuesto.

### 3. Paridad de interacción

- Las tarjetas de proyecto muestran profundidad y separación visual también con `focus-visible`.
- El seguimiento del puntero se limita a un `requestAnimationFrame` y reutiliza el rectángulo medido al entrar en la tarjeta.
- Al salir se eliminan las coordenadas locales y cualquier frame pendiente.
- Touch y reduced motion mantienen el estado estable existente.

## No incluido

- Nuevas escenas o comentarios `Live File`.
- Contenido profesional inventado.
- Nuevas librerías.
- Scroll suave, scroll-jacking o navegación que sustituya el scroll del navegador.
- Cambios en memoria, consentimiento o rutas públicas.

## Validación

- Cabecera y menú móvil accesibles después de desplazarse.
- Capítulo activo y progreso correctos en Home.
- Rail ausente en rutas interiores y pantallas estrechas.
- Navegación por teclado equivalente en casos.
- Sin solapes, overflow ni regresiones en Dark/Light.
- Reduced motion, no-JavaScript y los cuatro viewports de referencia.
- `npm run lint`, `npm test` y `npm run test:e2e` completos.
- Comparación visual y de rendimiento antes de publicar una nueva versión privada.

## Resultado

- `PageProgress` mantiene el estado ligero de progreso, cabecera y capítulo activo con una sola actualización por frame.
- La cabecera es persistente en todas las rutas; el índice sticky de cada caso reserva su altura y no queda oculto.
- El rail de Home aparece únicamente en desktop después de comenzar la lectura, queda fuera del orden de foco mientras está oculto y usa `aria-current="location"`.
- En móvil permanece disponible el menú completo durante toda la página y el rail no compite con el contenido.
- Las tarjetas de proyecto comparten profundidad en hover y `focus-visible`; su cursor local ya no mide/escribe estilos por cada evento bruto.
- Se añadieron destinos estables para Playground y About preview.

Métricas comparables de build local:

| Métrica | 1440×900 | 390×844 |
| --- | ---: | ---: |
| Intro | 3,94 s | 3,88 s |
| CLS | 0,0073 | 0 |
| JS codificado | 456 KB | 456 KB |
| CSS codificado | 107 KB | 107 KB |
| Overflow horizontal | no | no |

El incremento frente al baseline es de aproximadamente 3 KB de JS y 4 KB de CSS, acotado a una capa de navegación que permanece disponible en toda la visita. No se añadió ninguna dependencia.
