# Plan 09 — De demo narrativa a portfolio verificable

Fecha: 25 de julio de 2026.

La Fase 3 de Home está cerrada. Este plan no añade efectos por inercia: convierte el sistema actual en una prueba profesional creíble y un candidato público.

## Fase A — Intake de contenido real

Estado: **bloqueada por inputs de Javier**.

Necesario:

- elegir el primer caso con mejor combinación de complejidad, ownership y evidencia;
- confirmar confidencialidad, empresa/producto, rol, colaboradores y créditos;
- recibir screenshots o exports de Figma, vídeo/prototipo si existe y outcomes verificables;
- decidir qué puede nombrarse y qué necesita anonimización;
- facilitar email, LinkedIn y CV final.

Gate: dossier de caso completo, sin datos inventados ni dudas de permiso.

## Fase B — Un caso real como vertical slice

1. Definir historia específica: contexto, problema, restricciones, rol, decisiones, colaboración, evidencia y resultado.
2. Elegir solo los `CaseBlock` que prueben algo; no rellenar una plantilla.
3. Sustituir un caso conceptual y retirar sus etiquetas ficticias solo tras verificarlo entero.
4. Aplicar Live File dentro del caso con máximo dos o tres acciones: seleccionar el problema, anotar evidencia y demostrar comportamiento/propagación.
5. Mantener Figma/prototipo click-to-load y fallback local.
6. Validar legibilidad de screenshots en móvil, captions, alt y crédito.

Gate: un recruiter puede explicar la contribución real de Javier después de leerlo.

## Fase C — Rutas secundarias

- `/about`: conectar etapas con un beat `Connect`; Lead permanece como responsabilidad reciente dentro de identidad Senior.
- `/playground`: convertir placeholders en 2–3 experimentos reales con Play/Reset/Remix.
- `/work/[slug]`: usar anotaciones solo donde aclaren decisión o contribución.
- Footer/header: introducir contacto real, LinkedIn y CV sin añadir un formulario innecesario.

Gate: Live File sigue siendo gramática, no chrome repetido en cada pantalla.

## Fase D — Rendimiento y mantenibilidad

1. Separar CSS por Home/About/Work/Playground y retirar legacy por zonas.
2. Dividir tipos estáticos de `CaseEvidence` en server components.
3. Evaluar carga diferida de ScrollTrigger/MotionPath después del hero con métricas comparables.
4. Eliminar D1/Drizzle/examples si el pipeline de Sites sigue pasando sin ellos.
5. Añadir un comando E2E contra `vinext start` y conservar `tests/performance-audit.mjs` como gate.
6. Añadir headers de seguridad compatibles con embeds aprobados.

Gate: reducción medible de JS/CSS o justificación explícita; cero vulnerabilidades high de producción.

## Fase E — QA candidata

1. Baselines visuales revisados para cuatro viewports y dos temas.
2. Chromium, WebKit y Firefox.
3. iPhone y Android reales: touch, scroll, memoria, theme y replay.
4. Lighthouse en URL candidata con media final.
5. Teclado, axe, 320 px, no-JS, reduced motion, storage bloqueado, fallos de media y embeds.
6. Metadata, OG, 404, sitemap, canonical y social previews.

Gate: LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1 en candidato; sin errores de consola/Worker.

## Fase F — Decisión de release

- elegir Sites o Netlify y dominio final;
- revisar privacidad y analytics; por defecto ninguno;
- obtener aprobación explícita de contenido, contacto, publicación e indexación;
- mantener el sitio privado hasta esa aprobación.

## Orden

```text
Inputs reales
  → un caso vertical
    → rutas secundarias
      → hardening
        → QA candidata
          → release aprobado
```

No iniciar Fase B con contenido incompleto. Mientras llegan inputs, solo son seguros el hardening reversible, la división de estilos y la preparación de baselines.
