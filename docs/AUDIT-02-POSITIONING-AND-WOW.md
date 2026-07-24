# Auditoría 02 — posicionamiento, personalidad y efecto wow

Fecha: 24 de julio de 2026  
Estado: propuesta de dirección; todavía no sustituye las decisiones vigentes de `DECISIONS.md`.

## Objetivo

Revisar Preview 1 a partir del feedback de Javier y preparar la siguiente iteración para que el portfolio:

- posicione con precisión a un Senior Product Designer con experiencia breve de lead;
- haga visible una práctica de diseño y prototipado apoyada por IA;
- presente bien productos complejos como rule engines, CMS, backoffice y frontends de casino;
- soporte capturas y prototipos de Figma, demos web y vídeo;
- sea memorable sin sacrificar la lectura rápida que necesita un recruiter.

## Alcance de la auditoría

La revisión combina:

- inspección del código, la arquitectura y la documentación de Preview 1;
- feedback directo de Javier sobre la experiencia publicada;
- investigación de portfolios de producto, portfolios interactivos, Awwwards, 21st.dev y guías de recruiters;
- documentación oficial de Figma, GSAP, Three.js, Blender y MDN.

El preview publicado es privado y mostró una pantalla de autenticación. No se inició sesión porque eso podía compartir identidad o datos de cuenta sin autorización explícita. Queda pendiente una segunda pasada visual, hover por hover y dispositivo por dispositivo, cuando Javier abra el preview en una sesión autorizada o exista una URL accesible.

## Veredicto

Preview 1 es una base sólida y cuidada, pero ha optimizado demasiado la contención. Comunica criterio editorial y orden; todavía no demuestra una voz personal ni un nivel de craft interactivo que se recuerde después de cerrar la pestaña.

El problema no se resuelve añadiendo animación a todo. Faltan tres cosas coordinadas:

1. una tesis profesional más propia y específica;
2. una interacción emblemática que convierta esa tesis en experiencia;
3. una capa distribuida de microinteracciones que haga que cada superficie responda con intención.

### Scorecard de Preview 1

| Dimensión | Nota | Lectura |
| --- | ---: | --- |
| Claridad y jerarquía | 8/10 | La propuesta se entiende y el recorrido es limpio. |
| UX y accesibilidad de base | 8/10 | Scroll nativo, foco visible, semántica y reduced motion están bien planteados. |
| Dirección visual | 7/10 | Tiene buen gusto, pero varios códigos —gran titular, mono, acento ácido, grid editorial— son frecuentes en portfolios actuales. |
| Personalidad | 4.5/10 | El retrato ayuda, pero la voz y las interacciones aún podrían pertenecer a muchos diseñadores. |
| Especificidad del posicionamiento | 5/10 | “Calm inside complex products” es elegante, aunque no aclara rápidamente qué sistemas diseña Javier ni cómo trabaja con IA. |
| Craft interactivo | 3/10 | GSAP se usa sobre todo para reveals; el hover principal eleva la tarjeta y escala el visual un 1,8 %. |
| Memorabilidad para recruiter | 4.5/10 | Correcto al verlo; difícil de describir con una frase propia después. |
| Preparación para casos reales | 6/10 | La plantilla narrativa es válida, pero el modelo de datos y los visuales todavía son demasiado rígidos para capturas, prototipos, vídeo y demos. |

## Hallazgos críticos

### 1. El rol visible debe revisarse antes de cualquier publicación

El hero afirma actualmente `Currently Lead Product Designer at Gaming Innovation Group`, mientras Javier se define como Senior Product Designer que ha sido lead brevemente. Esta discrepancia es más urgente que cualquier efecto visual. Hasta verificar el estado exacto, la formulación segura es:

> Senior Product Designer with recent lead experience.

La experiencia de lead es un multiplicador de seniority, no la identidad completa ni necesariamente el cargo actual.

### 2. El headline actual expresa una filosofía, no un posicionamiento completo

`I design the calm inside complex products` merece conservarse, pero como manifiesto o línea secundaria. En solitario no explica rule engines, CMS, plataformas operativas, experiencia player-facing ni la capacidad de convertir diseños en prototipos funcionales con IA y código.

La oportunidad diferencial está en la intersección de tres capacidades:

- sistemas y operaciones complejas;
- detalle de interacción y claridad visual;
- prototipado rápido con IA y código.

### 3. La IA está mencionada, pero no demostrada

`AI-assisted workflows` puede significar que Javier diseña productos con IA, que usa IA en su proceso o ambas cosas. El portfolio debe distinguirlo. La propuesta principal es mostrar una práctica de `AI-augmented product design`: usar IA para explorar, sintetizar y construir prototipos funcionales, manteniendo el juicio de producto y la responsabilidad en manos humanas.

No conviene adoptar `AI designer` como etiqueta vacía. Cada claim sobre IA debe llevar a una prueba: prototipo, demo, experimento, comparación de iteraciones o explicación concreta del método.

### 4. El motion actual es de presentación, no de conversación

La implementación ya incluye GSAP y ScrollTrigger. Se emplean para:

- entrada escalonada del hero;
- reveal del retrato mediante `clip-path`;
- reveals al entrar en viewport;
- progreso de la trayectoria profesional;
- pulso al cambiar de tema.

Los hovers existentes son correctos, pero convencionales: subrayados, desplazamiento de flechas, elevación de botones y tarjetas, y un pequeño zoom del visual. El sitio se mueve cuando aparece, pero apenas responde cuando el visitante decide explorar.

### 5. Dos secciones consumen mucho espacio sin aportar suficiente diferenciación

`Throughline` y `How I work` son claras, pero sus mensajes —progresión profesional y Frame/Shape/Ship— resultan previsibles. La trayectoria se puede condensar y llevar a About. El método debería demostrar cómo Javier piensa mediante un artefacto o interacción, no solo tres frases.

## Investigación: qué conviene aprender y qué no copiar

### Portfolios de producto y recruiters

- La [guía de una recruiter de Figma](https://www.figma.com/blog/product-design-portfolio-tips-from-a-figma-recruiter/) recuerda que managers y recruiters revisan en minutos o segundos: la home debe dejar el trabajo a un clic, rotular rol y medio con claridad y contar una historia selectiva en vez de documentar cada fase de UX.
- El [UX Portfolio Playbook 2026](https://blog.uxfol.io/ux-portfolio-playbook/), basado en respuestas de 74 recruiters y líderes, recomienda tres a cinco casos, profundidad sobre volumen, iteraciones con razones y trade-offs, impacto tangible y navegación por anclas en casos largos.
- [Simon Pan](https://simonpan.com/) es la referencia para legibilidad ejecutiva: cada proyecto abre con ownership e impacto medible. Se debe tomar su claridad, no su estética.
- [Dan Machado](https://www.danmachado.com/) combina una estructura de tres casos muy directa con una voz personal visible desde el hero. Demuestra que art direction y escaneabilidad no son opuestas.

### Interacción y personalidad

- [Rauno Freiberg](https://raunofreiberg.com/) convierte una filosofía personal breve en marca y trata el detalle interactivo como parte del argumento profesional.
- [Emil Kowalski](https://emilkowal.ski/) muestra una práctica donde producto, código y reflexión sobre motion forman una sola identidad; es una referencia para demostrar craft mediante pequeños comportamientos útiles.
- [Bruno Simon](https://bruno-simon.com/) demuestra el techo de memorabilidad de una experiencia 3D coherente. La lección no es hacer un juego: el 3D funciona allí porque es el portfolio completo y la prueba directa de su especialidad.
- [Awwwards Portfolio](https://www.awwwards.com/websites/portfolio/) sirve para estudiar transiciones, WebGL, microinteracciones, vídeo y art direction. No debe usarse como validación de UX de recruiting: premia una dimensión distinta del producto.

### Componentes y tecnología

- [21st.dev](https://21st.dev/) es un registro comunitario con heroes animados, shaders, efectos liquid/metal, galerías y 3D. Entrega código fuente dentro del proyecto; no es una única librería ni una dirección artística. Lo útil es estudiar patrones y adaptar uno o dos, nunca ensamblar un collage de autores.
- [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) permite reveals por línea o palabra, re-splitting responsive y soporte ARIA. Debe reservarse para titulares clave y dividir solo lo necesario.
- [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) encaja con transiciones de elemento compartido entre cover y caso, y con cambios de layout que mantengan continuidad espacial.
- [Three.js](https://threejs.org/docs/pages/WebGLRenderer.html) expone controles de resolución, preferencia de GPU, precompilación e información de render. Si se usa 3D, estas decisiones deben formar parte del diseño, no llegar al final como optimización.
- [Blender glTF 2.0](https://docs.blender.org/manual/es/4.2/addons/import_export/scene_gltf2.html) permite exportar mallas, materiales y animación a un formato pensado para web. Un GLB optimizado es la ruta correcta para un único objeto hero propio.
- Figma permite [embeds interactivos de archivos y prototipos](https://help.figma.com/hc/en-us/articles/360051741274-Interact-with-embeds), pero puede pedir cookies o autenticación. Por eso el embed debe ser una mejora voluntaria con poster y enlace externo, no el único modo de entender el trabajo.
- `prefers-reduced-motion` está ampliamente disponible y debe sustituir o retirar el movimiento no esencial, tal como documenta [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

## Nueva dirección recomendada

### Idea central: `The system behind the screen`

La dirección recomendada no es “portfolio con 3D”. Es un portfolio sobre hacer visibles y manipulables los sistemas que normalmente quedan detrás de una interfaz.

Headline recomendado:

> I design the systems behind the screen.

Supporting copy:

> Senior Product Designer turning rule engines, CMSs and multi-product platforms into clear experiences — then using AI and code to prototype what comes next.

`I design the calm inside complex products` pasa a ser una frase de manifiesto más abajo, donde gana significado después de haber explicado el terreno profesional.

Pruebas rápidas junto al hero:

- Complex B2B and operational products
- AI-assisted prototyping and vibe coding
- Design systems and recent lead experience

Estas frases son provisionales y deben verificarse contra los casos reales antes del lanzamiento.

### Interacción emblemática: `Complexity Engine`

El hero se convierte en un sistema vivo, no en un adorno abstracto:

1. Una red tridimensional de reglas, contenido, estados y dependencias aparece alrededor del retrato de fondo negro.
2. Al mover el puntero o enfocar controles, las conexiones desordenadas se alinean en un flujo legible. La metáfora convierte “complexity → clarity” en algo que el usuario puede provocar.
3. Cuatro nodos rotulados —Rules, Content, Operations, AI prototypes— remapean la red y cambian una pequeña pieza de copy.
4. El selector `System / Human` transforma también la representación: System muestra estructura y dependencias; Human muestra decisiones, colaboración y el retrato alternativo. Ya no será solo un cambio cosmético.
5. Sin WebGL, con touch o con reduced motion, se sirve una composición estática o un clip breve que conserva exactamente el mensaje.

La escena puede construirse con React Three Fiber/Three.js y, si el resultado lo justifica, un objeto propio modelado en Blender. Debe ser una sola escena deliberada. No se recomiendan blobs cromados, esferas líquidas o partículas genéricas: impresionan cinco segundos y no dicen nada sobre Javier.

## Sistema de interacción propuesto

### Hero

- Profundidad y parallax muy contenido según puntero.
- Labels del sistema con respuesta a hover, focus y teclado.
- Transición de tema mediante un barrido/morph de capas, manteniendo la continuidad del retrato.
- Reveal tipográfico por líneas, una sola vez, con SplitText y fallback semántico.

### Project cards

- El cursor revela `View case` y la categoría concreta, pero el enlace sigue siendo un enlace normal.
- Las capturas se presentan como una pila de superficies de producto, sin mockups de portátil o teléfono.
- Al hover/focus, una captura secundaria, una anotación y un estado before/after entran en escena; no solo se escala el contenedor.
- Si existe vídeo, reproduce un loop corto en hover/focus y vuelve al poster al salir.
- La cover viaja al hero del caso con una transición compartida usando GSAP Flip.

### Case studies

- Capturas sticky con zoom y anotaciones sincronizadas al texto.
- Before/after con control accesible y labels explícitos.
- Hotspots para explicar decisiones complejas sin llenar la pantalla de texto.
- Prototipo Figma bajo una acción `Try the prototype`, cargado de forma diferida, con poster, descripción y enlace para abrir en Figma.
- Demos de vibe coding con vídeo determinista primero y `Open live demo` después; nunca un iframe pesado en la carga inicial.
- Navegación sticky por `Overview / System / Decisions / Prototype / Impact / Reflection`.

### Microinteracciones globales

- Estados magnéticos muy leves en CTAs principales para dispositivos con puntero fino.
- Subrayados y labels que comuniquen destino, no solo movimiento.
- Respuesta táctil equivalente; ninguna función dependerá del hover.
- Contadores solo cuando representen datos reales.
- Sin scroll-jacking, carruseles automáticos ni cursor custom que oculte el cursor nativo.

## Nueva arquitectura de la home

1. **Hero / Positioning** — tesis clara, retrato, prueba rápida e interacción Complexity Engine.
2. **Selected systems** — tres casos, cada uno rotulado por producto, rol, superficie y resultado.
3. **What I do unusually well** — complejidad operativa, craft interactivo y prototipado con IA/código; sustituye el Frame/Shape/Ship genérico.
4. **AI in the practice** — una demostración breve de idea → exploración → prototipo funcional. No una nube de logos de herramientas.
5. **Experiments / Built prototypes** — playground orientado a pruebas reales y demos de vibe coding.
6. **About / recent lead experience** — retrato, criterio de liderazgo y enlace a la historia completa.
7. **Contact** — CTA simple y directo.

La trayectoria Junior → Lead se traslada a About o se comprime en una línea. Así la home dedica su espacio principal a evidencia presente, no a cronología.

## Arquitectura de futuros case studies

### Apertura de 15 segundos

Cada caso debe responder sin scroll profundo:

- qué producto es y para quién;
- qué problema o decisión era difícil;
- cuál fue el rol personal de Javier;
- equipo, alcance, tiempo y restricciones;
- resultado o señal de impacto;
- qué parte se puede mostrar y qué está redactado por NDA.

### Narrativa recomendada

1. **The system I inherited** — captura, mapa o flujo del estado original.
2. **The hard decisions** — tres a cinco decisiones, cada una con contexto, alternativas, trade-off y evidencia.
3. **How it behaves** — prototipo o clip justo donde demuestra la decisión.
4. **What changed** — resultado de producto, señal cualitativa o mejora operativa.
5. **What I learned** — límites y qué haría diferente.

No se narrarán ceremonias UX por obligación. Las iteraciones se mostrarán cuando expliquen una decisión.

### Bloques de media necesarios

El futuro modelo de contenido debe aceptar una unión de bloques, no una plantilla fija de tres decisiones:

- image y annotatedImage;
- gallery;
- beforeAfter;
- video o prototypeClip;
- figmaPrototype;
- liveDemo;
- flow o systemMap;
- decision, evidence y constraint;
- metric, quote y reflection;
- ndaNotice o redactedArtifact.

Para backoffice, las capturas se mostrarán grandes y nítidas, con zoom editorial y anotaciones. No se reducirán dentro de mockups decorativos que vuelvan ilegible la densidad real del producto.

## Propuesta técnica

### Mantener

- Next.js/React y la arquitectura server-first existente.
- CSS nativo y tokens del sistema actual.
- GSAP y ScrollTrigger para coreografías macro.
- Scroll nativo, foco visible, semántica y fallback sin JavaScript.

### Ampliar con intención

- GSAP SplitText para uno o dos titulares.
- GSAP Flip para cover → case y cambios de layout.
- React Three Fiber + Three.js + helpers mínimos para la única escena `Complexity Engine`.
- Blender → GLB si se produce un objeto o animación propia.
- Vídeo nativo en WebM/MP4 con poster, `muted`, `playsInline`, carga diferida y control de reproducción.
- Carga dinámica de la escena 3D después de que hero, copy y CTA estén disponibles.

### No añadir por defecto

- Lenis o ScrollSmoother: el problema actual no es el scroll y el scroll nativo forma parte de la buena UX.
- Una segunda librería general de motion si GSAP y CSS resuelven el sistema.
- Paquetes enteros por adoptar un componente de 21st.dev: se evaluará y adaptará su fuente al sistema local.
- WebGL global, varios canvases, postprocesado intenso o vídeo en cada sección.

## Guardrails de calidad

- La información clave y los CTAs deben existir antes de que cargue 3D o vídeo.
- Cada interacción tendrá hover, focus, touch y reduced-motion definidos.
- La escena se pausará fuera de viewport y cuando la pestaña no esté visible.
- Se limitarán pixel ratio, luces, materiales, draw calls y postprocesado; la calidad percibida no depende de renderizar a resolución máxima.
- Los vídeos llevarán poster y no reproducirán sonido automáticamente.
- Los embeds e iframes se crearán solo tras intención del usuario o cuando estén cerca del viewport. [MDN documenta lazy loading nativo](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading).
- La interacción emblemática tendrá una variante estática visualmente terminada; el fallback no será una pantalla vacía.

## Plan de ejecución recomendado

### Fase A — corrección y posicionamiento

- Confirmar cargo actual, formulación de la experiencia de lead y claims de IA.
- Cerrar headline, supporting copy y tres señales de prueba.
- Decidir qué contenido de Throughline y How I work se mueve o elimina.

### Fase B — dirección creativa en prototipos

- Producir tres keyframes del hero: System, Human y estado interactuado.
- Construir una prueba técnica aislada del Complexity Engine.
- Probar una project card con capturas ficticias de backoffice y vídeo placeholder.
- Evaluar memorabilidad, legibilidad y rendimiento antes de rehacer toda la web.

### Fase C — vertical slice

- Implementar hero, una card y la apertura de un case study con el nuevo lenguaje.
- Añadir transición compartida, focus/touch y reduced motion.
- Hacer QA real en desktop y móvil. Solo después extender el sistema.

### Fase D — arquitectura de contenido y casos

- Sustituir `Project` por un modelo de bloques flexible.
- Crear renderers para capturas, anotaciones, vídeo, Figma y demos.
- Añadir navegación por anclas y estados NDA.

### Fase E — sistema completo de interacción

- Extender microinteracciones a navegación, cards, temas, About y contacto.
- Convertir el playground en evidencia de AI/vibe coding.
- Ajustar ritmos, easings y continuidad entre páginas.

### Fase F — producción multimedia

- Generar clips únicamente después de cerrar storyboard y función de cada pieza.
- Usar Seedance u otra herramienta generativa para material dirigido, no fondos genéricos.
- Usar Blender cuando un asset propio ayude a contar el sistema o demuestre craft 3D.
- Exportar posters, formatos alternativos y fallbacks en el mismo proceso.

### Fase G — validación y release privado

- Auditoría visual con sesión autorizada.
- Teclado, lector de pantalla, reduced motion, touch y navegadores.
- Rendimiento de carga y GPU en hardware medio, no solo en el Mac de desarrollo.
- Tests, lint, revisión de claims y despliegue privado en el proyecto Sites existente.

## Criterio de aceptación de la siguiente versión

Una iteración no se considerará lograda solo porque incluya Three.js o más movimiento. Debe pasar cinco pruebas:

1. Un recruiter entiende especialidad, seniority y uso de IA en menos de 15 segundos.
2. Puede abrir un caso real con un clic y orientarse dentro de él.
3. Hay al menos una interacción que solo tiene sentido para el posicionamiento de Javier.
4. El sitio sigue siendo excelente con touch, teclado, reduced motion o sin WebGL.
5. Al cerrar la pestaña, la idea recordable es “diseña los sistemas detrás de la pantalla y los hace tangibles con IA y código”, no “tenía un efecto 3D”.

## Decisión recomendada

Adoptar `The system behind the screen` + `Complexity Engine` como dirección de trabajo y comenzar por la Fase A. Las alternativas puramente cinematográficas o basadas en un blob 3D pueden ser visualmente más ruidosas, pero diferencian menos y explican peor el tipo de productos que Javier diseña.

## Addendum — auditoría visual del preview autenticado

Fecha: 24 de julio de 2026  
Viewports comprobados: desktop intermedio, `1440 × 900` y móvil `390 × 844`.  
Rutas comprobadas: home y `/work/atlas`, temas System y Human, navegación móvil, anchor a Work y comportamiento de scroll/reveals.

Esta segunda pasada confirma el diagnóstico estratégico anterior y añade defectos concretos que deben entrar en el backlog de la siguiente versión.

### Lo que funciona en pantalla

- El hero en System es la pieza visual más fuerte de Preview 1. La fotografía de fondo oscuro, la escala tipográfica y el cruce controlado entre texto y retrato producen una primera impresión editorial sólida.
- La composición aguanta correctamente entre un desktop intermedio y `1440px`.
- La recomposición móvil es deliberada y legible. No intenta conservar el solape de desktop y mantiene CTAs con buen tamaño.
- Las tarjetas de proyecto se escanean bien y las tres art directions son coherentes dentro del sistema.
- La navegación semántica, el menú móvil, el skip link, los anchors y el selector de tema funcionan.
- La estructura de decisiones del caso permite leer título, rationale y detalle a dos velocidades.

### P0 — corregir antes de cualquier publicación

1. **Cargo actual incorrecto o no confirmado.** El hero y la trayectoria muestran a Javier como Lead Product Designer actual. Debe alinearse con la formulación aprobada de Senior Product Designer con experiencia breve de lead.

### P1 — defectos de experiencia y motion

1. **El status del hero pierde legibilidad y se sale parcialmente del retrato.** En `1440px`, el retrato termina en `y=844` y el bloque de status ocupa aproximadamente `y=832–868`. Cruza el borde inferior de la imagen y en Human parte del texto queda sobre fondos variables. `Currently` llega a desaparecer visualmente sobre el portátil.

2. **El reveal de GSAP y el hover de las cards compiten por `transform`.** Al terminar el reveal, GSAP deja en cada `.project-card.js-reveal` un estilo inline equivalente a `transform: translate(0px, 0px)`. Ese inline tiene prioridad sobre `.project-card:hover { transform: translateY(...) }`, por lo que la elevación declarada en CSS no puede ejecutarse. El borde, shadow y zoom del visual sí pueden cambiar, haciendo que el hover se sienta todavía más sutil de lo previsto.

3. **`MotionController` se ejecuta globalmente con targets exclusivos de home.** En `/work/atlas` se registraron avisos de GSAP por `.hero-portrait` y otros targets inexistentes. El controlador debe comprobar targets o separar timelines por ruta/componente. Además de limpiar consola, esto evita trabajo y acoplamiento innecesarios.

4. **El artefacto Atlas está sobredimensionado respecto a su contenido.** En desktop el visual del caso mide aproximadamente `1348 × 928px`, pero la interfaz ficticia solo ocupa su franja superior; más de la mitad de la pantalla es un fondo negro vacío. En móvil el stage mide `532px` y repite el mismo problema. Esto hace que el caso se perciba como layout incompleto, no como una decisión de art direction.

5. **El case study dedica el primer viewport entero a título y metadata.** En `1440 × 900`, el hero del caso mide `864px` y el primer artefacto comienza después. Para un recruiter no hay prueba visual del trabajo above the fold. La siguiente plantilla debe permitir que cover, before/after o captura principal compartan ese primer viewport.

### P2 — mejoras de dirección y ritmo

1. **System funciona sensiblemente mejor que Human.** El retrato oscuro se siente más propio y editorial. El retrato claro, con oficina desenfocada y portátil, aproxima el hero a una fotografía corporativa intercambiable. Human necesita una dirección igualmente intencional; cambiar foto y tokens no basta.

2. **El selector de tema todavía es una idea incompleta.** El cambio es fluido, pero solo transforma paleta, retrato y caption. No cambia la lectura del producto ni ofrece una interacción que exprese Human/System.

3. **La home móvil es excesivamente larga para la cantidad de evidencia disponible.** A `390px` el documento ronda `9.927px` de altura. La suma de hero, tres cards, trayectoria, método, playground y About diluye el trabajo. Reducir Throughline y reemplazar Frame/Shape/Ship liberará atención para proyectos, prototipos e IA.

4. **El método usa mucho espacio vacío para tres mensajes genéricos.** En desktop las tres columnas tienen gran altura y el contenido se alinea al fondo. El gesto editorial es limpio, pero no aporta interacción, evidencia ni suficiente personalidad para justificar el coste de scroll.

5. **La variante móvil elimina parte de la historia del visual.** Atlas oculta `Impact preview`, que es precisamente el elemento que comunica consecuencia y riesgo. Los casos reales necesitarán una recomposición equivalente, no simplemente esconder el panel secundario.

6. **Las decisiones del caso no están conectadas a artefactos.** Los textos son claros, pero aparecen como filas estáticas. Capturas anotadas, estados comparados o pequeños prototipos junto a cada decisión demostrarán el razonamiento en lugar de pedir que el recruiter lo imagine.

### Scorecard ajustado tras la inspección visual

| Dimensión | Preview 1 | Objetivo Preview 2 |
| --- | ---: | ---: |
| Claridad del hero | 8/10 | 9/10 |
| Dirección visual System | 8/10 | 9/10 |
| Dirección visual Human | 6/10 | 8.5/10 |
| Personalidad | 4.5/10 | 8.5/10 |
| Interacción tras la entrada | 3/10 | 8/10 |
| Legibilidad de casos | 7/10 | 9/10 |
| Evidencia visual en casos | 3.5/10 | 9/10 |
| Eficiencia de scroll | 5/10 | 8/10 |
| Robustez del sistema de motion | 6/10 | 9/10 |

### Consecuencia para la siguiente fase

La siguiente iteración no debe conservar la home actual y añadir un canvas encima. Primero debe corregir la jerarquía y el ritmo:

1. cerrar cargo y posicionamiento;
2. rediseñar el primer viewport y el comportamiento Human/System;
3. probar el nuevo hero junto a una card y un case hero con captura visible;
4. corregir el ownership de transforms y aislar las timelines de GSAP;
5. validar ese vertical slice en `1440px`, desktop intermedio y `390px` antes de extender el sistema.
