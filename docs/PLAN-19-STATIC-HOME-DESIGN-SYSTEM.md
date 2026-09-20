# Plan 19. Sistema visual estático de la Home

Estado: primera composición light aprobada por Javier para publicación en Sites el 20 de septiembre de 2026; la exploración posterior de retícula se descartó.

## Encargo y criterio

Esta dirección sustituye en la Home la estética Dark y abandona la metáfora de archivo inacabado, la intro Figma, Director, Follow y la memoria narrativa. El contenido y el orden de secciones siguen el Plan 18; los interiores de casos se revisarán después. La imagen de referencia entregada por Javier ilustra la familia visual, no es una maqueta que haya que calcar. Se toma su disciplina de retícula, contraste y campos de imagen; se descartan el raíl numerado permanente, los divisores redundantes y cualquier dato o enlace inventado.

Lectura de diseño: portfolio de un Senior Product Designer hands-on para responsables de contratación y diseño. Lenguaje Swiss / International Style con ritmo editorial contemporáneo y precisión de producto. La primera pantalla debe comunicar quién es Javier, qué aporta y dónde ver su trabajo, sin depender de movimiento. Diales de Taste para esta fase: variación 6/10, motion 1/10 y densidad 3/10.

## Fundamentos vinculantes

| Token | Valor | Contrato |
| --- | --- | --- |
| `--canvas` | `#F7F7F3` | Un único campo claro para la Home. |
| `--surface` | `#FFFFFF` | Diálogos o capas funcionales, nunca cards por defecto. |
| `--surface-raised` | `#EEEFEA` | Hover o apoyo editorial discreto. |
| `--ink` | `#171817` | Titulares, acciones y texto principal. |
| `--muted` | `#555750` | Texto secundario real, no opacidad aplicada al bloque. |
| `--line` | `#D8DAD3` | Solo división de contenido. |
| `--control-border` | `#72766E` | Perímetro funcional perceptible. |
| focus | `#5136B9` | Indicador de teclado, no acento decorativo. |
| inverse focus | `#C8BCFF` | Foco sobre campos oscuros futuros. |

Contraste calculado frente al canvas: ink 16,58:1, muted 6,82:1, control-border 4,31:1 y focus 7,58:1. Los hairlines son separadores, no texto ni único indicador de interacción. No se introduce selector de tema; la nueva identidad de la Home es light por decisión explícita de Javier. Las rutas secundarias mantienen su estado provisional hasta su propio rediseño.

Tipografía: Instrument Sans Variable autoalojada desde `@fontsource-variable/instrument-sans` bajo SIL OFL 1.1. Tras comparar con Inter Variable en el copy real de Hero, Work y About, se adopta Instrument Sans por su dibujo algo más humano y su mejor continuidad entre titulares y cuerpo, sin introducir una segunda fuente ornamental. Pesos 400/500/600. Hero `clamp(3.9rem, 6.7vw, 6.8rem)` en desktop y `clamp(3.1rem, 11vw, 4.7rem)` en móvil, interlineado cercano a 1. Titular de sección hasta 5.75rem; proyecto hasta 4.5rem; cuerpo de 1 a 1.2rem y medida de 34-65 caracteres según función. El texto nunca se recorta para cuadrar la retícula.

Escala de espacio de trabajo: 4, 8, 12, 16, 24, 32, 48, 64, 96 y 144 px. Márgenes de página `clamp(20px, 4.2vw, 64px)`; contenido máximo 1440 px. Desktop: 12 columnas y 24 px de gutter. Tablet: 6 columnas conceptuales. Móvil: 4 columnas conceptuales con 20 px de margen, pero cada bloque recompone sus spans de forma explícita. La separación entre capítulos tiene un propietario: la sección que comienza. Snapshot es una banda compacta que cierra el Hero, no otro capítulo monumental.

## Gramática de componentes

- **Container / grid:** mismo ancho y margen de página para cabecera, capítulos y cierre. Las variaciones se resuelven con spans, no con márgenes arbitrarios.
- **Tipo:** el titular se alinea a la retícula real. La jerarquía depende de escala y aire, no de una sucesión de labels en mayúsculas.
- **Media plate:** rectángulo sin redondeo, proporción reservada y encuadre por asset. La fotografía de Javier es auténtica. En Work una cubierta tipográfica está rotulada por el contenido contiguo como material provisional, no simula una pantalla o un outcome.
- **Rule:** 1 px y función explícita (separar facts, entradas o preguntas). No cuadrícula ornamental permanente.
- **Action:** altura mínima 44 px, primaria de tinta sobre claro, secundaria quieta y enlace editorial. Semántica de enlace para destinos y botón para el vídeo modal. Foco visible de 2 px.
- **Disclosure:** `details/summary` nativo; toda la pregunta es el target, estado abierto reconocible, respuesta de lectura larga y sin dependencia de animación.
- **Dialog:** modal solo para el atajo de vídeo ya existente, con aviso inequívoco de que todavía no hay archivo reproducible; cierre por botón y clic fuera. La miniatura no finge reproducción.
- **Estados:** la Home queda visible desde SSR. Hover/foco/abierto solo cambian su estado, sin coreografía o transiciones en esta fase. Un enlace no disponible no se dibuja como acción.

## Recetas de Home

| Capítulo | Composición | Trabajo del capítulo |
| --- | --- | --- |
| Hero | Texto dominante a la izquierda y retrato auténtico a la derecha; en móvil retrato panorámico y texto. | Identidad, posicionamiento, resumen y dos acciones. |
| Snapshot | Cuatro hechos sin contadores animados. | Prueba de seniority en una lectura. |
| Selected Work | LogicX dominante con cubierta tipográfica; dos entradas secundarias abiertas, no cards. | Mostrar prioridades sin inventar evidencia. |
| About | Retrato de cuerpo entero y relato breve, alineados al pie. | Persona y trayectoria. |
| Proof from People | Tres citas reales completas con atribución, sin índices decorativos. | Validación de colaboración, aún sin URLs individuales. |
| Lab | Campo gris claro y secuencia tipográfica de pregunta, prototipo, aprendizaje. | Explicar el formato antes de publicar experimentos. |
| How I Work | Lista de cinco disclosures. | Resolver preguntas reales de contratación. |
| Contact | Cierre tipográfico y LinkedIn actual; email/CV pendientes. | Una salida honesta y clara. |

Los casos y métricas ficticios no se incorporan a la Home. No se usan los nombres, traducción ES/EN, CV, email, fotografía arquitectónica ni citas exactas de la imagen generada como afirmaciones de este proyecto.

## Plan de implementación y siguientes cortes

1. **Sistema y Home estática (este corte):** crear tokens acotados a Home, fuente local, CSS de cabecera y pie, componentes de Hero/Work/About/People/Lab/FAQ, retirar el bootstrap y controlador de motion de la Home. Mantener SSR, scroll nativo, anchors y `noindex/nofollow`.
2. **Comprobación visual:** revisar 1440×900 y 390×844 en navegador real; comprobar composición completa, márgenes, legibilidad, modal, FAQ y ausencia de overflow. Corregir defectos de impacto alto en una pasada.
3. **Gates:** lint, build + tests y matriz Playwright. Javier aprobó la publicación en Sites de esta composición; fusionar GitHub `main` sigue siendo una decisión separada.
4. **Próximo sprint, no incluido:** sustituir cubiertas provisionales por evidencia autorizada, revisar interiores de casos, página About y Lab; después definir una única lógica de motion con fallback reduced-motion. No reintroducir Director.

La versión más valiosa de esta dirección será menos repetitiva que la referencia: una sola retícula reconocible, pero capítulos de distinta densidad. El riesgo principal es que la neutralidad tipográfica y las cubiertas provisionales se perciban demasiado genéricas antes de contar con imágenes de producto reales; ese riesgo se revisará con Javier y con material final, no se tapará con efectos.
