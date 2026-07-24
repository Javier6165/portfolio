# Instrucciones del repositorio de la web

## Antes de editar

Lee, en este orden:

1. `README.md`
2. `docs/PROJECT-CONTEXT.md`
3. `docs/DECISIONS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/CONTENT-AND-RELEASE.md`
6. `docs/ASSETS.md` si vas a tocar imágenes.

## Contratos que debes preservar

- `app/config.ts` es la única fuente para URL y estado preview/público.
- Los valores de tema válidos son `system` y `human`.
- La clave local del tema es `javier-theme`.
- El evento `portfolio-theme-change` sincroniza el selector con la animación de fotografías.
- `.js-hero-reveal`, `.js-reveal` y `.theme-swap` son hooks de motion, no clases visuales arbitrarias.
- El contenido debe seguir siendo visible si GSAP no carga o reduced motion está activo.
- `ComplexityEngine` es el único canvas/WebGL del sitio: debe conservar fallback, DPR limitado y modo reduced-motion.
- Los reveals de GSAP no deben dejar transforms inline que anulen hovers de CSS.
- Los casos conceptuales deben seguir rotulados como ficticios.
- `.openai/hosting.json` identifica el sitio existente; no cambies ni derives su `project_id`.

## Estilo de implementación

- Prefiere componentes de servidor; añade cliente solo si una interacción lo necesita.
- Usa tokens de `globals.css`; no dupliques colores literales en páginas.
- Añade comentarios para explicar decisiones, fallbacks o contratos entre archivos, no para narrar JSX evidente.
- Conserva navegación semántica, foco visible, skip link y estados de teclado/touch.
- No añadas smooth scroll, scroll-jacking o motion imprescindible para entender contenido.

## Validación

Ejecuta `npm run lint` y `npm test`. Si cambia el contenido que cubren los smoke tests, actualiza las aserciones para comprobar la nueva intención, no para silenciar fallos.

Los cambios desplegables deben publicarse como una nueva versión privada del mismo proyecto Sites mediante la skill de Sites.
