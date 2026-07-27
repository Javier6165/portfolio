# Contenido y release

## Sustituir un caso conceptual

1. Validar con Javier que el proyecto se puede publicar.
2. Separar hechos, inferencias, ownership y datos confidenciales.
3. Elegir una historia; no asumir que todos los casos necesitan la misma longitud.
4. Actualizar `Project` y componer `evidenceBlocks` con `CaseBlock`.
5. Sustituir nombre, contexto, rol, superficie, decisiones y outcomes.
6. Eliminar etiquetas de ficticio solo para el caso totalmente reemplazado. Un portfolio mixto necesitará `isConcept` por proyecto.
7. Actualizar metadata, tests y captions.

## Contrato de evidencia

La unión `CaseBlock` ya admite:

- `text`: argumento editorial.
- `image`: captura con alt, caption y aspect ratio.
- `gallery`: secuencia de imágenes legibles.
- `before-after`: comparación con tabs y teclado.
- `token-propagation`: comportamiento sistémico interactivo.
- `video`: controles, poster, caption y sin autoplay con sonido.
- `figma`: fallback local e iframe tras click.
- `prototype`: fallback local y demo tras click.

No añadas condicionales por slug. Si una historia necesita otro formato, amplía la unión, el renderer, el fallback, la accesibilidad y las pruebas.

## Preparación de media real

- Exporta screenshots a AVIF/WebP/JPEG en tamaños razonables; conserva texto legible.
- Añade anotaciones importantes en HTML, no horneadas en una imagen diminuta.
- Vídeo corto, sin autoplay con sonido, con poster y alternativa textual.
- Figma solo si la interacción aporta más que un vídeo; siempre click-to-load.
- Demos vibe-coded aisladas y con fallback por si dejan de responder.
- Todo bloque multimedia necesita caption, alt o descripción y aspect ratio reservado.
- Nunca sobrescribas `../Assets/`; guarda optimizaciones en `public/`.

## Memoria y privacidad

- No conviertas la memoria narrativa en analytics.
- No guardes URLs visitadas, movimientos, identidad o contenido de formularios.
- `Allow` y `No thanks` deben ser equivalentes y no bloqueantes.
- Mantén Replay, Forget y Motion accesibles desde el footer.
- Un cambio de schema requiere migración o limpieza explícita y actualización documental.

## Añadir contacto y CV

- No inventar email o perfiles.
- Sustituir el texto temporal del footer y `about#contact-note`.
- Guardar el CV público en `public/` solo tras revisar datos personales.

## Sustituir testimonials provisionales

- `testimonialSlots` vive en `app/data.ts` y separa `placeholder` de `verified`.
- No redactar una cita atribuida a partir de una impresión, una conversación o el perfil de LinkedIn.
- Pedir texto aprobado, nombre, cargo o relación profesional, fuente y permiso de publicación.
- Conservar la voz literal salvo correcciones acordadas; documentar cualquier edición relevante.
- Cambiar un slot a `verified` solo después de la aprobación de Javier y de la persona citada.
- Si las fuentes no llegan antes del lanzamiento, retirar la sección del candidato público o mantenerla únicamente en el preview privado claramente provisional.

## Checklist antes de permitir indexación

- Casos, métricas, roles y créditos verificados.
- Confidencialidad y permisos aprobados.
- Contacto y CV definitivos.
- Testimonials verificados y autorizados, o sección provisional retirada.
- Media optimizada y fallbacks comprobados.
- `app/config.ts` apunta al dominio final.
- Lint, build, smoke, Playwright, axe, responsive y teclado limpios.
- Lighthouse/Core Web Vitals revisados con contenido final.
- OG, sitemap y canonical validados.
- Javier autoriza publicación e indexación.

Solo entonces cambia `isPreview` a `false`.

## Publicación

- Reutilizar siempre el `project_id` de `.openai/hosting.json`.
- Validar y desplegar una nueva versión sobre el proyecto existente. El preview actual es accesible por enlace para QA en incógnito, pero conserva `noindex`, `nofollow` y `robots.txt` bloqueado.
- Netlify no está aprobado. Si se elige, definir adapter, repetir QA y no borrar Sites hasta validar la migración.
