# Auditoría 04 — replanteamiento completo del hero

> Documento histórico. `Living Fold` fue sustituido por `Live File` tras la aprobación del plan posterior. Consulta `AUDIT-05-LIVE-FILE.md` y `IMPLEMENTATION-05-LIVE-FILE.md` antes de tomar decisiones actuales.

Fecha: 24 de julio de 2026  
Estado: dirección aprobada e implementada el 24 de julio de 2026.

## Corrección de criterio

El hero no tiene que explicar la biografía de Javier ni convertir cada efecto en una metáfora de su forma de trabajar. Su primera función puede ser más directa:

> detener la mirada, demostrar una dirección digital excepcional y dejar claro que no es un portfolio promedio.

La identidad, la trayectoria, los dominios de producto y la fotografía pueden empezar en la segunda sección. En el hero basta con una identificación mínima y una pieza visual memorable.

## Decisión sobre Preview 3

El hero actual queda rechazado. No se debe iterar sobre `Complexity Engine`.

Se retiran en el próximo rediseño:

- la red de puntos y partículas;
- el selector `Rules / CMS / Design systems / AI + code`;
- los datos y controles encima de la fotografía;
- los dos párrafos explicativos;
- las cuatro tarjetas de prueba;
- el headline sobredimensionado;
- la obligación de usar el retrato en el primer viewport.

El problema no era que la red no contara la historia correcta. Era que se sentía como una demo 3D genérica colocada sobre demasiada información.

## Qué enseña Stripe

### Homepage 2020

La antigua home de Stripe combinaba varios recursos, no un único truco:

- gradiente WebGL animado como firma visual;
- recortes diagonales y profundidad entre planos;
- interfaces de producto compuestas como objetos gráficos;
- dropdowns y microinteracciones con continuidad;
- un globo 3D que respondía al scroll.

Stripe publicó el proceso técnico de su [globo interactivo](https://stripe.com/blog/globe), incluyendo Three.js, rotación ligada al scroll, límites de render y decisiones de rendimiento. El famoso gradiente fue lo bastante reconocible para generar múltiples análisis y recreaciones, como [What a mesh](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/).

Lo importante no es copiar el gradiente. Es que el hero, el sistema de layouts y las microinteracciones compartían la misma dirección. Se notaba una planificación global.

### Homepage 2026

La home actual vuelve a usar un único gesto dominante: una gran onda o cinta de color que entra desde el borde, con el resto del encuadre muy limpio. En la revisión pública del rediseño, Katie Dill describe la web como un manifiesto de la calidad de la compañía, con más de un año de exploración, prototipos y ajuste de animaciones. El resumen de [la conversación de Y Combinator](https://1minutesignal.com/signal/stripes-homepage-redesign-design-process) recoge esa combinación de historia visual, detalle y funcionalidad.

La lección aplicable es:

> un objeto visual fuerte + una coreografía coherente + muy poco ruido alrededor.

## Referencias de producto y 3D

- [Raycast](https://www.raycast.com/) usa pliegues abstractos rojos y negros detrás de un mensaje simple. El objeto no explica literalmente el producto; establece nivel de craft y personalidad.
- [Lusion](https://lusion.co/) contiene una escena 3D compleja dentro de una ventana limpia y deja respirar el resto de la página. Marca un límite superior útil: impacto alto sin convertir toda la navegación en un experimento.
- [Bruno Simon](https://bruno-simon.com/) y [Maël Ruffini](https://www.maelruffini.com/) son deliberadamente más inmersivos. Sirven como referencia técnica, no como modelo de UX para este portfolio.
- [Mark Lamb](https://marklamb.com/) demuestra que el contenido personal y el reel pueden funcionar con extrema contención, pero su hero tiene menos impacto inmediato que la ambición fijada aquí.

La fotografía de Javier sigue siendo un activo fuerte, pero ya no condiciona el hero. Puede abrir la segunda sección y beneficiarse de más espacio y menos competencia.

## Auditoría específica de 21st.dev

Se revisaron heroes, shaders, vídeo, imágenes reactivas, Three.js y coreografías de scroll.

| Componente | Qué aporta | Problema si se usa tal cual | Veredicto |
| --- | --- | --- | --- |
| [Liquid Metal Hero](https://21st.dev/community/components/chow-stack/liquid-metal-hero) | shader vistoso y presencia inmediata | orb genérico, estética muy reconocible de template, exceso de copy en la demo | no usar tal cual |
| [Futuristic Hero](https://21st.dev/@larsen66/components/hero-futuristic) | profundidad, scan y respuesta 3D | blob tecnológico intercambiable por cualquier SaaS | no usar tal cual |
| [Animated Shader Hero](https://21st.dev/@ravikatiyar162/components/animated-shader-hero) | fondo vivo y color | el fondo no basta para crear una composición propia | recurso secundario |
| [Glass Refraction Hero](https://21st.dev/@dhileepkumargm/components/glass-refraction-hero) | refracción y movimiento continuo | headline enorme y apariencia de landing genérica | descartar como dirección |
| [PrismaHero](https://21st.dev/@rahil1202/components/prisma-hero) | vídeo full-screen, entrada cinemática y nav mínima | la calidad depende por completo de producir un vídeo excelente | candidato de vídeo |
| [Hero Scrub](https://21st.dev/@jean.duthil13/components/hero-scrub) | secuencia de frames y montaje preciso | exige scroll y muchos assets antes de mostrar toda la idea | candidato, no primera opción |
| [Scroll Choreography](https://21st.dev/@componentry/components/scroll-choreography) | cuatro piezas visuales coreografiadas; una se expande | con stock parece una demo, con material propio puede ser muy potente | mejor fallback de librería |
| [Reveal Wave Image](https://21st.dev/@hinedy/components/reveal-wave-image) | dither, distorsión y reveal por puntero | vuelve a depender de una imagen protagonista | reservar para fotografía/sección 2 |

La biblioteca es útil como banco de mecanismos. Ninguna demo auditada alcanza por sí sola la mezcla de originalidad y control que buscamos. Si se decide usar una directamente, la mejor base es `Scroll Choreography`, sustituyendo por completo su arte, proporciones y comportamiento de salida.

## Tecnologías comparadas

| Vía | Impacto inicial | Interacción | Dependencia de assets | Riesgo de parecer template |
| --- | ---: | ---: | ---: | ---: |
| Shader/objeto WebGL custom | Muy alto | Muy alta | Baja | Bajo si la forma es propia |
| Vídeo full-screen producido a medida | Muy alto | Baja | Muy alta | Medio |
| Modelo 3D de Blender/Spline | Alto | Alta | Media | Alto si es un objeto genérico |
| Coreografía de paneles multimedia | Alto | Media | Alta | Bajo con material propio |
| Componente 21st sin redirección artística | Medio/alto | Variable | Baja | Muy alto |

## Tres direcciones viables

### A. Living Fold — recomendada

Un objeto continuo, entre cinta, lámina y tejido digital, ocupa entre el 70 % y el 85 % del viewport. No es una esfera, una red ni una colección de paneles. Tiene pliegues precisos, profundidad y un material propio.

En `System`, se comporta como cromo oscuro con interferencias eléctricas y zonas casi negras. En `Human`, cambia a una membrana clara, translúcida y perlada. El cambio de tema modifica material, luz y fondo, no solo colores CSS.

El puntero ejerce una tensión local muy sutil: cambia el pliegue y la reflexión cercana sin convertir el cursor en un juguete. Al comenzar el scroll, la pieza se estira y se convierte en una franja o máscara que entrega la segunda sección. No se bloquea el scroll.

Ventajas:

- wow visible desde el primer segundo;
- no necesita foto ni proyectos reales;
- se puede dirigir con la precisión de Stripe o Raycast sin copiarlos;
- produce un fotograma estático fuerte, no depende solo de estar en movimiento;
- el tema `Human / System` gana una transformación de alto nivel.

### B. Cinematic Grid

Cuatro ventanas de vídeo o motion entran desde distintas zonas del viewport, se alinean durante unos segundos y una se expande hasta ocupar la pantalla. Es una reinterpretación propia de `Scroll Choreography`.

El material puede ser abstracto en esta fase: macro 3D, tipografía, scans, gradientes, UI sintética y texturas. Más adelante se reemplaza por fragmentos de casos reales sin cambiar la coreografía.

Ventajas:

- movimiento muy evidente;
- permite usar Seedance, Blender, After Effects o Jitter;
- puede comenzar ya con placeholders.

Riesgo: si los cuatro clips no comparten dirección, se percibe como showreel genérico.

### C. Cinematic Monolith

Una única película full-screen —base `PrismaHero`, pero totalmente rediseñada— presenta una pieza 3D o audiovisual creada a medida. El texto se limita a identificación y rol.

Ventajas:

- máximo control artístico y visual;
- producción independiente del runtime web;
- fácil de reemplazar o reeditar.

Riesgo: menor interactividad. El vídeo debe ser excepcional para no parecer simplemente un fondo.

## Dirección recomendada — Living Fold

### Composición

- hero de `100svh`;
- nombre y rol como una sola unidad breve;
- visual dominante sin fotografía;
- navegación mínima;
- un único cue `Selected work ↓` o equivalente;
- ningún párrafo, tarjeta, badge, métrica o selector dentro del hero.

Copy de trabajo:

> Javier Ortiz — Senior Product Designer

No hace falta un headline adicional en la primera prueba. Si el encuadre pide una segunda línea, debe ser breve y de tamaño medio, nunca competir con la pieza.

### Storyboard de entrada

1. `0.0–0.4 s` — fondo y navegación; el objeto aparece como un corte muy fino.
2. `0.4–1.4 s` — la lámina se despliega con dos o tres pliegues claros, no con ruido procedural aleatorio.
3. `1.4–2.2 s` — una onda de material/luz recorre la superficie y revela toda la paleta.
4. `2.2 s en adelante` — movimiento ambiental muy lento y respuesta localizada al puntero.
5. `primer scroll` — la forma se estira hacia la retícula de la segunda sección y deja entrar el contenido real.

El wow ocurre antes de que el visitante tenga que interactuar.

### Implementación candidata

- Three.js + React Three Fiber para geometría y material custom;
- vertex/fragment shader propio para pliegues, interferencia y transición de materiales;
- GSAP/ScrollTrigger solo para la entrada y la entrega a la segunda sección;
- postproducción muy contenida: bloom leve, grano y antialiasing; nada de partículas;
- poster o vídeo corto prerenderizado como fallback;
- render estático para `prefers-reduced-motion`;
- calidad específica para móvil, con menos subdivisiones y una cámara propia.

Blender puede usarse para explorar siluetas y materiales, pero la versión final solo debe ser vídeo si el render en tiempo real no alcanza la calidad esperada. Spline sirve para prototipar, no debería fijar el aspecto final.

## Segunda sección

La segunda sección absorbe lo retirado del hero:

- retrato de Javier;
- seniority y experiencia reciente de lead;
- más de cinco años en GiG y progresión;
- rule engine, CMS, backoffice y frontend;
- IA y prototipado con código.

Puede entrar mediante la franja creada por el objeto del hero, de modo que la espectacularidad y la claridad formen una secuencia, no dos páginas distintas.

## Criterios de aceptación

- Hay una reacción de `wow` plausible en menos de dos segundos.
- El visual sigue siendo fuerte en una captura estática.
- El hero contiene como máximo nombre, rol y un cue de navegación.
- No usa fotografía por obligación.
- No aparecen partículas, diagramas, selectores de dominios ni tarjetas.
- La forma, el material y la coreografía no coinciden con la demo de una librería.
- El pointer añade profundidad, pero no es necesario para entender ni navegar.
- El scroll sigue siendo nativo y la transición no secuestra la página.
- Reduced motion y dispositivos modestos reciben una composición acabada, no un hero vacío.
- La segunda sección explica quién es Javier sin repetir el hero.

## Resolución posterior

Después de esta investigación, Javier pidió implementar directamente la solución que más convencía. Por tanto, los tres motion boards dejaron de ser un paso bloqueante y se ejecutó `Living Fold`.

- El antiguo `Complexity Engine` fue retirado por completo.
- El hero contiene solo nombre, rol y `Explore`.
- La fotografía, la síntesis profesional y los hechos escaneables pasaron a la segunda sección.
- La escena usa una lámina y shaders propios, con fallback CSS y reduced motion estático.
- `Cinematic Grid` y `Cinematic Monolith` quedan como alternativas históricas, no como trabajo pendiente.

La implementación y sus contratos técnicos están en `IMPLEMENTATION-04-LIVING-FOLD-HERO.md`.
