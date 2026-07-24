# Auditoría 03 — copy, posicionamiento y efecto wow con función

Fecha: 24 de julio de 2026  
Estado: dirección aprobada por la petición de revisar e implementar la landing.

## Problema observado

La landing de Preview 2 tenía una frase recordable —`I design the systems behind the screen`—, pero pedía al visitante que dedujera el rol, el tipo de producto, la trayectoria y la ventaja profesional de Javier. El resultado era elegante, aunque demasiado implícito para un primer vistazo de recruiting.

La corrección no consiste en renunciar a la personalidad. Consiste en separar dos capas:

1. **señal inmediata:** quién es Javier y en qué terreno aporta valor;
2. **firma memorable:** cómo piensa y qué hace diferente su práctica.

La metáfora `systems behind the screen` se mantiene en la experiencia 3D y en el lenguaje secundario. Ya no soporta por sí sola el posicionamiento.

## Hechos verificados del perfil

La fuente es el PDF exportado del perfil de LinkedIn incluido en `Assets/Profile.pdf`. Se revisaron visualmente sus siete páginas antes de redactar.

- Senior Product Designer con experiencia reciente de Lead.
- Más de cinco años dentro del ecosistema de producto de Gaming Innovation Group.
- Progresión Junior → Product → Senior → Lead.
- Trabajo en un rule engine en tiempo real, un CMS propietario, el design system de backoffice, una plataforma de datos y herramientas internas de conocimiento.
- Experiencia anterior en visual design, e-commerce, videojuegos, Unity, 3D y VFX.
- Uso de IA y vibe coding con herramientas como Figma, Make, Lovable y Cursor; también facilitación y workshops internos.
- Base en Marbella y trabajo en inglés y español.

Los datos de contacto del PDF no se trasladan al sitio durante la fase de preview.

## Investigación de copy y hiring

### Qué buscan quienes contratan

- [Indeed Design — UX Design Portfolio Advice from Hiring Managers](https://indeed.design/article/ux-design-portfolio-advice-from-hiring-managers/) recoge la opinión de seis responsables de UX. Piden historias completas, rol y problema visibles, iteración y evidencia; también buscan identificar la fortaleza diferencial del candidato.
- [Nielsen Norman Group — User Experience Careers](https://media.nngroup.com/media/reports/free/UserExperienceCareers_2nd_Edition.pdf) señala que un portfolio de diseño debe enseñar resultados visuales y artefactos del proceso, y que el propio portfolio debe demostrar organización, UX y capacidad de escritura.
- [UX Collective — Ever wonder how recruiters look at your design portfolio?](https://uxdesign.cc/ever-wonder-how-recruiters-look-at-your-design-portfolio-cc8dd1ecb698) sintetiza más de cien respuestas: recruiters escanean mucho más deprisa que design managers; recomienda un resumen inicial y profundidad posterior. Comunicación, storytelling, craft y product thinking aparecen como señales principales.

### Cómo se escanea una landing

[Nielsen Norman Group — F-Shaped Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) recuerda que el escaneo aparece cuando faltan señales visuales fuertes. Las medidas aplicables a esta home son:

- colocar los puntos decisivos en los primeros párrafos;
- empezar headings con palabras informativas;
- agrupar pequeñas unidades relacionadas;
- eliminar copy redundante;
- usar enlaces cuyo texto explique el destino.

Esto lleva a una home con dos velocidades: cuatro señales compactas para la lectura rápida y contenido narrativo/visual para quien decide seguir.

### Matiz procedente de comunidad

Las conversaciones de profesionales en r/UXDesign cuestionan convertir los “diez segundos” en una ley literal, pero coinciden en que la etiqueta profesional y el terreno de trabajo no deberían requerir interpretación. Por ello no se diseña una home superficial: se hace inequívoca al principio y profunda después.

## Arquitectura del mensaje

### Respuestas que deben aparecer en el primer viewport

| Pregunta | Respuesta |
| --- | --- |
| ¿Quién? | Javier Ortiz, Senior Product Designer con experiencia reciente de Lead. |
| ¿Qué diseña? | Plataformas complejas y backoffice: rules, CMS, sistemas y herramientas operativas. |
| ¿Qué lo demuestra? | Más de cinco años en GiG y una progresión de Junior a Lead. |
| ¿Qué aporta distinto? | Craft visual y de interacción, pensamiento de sistemas y prototipos funcionales con IA y código. |

### Copy principal adoptado

Eyebrow:

> Javier Ortiz · Senior Product Designer · Marbella / Remote

Headline:

> I design complex platforms people can understand.

Supporting copy:

> Over 5+ years at Gaming Innovation Group, I grew from Junior to Lead while designing complex backoffice products—a real-time rules engine, proprietary CMS, design system and internal knowledge tools. Today I work hands-on, using AI and code to turn ambiguity into working product faster.

La frase es deliberadamente llana. La personalidad se recupera mediante composición, interacción y el contraste entre `complex platforms` y `people can understand`.

### Cuatro flashes

1. `Role` — Senior Product Designer / recent Lead experience.
2. `Product terrain` — complex B2B systems / rules, CMS, backoffice.
3. `Track record` — 5+ years at GiG / Junior → Product → Senior → Lead.
4. `Edge` — AI + coded prototypes / from visual design and games.

### Orden de la home

1. Hero con señal explícita, cuatro flashes y Complexity Engine.
2. `How I got here`, una trayectoria interactiva basada en hechos reales.
3. Casos conceptuales claramente rotulados como preview.
4. Capacidades con ejemplos de superficies reales, sin inventar impacto.
5. Práctica de IA demostrada como Frame → Explore → Build.
6. Playground.
7. About y contacto.

La trayectoria real aparece antes que los proyectos ficticios. Así la primera evidencia del portfolio no depende de placeholders.

## Investigación de interacción

### Bibliotecas revisadas

- [21st.dev — cursor components](https://21st.dev/community/components/s/cursor): proximity type, spotlight, magnetic controls, trails y custom cursors.
- [21st.dev — Variable Font Proximity Hero](https://21st.dev/@cnippet.dev/components/m-variable-font-cursor-proximity-1): el peso de cada letra responde a la cercanía del puntero.
- [React Bits](https://www.reactbits.dev/): fondos WebGL, magnet lines, pixel trails, metallic effects y componentes cinéticos.
- [Motion Primitives — Spotlight](https://motion-primitives.com/docs/spotlight): spotlight contenido que sigue al puntero.
- [Magic UI — Animated Beam](https://magicui.design/docs/components/animated-beam): líneas animadas para comunicar conexiones.
- [Aceternity — Card Spotlight](https://ui.aceternity.com/components/card-spotlight) y [Hover Effect](https://ui.aceternity.com/components/card-hover-effect): iluminación local y continuidad entre elementos activos.

### Selección

Se adaptan tres ideas, sin importar una dirección artística ajena:

1. **spotlight local** en la trayectoria real; descubre contenido y posición del puntero, pero nunca altera la legibilidad;
2. **conexión animada** entre etapas de carrera, para convertir el pasado multidisciplinar en una explicación causal;
3. **respuesta por proximidad/hover** en las cuatro etapas y dominios del hero, con equivalente de focus y click.

### Efectos rechazados

- Cursor personalizado global: compite con tareas básicas y no aporta una señal profesional.
- Fondo WebGL global: duplica el Complexity Engine, consume atención y rendimiento.
- Morphing en el headline: degradaría la frase que debe resolver el posicionamiento.
- Marquees de habilidades: convierten evidencia en decoración y dificultan el escaneo.
- Shaders líquidos/metal genérico: alto impacto visual, baja relación con la historia de Javier.
- Blur del resto de contenido al hover: ayuda en galerías, pero penaliza la comparación de los cuatro flashes.

## Criterios de aceptación

- Sin interactuar, el primer viewport responde las cuatro preguntas.
- La landing distingue experiencia real de casos conceptuales.
- IA aparece como una capacidad de trabajo concreta, no como etiqueta.
- La trayectoria cuenta de dónde viene Javier y por qué su craft es multidisciplinar.
- Hover tiene equivalente por focus/click; touch no pierde contenido.
- `prefers-reduced-motion` conserva el mensaje sin animación.
- La nueva capa no introduce scroll-jacking, cursor global ni dependencia visual de WebGL.
