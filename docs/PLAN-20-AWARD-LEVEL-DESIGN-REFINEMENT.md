# Plan 20. Refinamiento de dirección de arte y sistema

Estado: cortes A y B revisados. Javier aprobó publicar la composición anterior a la exploración de retícula del 20 de septiembre de 2026. El plan continúa abierto para evidencia y acabado.

### Decisiones de la pasada visual actual

- Bake-off con el copy real de Hero, Work y About: se mantiene una sola grotesca y se elige Instrument Sans Variable frente a Inter Variable. La ganancia es sutil, no un cambio de concepto; se ha comprobado en 390, 768 y 1440 px.
- Work deja de presentar los dos casos secundarios como mitades iguales: ahora son entradas de índice a todo el ancho, con rol, título y descripción alineados a la retícula. La cubierta de LogicX sigue siendo temporal y no se juzga como artefacto final.
- People pasa de tres columnas estrechas a una cita principal con dos citas de lectura cómoda en el lateral; en tablet y móvil se apilan. Las citas y sus fuentes siguen sujetas a la verificación prevista.
- Home y About comparten los mismos tokens. La cronología de About pierde el degradado, foco radial, caja redondeada y cambios por hover: conserva pestañas accesibles de selección directa en una composición editorial estática.
- Los placeholders de Work, Lab, vídeo y fotografía secundaria se sustituyen en un corte posterior. Esta revisión evalúa el sistema y la composición, no trata el material provisional como fallo de dirección de arte.

## Encargo

Elevar la Home estática a un nivel de portfolio internacional excepcional sin añadir una ficción nueva, motion obligatorio ni claims que todavía no tengan evidencia. La referencia de partida es Swiss / International Style con sensibilidad editorial contemporánea. El objetivo no es parecerse a una agencia genérica ni copiar Pentagram, sino construir una gramática que solo tenga sentido para el trabajo y la voz de Javier.

Este plan recoge tres lecturas:

- **Impeccable, revisión de dirección:** base clara, honesta y legible, pero todavía intercambiable; Work no permite inspeccionar ninguna pieza; Hero y About repiten retrato; la gramática de retícula, tipo, reglas y splits se repite demasiado; About conserva el corte visual de la dirección antigua.
- **Impeccable, comprobación técnica:** el detector sobre `app/page.tsx` no encontró patrones bloqueantes. Eso valida la higiene del markup, no la calidad artística. La evaluación independiente puntuó la experiencia en 20/28 heurísticas aplicables: suficiente usabilidad, no todavía especificidad de primer nivel.
- **Taste Skill:** baja densidad y precisión son adecuadas, pero Inter, seis destinos de navegación, tres columnas equivalentes, cabeceras partidas repetidas, copy meta y una placa tipográfica que simula identidad de proyecto son riesgos de solución intercambiable. La skill también obliga a comprobar móvil, contraste, CTA, ausencia de em-dashes y un único lenguaje de formas.

## Diagnóstico honesto

La Home actual está aproximadamente en el nivel de una buena primera dirección de arte, no en el 1% mundial. Sus fortalezas son reales: el Hero se entiende en un vistazo, la fotografía tiene presencia, el tratamiento de estados pendientes es honesto y el FAQ funciona sin depender de JavaScript. Sus límites también son claros:

1. La neutralidad tipográfica todavía no es una decisión con firma; se lee como una implementación competente de un portfolio editorial.
2. La retícula está descrita como sistema, pero el código la recompone con muchos `repeat(12)`, gaps y valores aislados. Los tokens no gobiernan todavía el layout.
3. Selected Work promete evidencia, pero el visitante no puede inspeccionar un caso. La placa `LOGICX` ocupa mucho espacio sin demostrar trabajo real.
4. Hero, Work, About, People y Lab comparten demasiado la misma cadencia: titular grande, explicación lateral, hairline y bloque paralelo.
5. El retrato aparece en Hero y About con crops distintos, pero no con funciones fotográficas suficientemente distintas.
6. La Home light enlaza a una ruta About todavía dark. La ruptura es pequeña técnicamente y grande en percepción de sistema.
7. La navegación ofrece seis destinos de primer nivel. Para un recruiter que escanea, People y How I work deben quedar dentro de la lectura, no competir con Work y Contact.

## Nueva regla de firma

La idea `I design the calm inside complex products` se traducirá a una operación visible y repetible: **una pregunta o contexto complejo entra por un borde de decisión y sale convertido en una conclusión clara**. La firma no será una textura ni una animación.

### El borde de evidencia

Cada capítulo tendrá un único borde de evidencia, siempre con contenido, no decorativo:

- en Snapshot, el borde contiene los hechos;
- en Work, contiene estado de evidencia y contribución pendiente;
- en About, contiene trayectoria y enlace a la historia;
- en People, contiene atribución y contexto;
- en Lab, contiene la pregunta detrás del experimento;
- en How I work, contiene la respuesta desplegada;
- en Contact, contiene la siguiente acción.

El borde puede cambiar de posición y densidad según la sección, pero nunca se dibuja como una cuadrícula de fondo. Se comprobará preguntando qué información organiza cada regla; si la respuesta es “hacer que parezca diseñado”, se elimina.

## Sistema v2 que se debe implementar

### 1. Tokens como fuente única

Crear un archivo de tokens de Home y hacer que los módulos consuman esos valores, sin inventar valores locales salvo excepciones documentadas.

- Color: `canvas`, `surface`, `ink`, `muted`, `line`, `line-strong`, `focus`.
- Espacio: escala 4/8 desde `--space-1` hasta `--space-10`; capítulos entre `--section-10` y `--section-12`.
- Retícula: `--grid-columns`, `--grid-gutter`, `--page-pad`, `--content-max` con contratos explícitos para 12 columnas desktop, 6 tablet y 4 móvil.
- Tipo: `display`, `section`, `body`, `meta`, con medida y line-height semánticos, no solo tamaños.
- Media: proporciones permitidas, posiciones de crop y reglas de prioridad de carga.
- Capas: únicamente header, dialog y focus; nada de z-index arbitrario.

Gate: una revisión de CSS no debe encontrar una nueva medida de spacing o color que no tenga nombre o una excepción explicada.

### 2. Tipografía con carácter, no con adorno

Hacer un bake-off de un máximo de tres grotescas con licencia y carga local. Inter no queda prohibida, pero deja de ser el valor por defecto por inercia. Elegir una sola familia final si puede resolver display, cuerpo y metadata con calidad; no introducir una serif o una mono para “parecer editorial”.

La decisión se hará con el copy real de Hero, Work y Contact en 390, 768 y 1440 px. Se medirá:

- saltos de línea naturales;
- lectura de cuerpo a 16-20 px;
- contraste de pesos;
- comportamiento con zoom al 200% y textos largos;
- personalidad sin perder calma.

La tipografía solo se cambia si mejora la voz y la retícula a la vez. Un nombre más llamativo que rompa la lectura no pasa el gate.

### 3. Gramática de composición

Definir cuatro arquetipos y asignarlos una sola vez, con una excepción justificada:

1. **Asymmetric split:** Hero, texto y retrato con una relación 7/5 clara.
2. **Evidence band:** Snapshot y Contact, compactos y horizontales.
3. **Editorial index:** Work, con un caso dominante y secundarios como entradas de índice, no como cards iguales.
4. **Portrait / proof / disclosure:** About, People, Lab y FAQ deben pertenecer cada uno a una composición distinta: retrato narrativo, citas con jerarquía, pregunta y artefacto, y lista funcional.

No se permiten tres cabeceras partidas consecutivas. No se permite que un título grande y un párrafo flotante a la derecha sean la solución por defecto de todas las secciones. Cada capítulo debe poder describirse con un verbo: identificar, probar, contextualizar, acreditar, experimentar, responder, contactar.

### 4. Navegación y carga cognitiva

Reducir el primer nivel de desktop a `Work`, `About`, `Lab` y `Contact`. `People` y `How I work` permanecen en el flujo de la Home y pueden tener anclas, pero no compiten como decisiones primarias. El menú móvil conserva los mismos cuatro destinos y un orden idéntico.

El Hero mantiene una sola acción primaria, `View selected work`; el vídeo queda como acción secundaria. No se duplican intenciones de CTA ni se presentan seis opciones antes de que el visitante haya visto evidencia.

### 5. Hero y primer viewport

El Hero debe ser una composición terminada incluso sin el resto de la página:

- desktop: titular, rol, resumen, CTA y retrato dentro del viewport inicial;
- móvil: nombre, rol y titular deben preceder al retrato para que el valor profesional no quede detrás de una imagen;
- no añadir eyebrow ornamental, versión, status strip ni cue de scroll;
- usar una sola línea de tensión tipográfica, no cinco mensajes pequeños;
- mantener el retrato auténtico, con crop protegido y prioridad de carga.

### 6. Work: evidencia antes que teatro

Mientras no haya screenshots, prototipos o artefactos aprobados, la cubierta de LogicX no se tratará como una identidad visual acabada. Debe comunicar “caso en preparación” con precisión editorial y ocupar el espacio que merece, sin simular una marca ni un producto.

Cuando llegue el material real, cada caso debe tener:

- una imagen o captura auténtica con proporción reservada;
- una caption funcional que diga qué se ve;
- contribución de Javier separada de contexto del equipo;
- estado de evidencia y permiso de publicación;
- una entrada dominante y dos entradas secundarias con ritmos distintos.

Un visitante que pulse `View selected work` debe poder inspeccionar al menos un caso aprobado. Si no es posible, el CTA debe describir la selección como preview y no prometer una lectura completa.

### 7. People: prueba reconocible

Las recomendaciones deben parecer testimonios en el primer segundo. Limitar cada extracto a un máximo de tres líneas en desktop, conservar nombre, relación y contexto, y no usar una frase larga como textura tipográfica. No publicar citas hasta tener fuente, permiso y aprobación de Javier. El sistema puede estar listo antes que el contenido.

### 8. About, Lab y rutas secundarias

About debe recibir los mismos tokens light antes de que su enlace sea un destino primario. No se acepta una Home coherente que abre una segunda identidad al primer clic.

Lab no debe gastar un gran bloque visual en explicar que algún día habrá experimentos. Hasta que existan piezas reales, usar una composición de índice más compacta y explícita: qué se está preparando, qué tipo de artefacto aparecerá y qué no es todavía. El gran gesto visual se reserva para el primer experimento auténtico.

### 9. Media y dirección fotográfica

Hero y About no pueden depender del mismo retrato con otro crop. Asignar funciones: Hero identifica; About contextualiza. Si solo existe un retrato aprobado, el segundo módulo debe resolverse con espacio y copy, no con una repetición que parezca falta de material.

No se generan screenshots ficticios ni se usan imágenes arquitectónicas como sustituto de evidencia de producto. Los assets faltantes se dejan nombrados y medidos.

## Plan por cortes

### Corte A: sistema ejecutable

- crear tokens y primitivas de grid, container, type, rule, action, media y disclosure;
- documentar excepciones y eliminar hardcodes repetidos;
- resolver navegación de cuatro destinos;
- fijar una familia tipográfica después del bake-off;
- llevar About al mismo contrato light.

### Corte B: jerarquía y ritmo

- recomponer Hero móvil;
- separar arquetipos de Work, People, Lab y FAQ;
- reducir cabeceras partidas y líneas decorativas;
- dar al footer una acción de contacto más inequívoca;
- ajustar citas al límite de lectura.

### Corte C: evidencia real

- sustituir LogicX por el primer artefacto aprobado;
- sustituir la repetición de retrato si aparece un segundo asset;
- añadir captions, alt, procedencia y estado de permiso;
- decidir si el tercer slot de Work se mantiene visible o se retira hasta tener caso.

### Corte D: acabado

- revisión visual en 1440×900, 1280×800, 768×1024, 390×844 y zoom 200%;
- contraste y focus states;
- navegación teclado y FAQ/dialog;
- no-JavaScript, reduced motion y carga lenta;
- revisión de copy completa: eliminar em-dashes, microcopy performativo, precisión falsa y promesas no demostradas.

## Definition of done

No se llamará a la Home “top 1%” por una impresión subjetiva. El corte se considera listo para revisión de Javier cuando:

- el sistema se puede explicar en una página y el CSS lo cumple;
- la firma del borde de evidencia organiza contenido real, no decoración;
- ningún capítulo repite la misma composición por comodidad;
- el primer viewport identifica a Javier y su acción sin scroll;
- Work ofrece evidencia inspeccionable o declara claramente que aún no la ofrece;
- no hay ruptura visual entre Home y About;
- cada asset tiene función y no hay retratos repetidos sin motivo;
- el detector no encuentra patrones bloqueantes y los tests de lint, unitarios y e2e pasan;
- la revisión de una captura estática sigue siendo convincente sin motion.

## Fuera de este plan

No se reintroducen Figma Live File, Director, Follow, una nueva capa narrativa, auto-scroll, GSAP, WebGL ni una página de caso inventada. No se publica ni se fusiona a `main` hasta que Javier revise el siguiente corte.
