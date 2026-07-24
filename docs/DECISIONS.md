# Decisiones vigentes

Este documento resume las decisiones que un nuevo colaborador necesita si recibe solo el repositorio `site/`.

## Producto y narrativa

- Concepto: `Human / System`.
- Headline: `I design the calm inside complex products.`
- Idioma principal: inglés.
- Posicionamiento: Senior Product Designer con experiencia reciente como lead.
- Los casos actuales son previews ficticios y deben permanecer rotulados.

## Dirección visual

- Grid editorial asimétrico de doce columnas en desktop.
- Móvil se recompone de forma lineal; no es una reducción literal del desktop.
- Instrument Sans para voz editorial y Fragment Mono para metadatos.
- Paleta oscura `System` y clara `Human`, ambas semánticas.
- Las fotografías son parte del concepto de tema, no avatares intercambiables.

## Tecnología

- Next.js 16 + React 19 sobre vinext/Sites.
- CSS nativo, custom properties y cascade layers.
- GSAP/ScrollTrigger para una capa pequeña de motion progresivo.
- Datos TypeScript para los casos conceptuales.
- Sin base de datos, R2, autenticación, analytics o variables de entorno.
- El scaffolding opcional de D1/Auth del starter no se usa actualmente.

## Decisiones negativas

- Sin smooth scroll ni scroll-jacking.
- Sin WebGL/canvas global.
- Sin librería de componentes genérica.
- Sin contacto inventado.
- Sin indexación mientras el contenido sea ficticio.

## Hosting

- Preview privado en Sites.
- El proyecto existente está identificado en `.openai/hosting.json`.
- Netlify es una opción de lanzamiento, no una migración aprobada.
- Nunca crear un segundo sitio por no encontrar el contexto de publicación.
