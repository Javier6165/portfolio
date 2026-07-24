# Decisiones vigentes

Este documento resume las decisiones que un nuevo colaborador necesita si recibe solo el repositorio `site/`.

## Producto y narrativa

- Concepto: `Human / System`.
- Headline: `I design complex platforms people can understand.`
- Idioma principal: inglés.
- Posicionamiento: Senior Product Designer especializado en sistemas de producto complejos, con experiencia reciente como lead y una práctica explícita de diseño con IA y código.
- Territorios que deben aparecer pronto: rule engines, CMS/backoffice, plataformas multi-producto, experiencias player-facing y prototipos funcionales.
- Los casos actuales son previews ficticios y deben permanecer rotulados.
- `I design the systems behind the screen` sigue siendo la metáfora de la firma 3D, no la única explicación del rol.
- El primer viewport debe responder cuatro preguntas: rol, terreno de producto, track record y ventaja diferencial.
- La evidencia real de trayectoria aparece antes que los casos ficticios.

## Dirección visual

- Grid editorial asimétrico de doce columnas en desktop.
- Móvil se recompone de forma lineal; no es una reducción literal del desktop.
- Instrument Sans para voz editorial y Fragment Mono para metadatos.
- Paleta oscura `System` y clara `Human`, ambas semánticas.
- Las fotografías son parte del concepto de tema, no avatares intercambiables.
- La firma interactiva es `Complexity Engine`: retrato + red 3D + cuatro dominios seleccionables. Debe seguir siendo una demostración contenida, no un fondo WebGL global.
- Los casos abren con un artefacto visual y alternan razonamiento con evidencia. No volver al formato de texto largo seguido de una única imagen gigante.

## Tecnología

- Next.js 16 + React 19 sobre vinext/Sites.
- CSS nativo, custom properties y cascade layers.
- GSAP/ScrollTrigger para una capa pequeña de motion progresivo.
- Three.js + React Three Fiber solo para el motor 3D del hero, cargado de forma dinámica en cliente.
- Datos TypeScript para los casos conceptuales.
- Sin base de datos, R2, autenticación, analytics o variables de entorno.
- El scaffolding opcional de D1/Auth del starter no se usa actualmente.

## Decisiones negativas

- Sin smooth scroll ni scroll-jacking.
- Sin WebGL/canvas global; el único canvas está acotado al hero y tiene fallback estático.
- Sin librería de componentes genérica.
- Sin contacto inventado.
- Sin indexación mientras el contenido sea ficticio.

## Dirección aprobada e implementada en Preview 2

La auditoría `AUDIT-02-POSITIONING-AND-WOW.md` quedó aprobada cuando Javier pidió proceder con las mejoras. La implementación resultante está explicada en `IMPLEMENTATION-02-SIGNATURE-EXPERIENCE.md`.

La línea anterior, `I design the calm inside complex products`, puede reaparecer como manifiesto secundario, pero ya no es el posicionamiento principal.

## Dirección aprobada para Preview 3

La petición de auditar copy y posicionamiento aprueba la dirección de `AUDIT-03-COPY-POSITIONING-AND-INTERACTION.md`:

- identidad explícita: Javier Ortiz / Senior Product Designer / Marbella y remoto;
- especialidad: plataformas complejas, rules, CMS y backoffice;
- evidencia: más de cinco años en GiG y progresión Junior → Lead;
- ventaja: pensamiento de sistemas, craft visual y prototipado con IA/código;
- trayectoria interactiva `How I got here` antes de los casos conceptuales;
- spotlight, conexión animada y proximidad solo donde cuentan esa historia.

## Hosting

- Preview privado en Sites.
- El proyecto existente está identificado en `.openai/hosting.json`.
- Netlify es una opción de lanzamiento, no una migración aprobada.
- Nunca crear un segundo sitio por no encontrar el contexto de publicación.
