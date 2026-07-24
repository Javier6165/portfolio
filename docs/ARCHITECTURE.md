# Arquitectura de la aplicación

## Capas

1. **Contenido y rutas de servidor**: páginas de `app/` y datos de `app/data.ts`.
2. **Sistema visual**: `app/globals.css`, organizado por layers `reset`, `base`, `components`, `pages` y `responsive`.
3. **Interacción cliente**: `ThemeToggle` y `MotionController`.
4. **Infraestructura Sites**: `vite.config.ts`, `worker/`, `build/` y `.openai/hosting.json`.

## Rutas

- `/`: narrativa principal.
- `/about`: trayectoria, capacidades y contacto temporal.
- `/playground`: módulos conceptuales de experimentación.
- `/work/[slug]`: plantilla de casos alimentada desde `projects`.
- `not-found.tsx`: 404 editorial.
- `sitemap.ts` y `robots.ts`: derivados de `app/config.ts`.

## Configuración central

`app/config.ts` contiene:

- URL desplegada actual.
- `isPreview`, que mantiene robots bloqueados.

Cuando exista dominio definitivo, cambia la URL y solo establece `isPreview: false` después de aprobar contenido e indexación.

## Sistema de tema

El tema usa `data-theme` en `<html>` con dos valores:

- `system`: oscuro.
- `human`: claro.

Flujo:

1. El script inline de `layout.tsx` lee `localStorage` antes de pintar.
2. `globals.css` resuelve tokens y visibilidad de fotografías desde `data-theme`.
3. `ThemeToggle` cambia el atributo, `colorScheme` y `localStorage`.
4. El evento `portfolio-theme-change` permite que `MotionController` añada una transición breve sin acoplar ambos componentes.

No muevas la lectura inicial a un `useEffect`: reintroduciría un flash y un cambio de layout/imagen al hidratar.

## Motion progresivo

`MotionController` conoce cuatro hooks:

- `.js-hero-reveal`: entrada inicial.
- `.js-reveal`: entrada única al viewport.
- `.throughline__progress`: progreso ligado al scroll.
- `.theme-swap`: feedback al cambiar de tema.

El contenido no empieza oculto en CSS. GSAP aplica `fromTo` después de montar; si JavaScript falla, el usuario ve el documento completo. Reduced motion cancela el controlador y CSS elimina transiciones restantes.

## Casos conceptuales

`app/data.ts` define el tipo `Project` y los tres objetos. La plantilla dinámica:

- genera metadata;
- presenta contexto, rol y estado;
- muestra decisiones y outcomes;
- conecta el siguiente caso.

`ProjectVisual` genera visuales CSS abstractos. No representan interfaces reales ni deben presentarse como capturas de producto.

## Assets

Los assets servidos son locales y no dependen de un CDN. Consulta `docs/ASSETS.md` antes de sustituirlos.

## Starter preservado

La infraestructura opcional de D1, Drizzle y autenticación proviene del starter de Sites, pero no participa en el portfolio. No añadas persistencia o login salvo que una necesidad futura lo justifique y se documente.
