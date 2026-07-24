# Arquitectura de la aplicación

## Capas

1. **Contenido y rutas de servidor**: páginas de `app/` y datos de `app/data.ts`.
2. **Sistema visual**: `app/globals.css`, organizado por layers `reset`, `base`, `components`, `pages` y `responsive`.
3. **Interacción cliente**: `ThemeToggle`, `MotionController`, `ComplexityEngine`, `ExperienceSignal`, `ProjectCard` y `AIPractice`.
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
4. El evento `portfolio-theme-change` sincroniza `MotionController`, los retratos y la paleta del canvas 3D sin acoplar los componentes.

No muevas la lectura inicial a un `useEffect`: reintroduciría un flash y un cambio de layout/imagen al hidratar.

## Motion progresivo

`MotionController` conoce tres hooks vigentes:

- `.js-hero-reveal`: entrada inicial.
- `.js-reveal`: entrada única al viewport.
- `.theme-swap`: feedback al cambiar de tema.

El contenido no empieza oculto en CSS. GSAP aplica `fromTo` después de montar; si JavaScript falla, el usuario ve el documento completo. Reduced motion cancela el controlador y CSS elimina transiciones restantes.

Los reveals eliminan su `transform` inline al terminar para no competir con hover y microinteracciones CSS. Los selectores opcionales se comprueban antes de crear timelines, por lo que navegar a About, Playground o un caso no produce warnings por nodos ausentes.

## Firma interactiva del hero

- `ComplexityEngine.tsx` gestiona dominio, tema y reduced motion; sus controles son botones reales con `aria-pressed`.
- `ComplexityScene.tsx` contiene la escena R3F. Interpola catorce nodos entre cuatro topologías (`rules`, `content`, `operations`, `ai`).
- La escena se carga con `dynamic(..., { ssr: false })`; el retrato y todo el contenido del hero se renderizan en servidor.
- El canvas usa DPR limitado a `1–1.5`, materiales simples y ninguna luz o postproducción. En reduced motion usa `frameloop="demand"`.
- No añadir un segundo canvas ni convertir la escena en dependencia para comprender o navegar la página.

## Interacción y evidencia

- `ExperienceSignal.tsx` es una trayectoria real con patrón tab/tabpanel, navegación por flechas, spotlight local y progreso visual. El contenido activo cambia con hover, focus o click; no depende de una única modalidad de entrada.
- `ProjectCard.tsx` separa `.project-card-shell.js-reveal` de la tarjeta interactiva. Así GSAP nunca pisa el transform de hover.
- `AIPractice.tsx` es un patrón tab/tabpanel accesible que demuestra Frame → Explore → Build con artefactos DOM.
- `ProjectVisual.tsx` sigue siendo arte CSS ficticio. En casos reales debe sustituirse por capturas, vídeo, embed de Figma o demo funcional, con fallback y contexto editorial.

## Casos conceptuales

`app/data.ts` define el tipo `Project` y los tres objetos. Además del relato, cada proyecto declara `surface`, `proof`, `artifactLabel` y `challengeTitle`. La plantilla dinámica:

- genera metadata;
- presenta contexto, rol y formato de evidencia junto al primer artefacto;
- incluye un índice sticky y alterna decisiones con artefactos;
- muestra outcomes ilustrativos;
- conecta el siguiente caso.

`ProjectVisual` genera visuales CSS abstractos. No representan interfaces reales ni deben presentarse como capturas de producto.

## Assets

Los assets servidos son locales y no dependen de un CDN. Consulta `docs/ASSETS.md` antes de sustituirlos.

## Starter preservado

La infraestructura opcional de D1, Drizzle y autenticación proviene del starter de Sites, pero no participa en el portfolio. No añadas persistencia o login salvo que una necesidad futura lo justifique y se documente.
