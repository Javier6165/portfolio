# Plan 21 — Dirección de arte estática: precisión, contraste y carácter

Fecha: 20 de septiembre de 2026.
Estado: implementado localmente el 21 de septiembre de 2026; pendiente de revisión de Javier. No publicado ni fusionado.
Autoría: criterio propio de Astra a partir de la revisión visual de la Home publicada; sin skills ni auditorías delegadas en esta revisión.

## 1. Encargo y límites

Elevar el look and feel de la Home clara existente. La ambición de Pentagram, Awwwards o «top 1%» se interpreta como exigencia de dirección de arte, no como un estilo que copiar ni como una certificación que podamos atribuirnos.

La mejora debe percibirse en capturas estáticas, con exactamente el mismo contenido y los assets provisionales actuales. Este sprint no se puede justificar diciendo que mejorará cuando lleguen las imágenes finales o el motion.

### Incluido

- Tipografía, composición, retícula, jerarquía, ritmo, proporciones de media y detalles del UI de la Home.
- Header y footer visibles en Home; estados funcionales de navegación, FAQ y modal de vídeo.
- Responsive y accesibilidad de lo modificado.
- Documentación del sistema realmente elegido y evidencia visual antes/después.

### Excluido

- Cambiar, acortar, reescribir o eliminar contenido, citas, metadatos o avisos provisionales.
- Cambiar el orden de secciones aprobado en Plan 18.
- Animaciones, transiciones decorativas, efectos, vídeo nuevo, scroll dirigido o revelados.
- Director, Follow, intro Figma, memoria narrativa y metáfora de portfolio inacabado.
- Rediseñar interiores de casos, About o Playground. Solo comprobar que los estilos compartidos no los deterioran.
- Generar nuevas imágenes, inventar pantallas o comprar fuentes.
- Publicar, hacer push o fusionar a main. La autorización anterior de publicación no se extiende automáticamente a este candidato.

No instalar nuevas librerías de UI para este trabajo. Mantener las interacciones existentes y su semántica; «estático» no significa inutilizar botones o acordeones.

## 2. Punto de partida y precedencia

Baseline identificada en el repositorio: commit `05e18de` (`Publish approved static light portfolio home`), rama `design/ordered-static-home`. Antes de ejecutar, comprobar el estado real: no asumir que sigue sin cambios.

Referencia publicada revisada: https://javier-ortiz-portfolio.malapipa.chatgpt.site/

Este plan desarrolla la crítica visual posterior a Plan 20. Para este sprint:

1. Plan 18 conserva contenido y orden.
2. Plan 19 conserva la dirección clara, la base accesible y los contratos funcionales. Sus tamaños, fuente y recetas compositivas pueden revisarse aquí.
3. Plan 21 es la guía específica del refinamiento visual cuando Javier encargue ejecutarlo.
4. Plan 20 queda como contexto: no ejecutar automáticamente sus pendientes.

En particular, no aplicar el límite de tres líneas a testimonios, no reescribir CTA por el estado del contenido, no retirar retratos por falta de material y no convertir el «borde de evidencia» en una firma obligatoria. No recuperar sin más el experimento de retícula que Javier descartó.

Los documentos históricos todavía contienen referencias a Dark y Live File: no son el contrato actual de Home. Mantener noindex/nofollow, privacidad, integridad de evidencia y el proyecto Sites existente.

## 3. Diagnóstico que debe resolver la implementación

| Observación en la web revisada | Efecto visual | Respuesta que se debe comprobar |
| --- | --- | --- |
| Titulares de Hero, About, People y Contact con voz muy parecida y tracking compacto | Homogeneidad, poca delicadeza y demasiados protagonistas | Separar roles tipográficos y graduar su intensidad |
| Hero resuelto como texto grande + retrato lateral + dos acciones | Correcto, pero intercambiable | Una relación más intencional entre bloque de texto, retrato y espacio |
| Secciones coherentes por separado, con pocos ejes reconocibles entre ellas | La retícula se percibe como maquetación técnica | Repetir unos pocos ejes editoriales con funciones claras |
| Atribución de la cita principal muy alejada de su texto | El vacío parece sobrante y se pierde asociación | Mantener cita y autor como unidad visual |
| Labels arriba y textos al pie en Work y Lab | Repetición de cajas altas con contenido separado | Ajustar altura al contenido y reservar el vacío donde realmente componga |
| Un proyecto con enorme campo gráfico y dos casi solo textuales | Salto excesivo de categoría visual | Dar parentesco a las tres entradas sin igualar su importancia |
| Grandes masas fotográficas oscuras en Hero y About | Repetición de peso visual | Diferenciar proporción, escala y función mediante encuadre |
| Controles correctos pero convencionales | El detalle no refuerza una firma | Unificar proporción, peso óptico y estados tras resolver composición |

Estas son hipótesis de diseño basadas en el render, no errores técnicos demostrados por el CSS. Cada cambio debe superar una comparación visual con la baseline.

## 4. Dirección recomendada

**Editorial sobrio con contraste de escala y precisión óptica.** Mantener el campo claro, la tinta oscura, los rectángulos y la ausencia de tarjetas decorativas. Construir carácter mediante composición y tipografía.

Tres operaciones compartidas:

1. **Dos voces dentro del sistema:** afirmaciones expresivas frente a títulos que orientan. El Hero y el cierre tienen permiso para dominar; los nombres de secciones pueden ser sensiblemente más discretos.
2. **Ejes reconocibles:** margen principal para la lectura y uno o dos comienzos de columnas secundarias que reaparezcan con sentido en distintas secciones.
3. **Densidad variable:** alternar una apertura amplia, una banda compacta, trabajo visual, una pausa personal y un tramo de lectura más contenido.

No convertir estas operaciones en un recurso repetido literalmente. Evitar una columna estrecha de títulos a la izquierda de todas las secciones: esa receta se aproxima a la exploración ya rechazada.

### Conservar

- Paleta actual como baseline; no hace falta un color de marca nuevo para resolver el diagnóstico.
- Scroll nativo, lectura directa y navegación breve.
- Fotografías reales y assets locales existentes.
- Formas rectas, superficies planas y separadores discretos.
- Jerarquía de un proyecto principal y dos secundarios, con menor distancia visual entre categorías.

### Cuestionar

- Instrument Sans como obligación, tracking negativo uniforme y tamaño grande de todos los h2.
- Alturas mínimas que separan piezas relacionadas sin una razón compositiva.
- Uso del mismo espacio vertical para cada transición.
- Proporciones fotográficas actuales y predominio automático del retrato por altura.

### Evitar

- Añadir serif, mono, textura, numeración, retícula visible o imágenes arquitectónicas como atajos de sofisticación.
- Hacer todo más grande, más fino o más espaciado.
- Una composición distinta y arbitraria por sección.
- Reducir contraste o texto a tamaños minúsculos para simular lujo.
- Declarar una mejora por el nombre de una fuente o porque se han añadido tokens.

## 5. Sistema tipográfico: primer trabajo de diseño

### 5.1 Comparación acotada

Preparar un espécimen local temporal con el texto real de Hero, un título de proyecto, una cita completa, cuerpo, metadata y una acción.

Comparar como máximo tres soluciones:

- A: Instrument Sans actual, con su composición actual como control.
- B: Instrument Sans afinada: pesos menos uniformes, tracking más abierto y medidas específicas por rol.
- C: una grotesca alternativa, solo si existe un candidato con licencia verificable y uso local permitido que aporte una diferencia visible. No repetir una comparación marginal solo por cumplir el procedimiento.

Las pruebas de familia parten del mismo layout para aislar su efecto. Después se afina la composición de la opción elegida. Si no hay una mejora clara con C, elegir B. No usar archivos de `public/fonts/` sin comprobar su procedencia y licencia; actualmente hay archivos no versionados allí que deben preservarse.

No añadir una segunda familia salvo que las pruebas demuestren una función imposible de resolver bien con la primera. Este plan recomienda comenzar con una sola.

### 5.2 Roles y rangos de exploración

Son puntos de partida, no especificaciones finales que aplicar ciegamente. Valores en px equivalentes; implementar con unidades escalables y verificar zoom.

| Rol | Desktop, punto de partida | Móvil, punto de partida | Criterio |
| --- | --- | --- | --- |
| Hero display | 76–104 / line-height 1.00–1.06 | 44–60 / 1.02–1.08 | Contorno memorable, lectura relajada, sin colisiones |
| Statement About / Contact | 44–68 / 1.04–1.12 | 32–44 / 1.08–1.16 | Menos autoridad que Hero; continuidad sin clonarlo |
| Título orientativo de sección | 24–36 / 1.15–1.25 | 22–30 / 1.15–1.25 | Orientar sin competir con contenido |
| Título de proyecto | 32–46 / 1.08–1.18 | 28–36 / 1.10–1.20 | Protagonista dentro de su entrada |
| Cita principal | 28–36 / 1.20–1.32 | 23–28 / 1.25–1.35 | Lectura sostenida; no apariencia de h2 |
| Cita secundaria | 21–26 / 1.25–1.40 | 20–24 / 1.28–1.42 | Parentesco claro con principal |
| Cuerpo | 17–19 / 1.45–1.60 | 16–18 / 1.45–1.60 | Medida cómoda, contraste suficiente |
| Metadata | 13–14 / 1.35–1.50 | 13–14 / 1.35–1.50 | Legible sin zoom, sin mayúsculas sistemáticas |

Explorar tracking del display entre aproximadamente -0.02em y -0.04em, en vez de heredar -0.055em indiscriminadamente. No tratar esos números como garantía: el dibujo de cada fuente manda. Cuerpo y metadata próximos al espaciado natural.

Medidas iniciales: cuerpo 45–65 caracteres; copy lateral 32–45; cita principal 35–48. Ajustar según render, no imponer un mismo max-width a todo.

### Gate tipográfico

- El Hero se distingue de un encabezado de sección sin depender únicamente del tamaño.
- Las citas se leen como voz humana y no como titulares publicitarios.
- No hay letras ópticamente pegadas, líneas finales accidentales ni recorte de ascendentes/descendentes.
- Saltos de línea comprobados en varios anchos. Se permiten saltos editoriales adaptativos sin duplicar contenido accesible; no forzar la misma silueta en móvil y desktop.
- Documentar la elección con capturas y razones concretas; «se ve más premium» no basta.

## 6. Retícula y espacio: reglas ejecutables

- Mantener inicialmente 12 columnas desktop, 6 tablet y 4 móvil y el ancho máximo existente. Cambiar esas bases solo si la comparación demuestra un beneficio.
- Definir un eje A en el margen de lectura, un eje B para la división editorial principal y, cuando sea necesario, un eje C para anotaciones/acciones. Sus posiciones salen de spans reales, no de porcentajes aislados por sección.
- Dibujar esos ejes en capturas de trabajo o usar una ayuda de depuración local; nunca dejarlos visibles en la entrega.
- Reutilizar B en al menos tres composiciones con funciones compatibles. No alinear elementos sin relación únicamente para cumplir la regla.
- Agrupar espacios por función: entre texto y autor; entre título y cuerpo; entre entradas; entre capítulos. Un token de sección único no debe decidir todas las transiciones.
- Explorar separaciones de capítulos compactas/medias/amplias, por ejemplo 64/96/128 px en desktop y 48/64/80 en móvil. Validar el recorrido completo antes de fijarlas.
- No usar alturas fijas de texto. Reservar aspect-ratio para media y permitir que el contenido aumente la altura.
- Permitir correcciones ópticas pequeñas documentadas. El sistema no debe impedir ajustar comillas, flechas o bordes aparentes de letras.
- No añadir divisores si la composición ya separa inequívocamente dos unidades.

## 7. Cambios por sección

### 7.1 Header

Mantener nombre y cuatro destinos. Refinar proporción del nombre, navegación, altura de barra y separación con Hero. Comprobar si la línea inferior ayuda a la composición o la fragmenta; conservarla solo si tiene función visual clara.

No crear monograma, slogan, menú experimental o cabecera sticky nueva. Alinear nombre y extremos de navegación con los ejes de página. Revisar menú móvil abierto, foco y targets táctiles.

**Aceptación:** discreto pero cuidado; no parece una barra de navegación genérica pegada encima de otra pieza.

### 7.2 Hero — prioridad máxima

Mantener todo el contenido y ambas acciones. Probar dos composiciones locales, además de la baseline:

- **A, recomendada:** bloque tipográfico con mayor jerarquía interna, retrato algo menos alto y relación deliberada entre el comienzo del titular y la zona de los ojos. Identidad/rol cerca del inicio de lectura; resumen y acciones como una segunda unidad cohesionada. Imagen en unas 4–5 columnas, texto en unas 6–7, con separación clara.
- **B, contraste controlado:** titular más ancho dentro de la retícula y retrato ligeramente desplazado verticalmente; sin texto sobre la cara, solapes decorativos ni simetría obligatoria. El desplazamiento debe crear un borde común con resumen/acciones, no parecer un error de alineación.

La comparación debe mostrar una diferencia compositiva real, no dos variaciones de padding. Elegir una sola; retirar la otra del código entregado.

Recomponer las líneas de la frase conservando el texto. Probar agrupaciones semánticas claras de «I design the calm / inside complex / products» y otras que produzcan mejor silueta según el ancho. No dar esa división por definitiva. No comprimir letras para forzarla.

El nombre/rol, el titular y las acciones deben leerse como una composición relacionada. Proteger el retrato: ojos, rostro y hombros sin cortes torpes; ajustar object-position por breakpoint si hace falta.

**Aceptación:** la portada sigue teniendo interés compositivo al sustituir mentalmente la foto por un campo neutro; la fotografía la potencia. En laptop se comprende la jerarquía de un vistazo. No encoger texto ni ocultar acciones para forzar todo a un viewport de poca altura.

### 7.3 Snapshot

Mantener cuatro hechos y su jerarquía equivalente. No recuperar el «5+» monumental del experimento rechazado.

Reducir la sensación de cuatro pequeñas cajas: alinear labels, datos y descripciones con ritmo común, preservar separación suficiente y revisar necesidad/altura de reglas verticales. Admitir líneas distintas sin forzar alturas o pesos inconsistentes.

**Aceptación:** transición compacta entre Hero y Work; en móvil, 2×2 legible con agrupaciones inequívocas y sin apariencia de dashboard.

### 7.4 Selected Work

Reducir el protagonismo del título orientativo y aumentar la cohesión entre nombre, título, descripción y metadata de cada proyecto. Eliminar separaciones producidas solo por margin-top:auto o alturas mínimas si no sostienen una intención visual.

Mantener el caso principal como apertura. Ajustar la relación imagen/copy hacia un formato editorial menos alto si eso mejora su lectura. No evaluar la calidad del artefacto provisional LOGICX como si fuera el trabajo final.

Para los dos secundarios, ensayar una familia de entradas con un campo visual más compacto, título y metadata en posiciones compatibles con el caso principal. Pueden ser placeholders geométricos neutros construidos en CSS, sin imágenes inventadas ni marcas nuevas. No añadir texto explicativo nuevo: conservar los avisos existentes. Si el campo no mejora la composición, mantener la entrada tipográfica y reforzar parentesco mediante escala, ejes y proporciones.

**Aceptación:** se reconocen tres proyectos de la misma familia; uno es principal, los otros no parecen notas al pie. Límites entre entradas claros sin tarjetas cerradas. Los tres títulos y sus textos permanecen completos.

### 7.5 About de la Home

Conservar retrato y texto. Evitar otro bloque de presencia casi idéntica al Hero: escala fotográfica algo más contenida, encuadre con más contexto y titular menos compacto.

Relacionar imagen y texto por un borde elegido y explicado. No mantener obligatoriamente alineación al pie si genera una gran zona muerta encima del texto. Probar alineación de inicio del bloque textual con una zona significativa del retrato, conservando suficiente aire.

**Aceptación:** una pausa más personal, con intensidad menor al Hero. La repetición de material fotográfico no domina el recorrido. No requiere sustituir assets.

### 7.6 Testimonios

Conservar las tres citas completas y todas las atribuciones. Dar más protagonismo a las citas que al título de la sección.

Punto de partida recomendado: cita principal en una columna algo mayor y dos secundarias al lado, pero con alturas dirigidas por contenido. Cada autor sigue a su cita con separación de grupo de aproximadamente 24–32 px, no queda pegado al fondo de una caja alta.

Si el desequilibrio sigue siendo fuerte, probar una cita principal horizontal y dos secundarias debajo. Elegir según lectura del texto completo, no por simetría. Ajustar tipografía de cita independientemente de títulos; afinar comillas y sangría óptica sin quitar puntuación.

**Aceptación:** asociación cita/autor inmediata, ninguna gran zona vacía sin función, buena lectura de todas las citas y claro contraste con Work/About. Prohibido truncar, usar line-clamp o carrusel para simplificar el layout.

### 7.7 Lab

Mantener contenido, placeholder y posición. Dar al título «Lab» función de identificación en vez de competir por tamaño con Hero.

Recomponer placa y explicación como un conjunto más compacto: formato visual preferentemente más apaisado, texto asociado a su borde o a una columna contigua de lectura natural. Quitar la separación extrema entre eyebrow arriba y cuerpo abajo.

El juego tipográfico Question / Prototype / Learning puede permanecer; revisar escala y composición interna para que no sea otro gran titular de la página. No convertirlo en un diagrama funcional nuevo ni simular un proyecto.

**Aceptación:** cambio de ritmo visible, contenido agrupado y ausencia de altura de relleno. Se sostiene con el placeholder actual.

### 7.8 How I Work

Mantener questions, answers y comportamiento nativo. Título de sección más silencioso; preguntas con jerarquía propia y respuesta con medida cómoda.

Afinar altura cerrada, espaciado abierto, peso de signos +/− y posición de las respuestas. Evitar que cada fila se vuelva monumental. No estrechar tanto la lista que las preguntas largas rompan innecesariamente.

**Aceptación:** pausa de lectura controlada; signos ópticamente centrados; toda la pregunta activable, foco visible, respuesta sin cortes en zoom y móvil. Conservar el estado inicial de apertura existente.

### 7.9 Contact y footer

Mantener frase, disponibilidad, enlace, avisos y metadatos. Recuperar cierta fuerza tipográfica para cerrar, diferenciándola del Hero por medida/composición, sin otro máximo de tamaño automático.

Relacionar CTA y disponibilidad con la frase; evitar que parezcan una tarjeta lateral separada. Revisar espacio final y regla de metadatos. No añadir un gran nombre ornamental ni nuevos destinos.

**Aceptación:** se siente como cierre del recorrido; la acción es visible y la jerarquía distinta de una sección intermedia.

### 7.10 Modal de vídeo y estados

No cambiar funcionalidad ni introducir reproducción falsa. Heredar la tipografía, controles y espaciados elegidos. Revisar cerrado/abierto, cierre, teclado y tamaño móvil. Mantener aviso de placeholder.

## 8. Implementación y puntos de entrada

Confirmar estos archivos antes de editar; son los puntos de entrada observados, no autorización para cambiar todo su contenido:

- `app/ordered-home.css`: tokens de Home/About, cabecera, acciones y footer.
- `app/HomePage.module.css`: composición y responsive de secciones.
- `app/page.tsx`: estructura Home; conservar strings y orden.
- `app/components/Hero.tsx` y sus estilos: composición del Hero y acceso al vídeo.
- `app/components/Testimonials.tsx` y sus estilos: citas y atribuciones.
- `app/components/SiteShell.tsx`: elementos compartidos, flechas y footer; comprobar consumidores.
- `app/layout.tsx`: cargas de fuentes; tocar únicamente si cambia la decisión tipográfica.
- `tests/rendered-html.test.mjs` y `tests/e2e/`: validación.

No sumar una nueva capa de overrides al final para cada iteración. Consolidar las reglas ganadoras y retirar solo las alternativas creadas en este sprint. Mantener tokens por rol, no una abstracción por cada valor aislado.

Atención: Home y About comparten variables en `ordered-home.css`. Acotar experimentos a Home o verificar ambas rutas antes de declarar una variable compartida. No hacer una limpieza global de código legacy en este encargo.

## 9. Secuencia de ejecución y entregables

### Fase 0 — Baseline reproducible

1. Leer instrucciones vigentes y este plan; revisar rama, diff y archivos no versionados.
2. Preservar cambios ajenos. No resetear al commit de referencia ni borrar fuentes locales.
3. Capturar la versión inicial en desktop y móvil, con fuente cargada y viewport registrado. Guardar capturas por sección y una vista general si el navegador la captura correctamente.
4. Registrar orden y contenido textual para comparar al terminar.

Entregable: baseline y lista concreta de puntos a cambiar. No volver a auditar contenido.

### Fase 1 — Tipografía + Hero

1. Comparación tipográfica acotada.
2. Dos composiciones de Hero con una misma tipografía candidata.
3. Comparar a igual viewport con baseline y entre sí.
4. Elegir una solución razonada, comprobar móvil/laptop y fijar tokens provisionales.

Gate: mejora visible en jerarquía y silueta, no solo pequeños cambios de tracking. Si la candidata no mejora, conservar baseline y revisar la hipótesis; no propagar una solución débil.

### Fase 2 — Demostrar el sistema

Aplicar primero a Work, testimonios y Lab. Son las tres pruebas de que la dirección resuelve imagen, lectura larga y composición gráfica sin repetir una plantilla.

Gate: los tres capítulos tienen distinta densidad y el mismo lenguaje. Ajustar tokens antes de seguir si solo funciona Hero.

### Fase 3 — Completar el recorrido

Aplicar a Header, Snapshot, About, FAQ, Contact y modal. Hacer una lectura continua para ajustar transiciones, no aprobar cada sección exclusivamente de forma aislada.

### Fase 4 — Responsive y acabado óptico

Revisar 1440×900, 1280×800, 1100×900 (próximo a la captura revisada), 768×1024, 390×844 y 360×800. Añadir comprobación continua alrededor de los breakpoints, no solo esos tamaños exactos.

Afinar wraps, cuerpos, crops, reglas, flechas, foco y agrupaciones. En móvil no trasladar vacíos de desktop ni forzar el primer viewport completo.

### Fase 5 — QA, consolidación y handoff

1. Ejecutar desde `site/`: `npm run lint`, `npm test`, `npm run test:e2e`.
2. Separar fallos nuevos de problemas preexistentes. No eliminar tests para conseguir verde; actualizar aserciones visuales obsoletas solo con explicación y conservar cobertura funcional.
3. Comparar contenido y orden con baseline; comprobar anchors, menú, FAQ, modal, navegación y foco.
4. Revisar sin JavaScript, reduced motion, zoom 200%, overflow, carga/fallo de imagen y fallback de fuente.
5. Comprobar ausencia de Director, animaciones de entrada y cambios de privacidad/indexación.
6. Consolidar CSS y documentar decisiones finales, excepciones y pendientes.
7. Entregar preview local y comparativas a Javier. No publicar ni hacer push en esta fase.

Durante las fases 1–4: observar en navegador → identificar hasta tres problemas de mayor impacto → corregir → recapturar al mismo tamaño → comparar. No dar una sección por terminada con su primera implementación. Las siguientes rondas deben responder a observaciones concretas, no introducir novedad por introducirla.

## 10. Criterios de aceptación globales

### Visuales

- Hero reconocible por la organización de masas y tipografía, además de por la foto.
- Titulares orientativos claramente subordinados a afirmaciones y piezas protagonistas.
- Citas, cuerpo y metadata con roles legibles y distintos.
- Retícula reconocible por relaciones entre contenidos, sin malla decorativa añadida.
- Espacios grandes intencionados; cita/autor y label/copy no se separan accidentalmente.
- Work conserva tres entradas visualmente emparentadas.
- El recorrido contiene cambios de densidad, sin tres capítulos consecutivos con la misma fórmula.
- La versión móvil tiene composición propia, sin ser solo columnas de desktop apiladas con sus vacíos.
- La candidata mejora frente a baseline con los mismos assets y textos. No atribuir la mejora a contenido nuevo.

### Funcionales y técnicos

- Sin pérdida de contenido, destinos, avisos, citas ni jerarquía semántica.
- Texto normal con contraste mínimo AA 4.5:1; texto grande 3:1; controles/foco perceptibles. Los hairlines decorativos no sustituyen límites funcionales necesarios.
- Controles cómodos para touch (objetivo de al menos 44×44 px), foco visible y sin overflow horizontal.
- Fuentes con licencia documentada, carga local autorizada y fallback probado; sin dependencias nuevas innecesarias.
- Tests y revisión visual completados, sin afirmar calidad artística basándose solo en tests.

## 11. Qué debe entregar Sol

1. Implementación local de una sola dirección elegida, sin selector de variantes ni pruebas temporales en la Home final.
2. Una página de sistema final: roles tipográficos, ejes, espacios, proporciones, controles y excepciones.
3. Comparativas antes/después de Hero, Work, testimonios y Lab a igual viewport; vistas móviles y resumen del recorrido.
4. Resumen de decisiones: qué cambió, por qué mejora y qué hipótesis se descartó.
5. Resultados de QA y pendientes reales. No usar «top 1% conseguido» como criterio de cierre.

La revisión de Javier decide si esta dirección sustituye a la publicada. Si una alternativa no supera a la baseline, reconocerlo y conservar la parte mejor resuelta.

## 12. Prompt de arranque para la siguiente sesión

> Ejecuta `docs/PLAN-21-STATIC-ART-DIRECTION-REFINEMENT.md` por fases sobre la Home actual. El alcance es únicamente UI estático y sistema visual: conserva contenido, orden, assets provisionales y funcionalidades. Empieza por baseline, comparación tipográfica y Hero; luego demuestra el sistema en Work, testimonios y Lab antes de extenderlo. Usa navegador real y comparativas al mismo viewport durante las iteraciones. No recuperes el experimento de retícula rechazado ni Director/Figma/Follow. No añadas motion, no publiques y no hagas push. Preserva cambios ajenos y entrega preview local, decisiones de sistema, antes/después y QA. Sigue los límites y gates del plan; no lo reduzcas a cambios cosméticos de padding.

## 13. Resultado local del 21 de septiembre

- Instrument Sans se mantiene como única familia. La jerarquía se separó por función y el Hero utiliza la variante itálica local únicamente en `calm`.
- Hero conserva la estructura texto/retrato, con tracking más abierto, una relación más precisa con la fotografía y una composición móvil específica.
- Snapshot se compactó sin convertir un dato en protagonista.
- Work reduce el volumen del encabezado, elimina alturas de relleno y aproxima visualmente los tres proyectos sin añadir material ficticio.
- About reduce su masa fotográfica y alinea el relato como pausa personal.
- People acerca cada autor a su cita y diferencia voz testimonial de titular de sección.
- Lab adopta una placa más apaisada en desktop y ocupa el ancho de lectura en móvil.
- FAQ y Contact cierran con una escala propia, manteniendo disclosure nativo y acción existente.
- Modal de vídeo adopta la nueva jerarquía sin cambiar el estado honesto de preview.
- `DESIGN.md` documenta los roles, ejes y excepciones finales.

Validación completada: lint limpio, build + 9 tests Node, 17 tests E2E superados y 5 omisiones intencionales de matriz móvil. Revisión visual en 1440×900, 1280×800, 1100×900, 768×1024, 390×844, 360×800, modal y recorrido completo; sin overflow horizontal. Las comparativas locales viven en `test-results/plan21-*` y no forman parte del producto.
