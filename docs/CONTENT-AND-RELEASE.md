# Contenido y release

## Sustituir un caso conceptual

1. Validar con Javier que el proyecto se puede publicar.
2. Separar hechos, inferencias y datos confidenciales.
3. Actualizar o ampliar el tipo `Project` en `app/data.ts` si la historia real necesita otra estructura.
4. Sustituir nombre, contexto, rol, superficie, formato de evidencia, decisiones y outcomes.
5. Eliminar etiquetas de ficticio solo en el caso completamente reemplazado; la UI actual las aplica de forma global, así que un portfolio mixto requerirá un campo `isConcept` por proyecto.
6. Sustituir `ProjectVisual` por artefactos reales optimizados o por una visualización honesta. Mantener un primer artefacto visible en el hero del caso.
7. Actualizar smoke tests y metadata.

No fuerces un caso real a caber en tres decisiones si eso empeora la historia. La plantilla es un punto de partida, no una restricción editorial.

## Formatos previstos para evidencia real

- **Captura Figma**: exportar AVIF/WebP en varios tamaños, conservar el texto legible y añadir anotaciones en HTML cuando sea posible.
- **Prototipo Figma**: embed solo si aporta una interacción que una secuencia de vídeo no explica mejor; incluir imagen fallback y enlace directo.
- **Vídeo**: MP4/WebM corto, sin autoplay con sonido, con `poster`, controles y alternativa para reduced motion.
- **Demo vibe-coded**: enlace externo claro o embed aislado; nunca bloquear el caso si la demo tarda o deja de estar disponible.
- **Sistema/flow**: usar una imagen navegable o fragmentos progresivos, no reducir un diagrama denso hasta hacerlo ilegible.

Antes de implementar estos formatos, ampliar `Project` con una unión discriminada para media (`image`, `video`, `figma`, `demo`) en lugar de añadir condicionales por slug.

## Añadir contacto y CV

- No inventar email o perfiles.
- Sustituir el texto temporal del footer y `about#contact-note`.
- Guardar el CV público en `public/` únicamente tras revisar datos personales.
- Verificar que enlaces externos usan la URL definitiva.

## Checklist antes de permitir indexación

- Todos los casos y métricas están verificados.
- Claims de rol y ownership son precisos.
- Clientes, colaboradores y créditos están aprobados.
- Contacto y CV son definitivos.
- `app/config.ts` apunta al dominio final.
- QA responsive y de teclado completado.
- axe sin errores críticos.
- Lighthouse y Core Web Vitals revisados.
- OG image, sitemap y canonical validados.
- Javier autoriza publicación e indexación.

Solo entonces cambia `isPreview` a `false`.

## Publicación en Sites

- Reutilizar siempre el `project_id` de `.openai/hosting.json`.
- Validar, guardar el source exacto y desplegar una nueva versión privada.
- No incluir tokens, credenciales o IDs temporales en documentación.

## Posible migración a Netlify

La migración no está aprobada. Si se decide:

1. Confirmar compatibilidad del runtime y rutas dinámicas.
2. Definir el adapter/deployment target antes de cambiar código.
3. Mantener el contrato de `app/config.ts`.
4. Repetir build, pruebas, QA y metadata sobre la URL de Netlify.
5. No borrar el proyecto Sites hasta validar la nueva producción.
