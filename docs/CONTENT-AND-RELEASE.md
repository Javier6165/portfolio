# Contenido y release

## Sustituir un caso conceptual

1. Validar con Javier que el proyecto se puede publicar.
2. Separar hechos, inferencias y datos confidenciales.
3. Actualizar o ampliar el tipo `Project` en `app/data.ts` si la historia real necesita otra estructura.
4. Sustituir nombre, contexto, rol, decisiones y outcomes.
5. Eliminar etiquetas de ficticio solo en el caso completamente reemplazado; la UI actual las aplica de forma global, así que un portfolio mixto requerirá un campo `isConcept` por proyecto.
6. Sustituir `ProjectVisual` por artefactos reales optimizados o por una visualización honesta.
7. Actualizar smoke tests y metadata.

No fuerces un caso real a caber en tres decisiones si eso empeora la historia. La plantilla es un punto de partida, no una restricción editorial.

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
