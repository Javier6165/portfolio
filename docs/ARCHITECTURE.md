# Arquitectura de la aplicación

## Capas

1. **Contenido y rutas de servidor**: páginas de `app/` y datos de `app/data.ts`.
2. **Sistema visual**: `app/globals.css`, organizado por layers `reset`, `base`, `components`, `pages` y `responsive`.
3. **Interacción cliente**: `ThemeToggle`, `MotionController`, `LivingFold`, `ExperienceSignal`, `ProjectCard` y `AIPractice`.
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

- `LivingFold.tsx` sincroniza tema y preferencia de movimiento. Carga la escena de forma dinámica sin bloquear el HTML del hero.
- `LivingFoldScene.tsx` deforma una única lámina subdividida mediante vertex shader y calcula su material iridiscente en fragment shader. No usa modelos, partículas, texturas ni postproducción.
- La entrada despliega la lámina; el puntero solo altera tensión y orientación; el scroll nativo la comprime en una franja al llegar a la segunda sección.
- El canvas usa DPR limitado a `1–1.6` y una única geometría. El tema interpola la paleta del material sin recrear la escena.
- El fallback CSS se renderiza en servidor detrás del canvas. Con reduced motion el canvas se oculta y ese fotograma estático queda como composición final.
- El visual es decorativo. Nombre, rol y enlace de avance son HTML semántico y no dependen de WebGL.
- No añadir un segundo canvas, controles o texto explicativo dentro del hero. La arquitectura completa se documenta en `IMPLEMENTATION-04-LIVING-FOLD-HERO.md`.

## Secuencia Home: impacto y claridad

El primer viewport contiene únicamente `Javier Ortiz`, `Senior Product Designer` y `Explore`. La segunda sección `profile-intro` contiene el retrato temático, la síntesis profesional y tres hechos escaneables; después conserva `ExperienceSignal` como trayectoria interactiva. Esta separación es deliberada: el hero capta atención y la siguiente pantalla explica el perfil.

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
