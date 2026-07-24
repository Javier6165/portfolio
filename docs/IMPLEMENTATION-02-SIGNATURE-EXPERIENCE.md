# Preview 2 — Signature experience

Este documento registra la implementación aprobada tras `AUDIT-02-POSITIONING-AND-WOW.md`. Su objetivo es que otro Codex o colaborador pueda continuar sin reconstruir el razonamiento desde cero.

## Objetivo

Preview 1 era clara y competente, pero demasiado genérica para un Senior Product Designer que trabaja con rule engines, CMS/backoffice, plataformas y flujos asistidos por IA. Preview 2 debía ganar personalidad y demostración interactiva sin caer en scroll-jacking, espectáculo sin función o UX de agencia creativa.

La respuesta no fue “más animación” en abstracto. Se cambió la jerarquía para que cada efecto pruebe una capacidad: comprender sistemas, visualizar dependencias, prototipar con IA/código y articular decisiones con evidencia.

## Cambios de narrativa

1. `I design the systems behind the screen.` sustituye al headline abstracto anterior.
2. El subtítulo nombra rule engines, CMS, plataformas, player experiences, IA y código.
3. Se eliminó la cronología `Throughline` de la home; la trayectoria pertenece a About.
4. `Frame / Shape / Ship` se sustituyó por tres capacidades específicas: complejidad operacional, craft interactivo e IA + código.
5. La IA tiene una sección demostrable y no una mención lateral.
6. El claim de puesto se corrigió: Senior Product Designer con experiencia reciente como lead; no se afirma que Javier sea actualmente Lead.

## Cambios de experiencia

### Complexity Engine

El retrato del hero se combina con una red 3D que cambia entre reglas, contenido, operaciones e IA. Los botones alteran una topología real de catorce nodos; no son tabs decorativas.

La escena usa geometría y materiales básicos, no luces ni postprocesado. Se limita el DPR y se carga solo en cliente. Con reduced motion se renderiza bajo demanda. Si JavaScript/WebGL falla, el retrato, headline y controles textuales siguen presentes.

### Tarjetas de trabajo

Cada tarjeta incluye:

- superficie de producto;
- resumen y tags;
- formato de evidencia previsto;
- artefacto visual en capas;
- profundidad y cursor contextual en dispositivos con hover.

El wrapper exterior lleva `.js-reveal`; la tarjeta interior conserva su propio transform. Esta separación corrige el conflicto de Preview 1 entre GSAP y hover.

### Práctica de IA

`AIPractice` usa tabs accesibles para mostrar Frame → Explore → Build. Los tres paneles son artefactos DOM, no una animación grabada, y explican el posicionamiento: la IA reduce el ciclo de feedback mientras el juicio humano permanece en control.

### Casos

El artefacto principal pasó al hero. Un índice sticky permite saltar entre Overview, Decisions y Outcomes. Cada decisión alterna copy y un artefacto placeholder para modelar el ritmo que usarán capturas de Figma, prototipos, vídeos y demos reales.

## Responsive y QA

Se validaron 1280×720 y 390×844 en navegador real, en Human y System.

Correcciones hechas durante QA:

- el texto introductorio del hero ya no invade el retrato;
- el CTA queda visible en un portátil de 720 px de alto;
- el hero móvil usa columna explícita y no genera una falsa columna de 2 px;
- se eliminó un overflow horizontal causado por el margen del bloque de IA;
- la home móvil bajó aproximadamente de 10.300 px a 8.800 px;
- la segunda fotografía de About se omite en la home móvil porque el hero ya presenta el retrato;
- la descripción del caso recuperó sans y sentence case frente a un selector heredado;
- MotionController comprueba nodos opcionales y limpia transforms al terminar.

## Dependencias nuevas

- `three`
- `@react-three/fiber`
- `@types/three`

No añadir Drei, postprocesado o un motor de smooth scroll salvo que un caso real demuestre una necesidad concreta.

## Tarjeta social

`public/og.png` mide 1200×630. El fondo proviene de una única generación visual y el texto se compuso de forma determinista para garantizar spelling y jerarquía. Metadata Open Graph y Twitter apuntan al mismo archivo.

## Cómo continuar

1. Sustituir un caso a la vez siguiendo `CONTENT-AND-RELEASE.md`.
2. Antes de añadir media real, crear un contrato tipado común; no condicionales dispersos por slug.
3. Tratar capturas como evidencia: contexto, anotación y decisión, no galerías mudas.
4. Mantener los embeds opcionales y con fallback.
5. Repetir lint, tests, build, QA responsive, teclado, reduced motion y ambos temas.
6. Publicar versiones privadas sobre el mismo `project_id` hasta que contenido, contacto e indexación estén aprobados.
