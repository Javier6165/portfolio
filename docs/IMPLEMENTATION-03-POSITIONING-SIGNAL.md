# Preview 3 — posicionamiento y trayectoria como señal

Este documento registra la implementación derivada de `AUDIT-03-COPY-POSITIONING-AND-INTERACTION.md` para que otro Codex pueda continuar el proyecto sin reinterpretar las decisiones.

## Objetivo

Preview 2 tenía una firma visual fuerte, pero el headline poético obligaba a deducir demasiado. Preview 3 hace que un recruiter o design leader pueda identificar en el primer vistazo:

- a Javier Ortiz como Senior Product Designer con experiencia reciente de Lead;
- su especialidad en plataformas B2B y backoffice complejas;
- más de cinco años dentro de GiG y la progresión Junior → Lead;
- su combinación de product craft, sistemas, IA y prototipos con código.

Los casos siguen siendo conceptuales. Por esa razón la trayectoria real aparece antes que ellos y la sección de trabajo se rotula `Case-study previews`.

## Hero

### Jerarquía

1. Eyebrow con nombre, rol y localización.
2. Headline descriptivo: `I design complex platforms people can understand.`
3. Dos frases de evidencia: GiG, progresión, productos y práctica actual con IA/código.
4. CTA explícito a casos conceptuales y CTA a trayectoria.
5. Cuatro celdas: role, product terrain, track record y edge.

La frase `I design the systems behind the screen` deja de ser el titular y continúa en la metáfora del Complexity Engine.

### Complexity Engine

Los dominios genéricos se sustituyeron por superficies verificadas:

- Rule engines;
- CMS;
- Design systems;
- AI + code.

Hover, focus y click cambian la topología. El nodo principal se desplazó fuera del centro de la cara para que la escena complemente el retrato en lugar de taparlo.

## Trayectoria interactiva

`app/components/ExperienceSignal.tsx` contiene cuatro etapas:

1. Visual craft;
2. Games & 3D;
3. Complex product;
4. Lead + AI.

La interacción adapta patrones estudiados en 21st.dev, Motion Primitives, Magic UI y Aceternity:

- spotlight local según puntero;
- beam de progreso entre etapas;
- panel narrativo que responde a hover, click, focus y flechas de teclado;
- transición corta al cambiar de etapa.

El contenido completo sigue presente sin WebGL y la lectura no depende del spotlight. En reduced motion se elimina la luz y las transiciones quedan prácticamente instantáneas.

## Copy revisado

Las antiguas capacidades abstractas se volvieron concretas:

- backoffice y lógica de producto;
- sistemas y escala;
- IA y prototipos funcionales.

La sección de IA ahora explica acciones concretas —estructurar contexto, cuestionar supuestos, explorar opciones restringidas y construir prototipos— y deja explícito que juicio y responsabilidad permanecen en manos humanas.

La metadata social y SEO privada se actualizó con el nuevo posicionamiento. `robots` permanece bloqueado porque los casos y métricas son ficticios.

## Archivos principales

- `app/page.tsx`: jerarquía, copy y nuevo orden de la home.
- `app/components/ExperienceSignal.tsx`: trayectoria interactiva.
- `app/components/ComplexityEngine.tsx`: dominios y copy del HUD.
- `app/components/ComplexityScene.tsx`: posición del core 3D.
- `app/globals.css`: composición del hero, cuatro flashes, spotlight, beam y responsive.
- `app/layout.tsx`: metadata.
- `tests/rendered-html.test.mjs`: contratos de contenido crítico.
- `docs/AUDIT-03-COPY-POSITIONING-AND-INTERACTION.md`: investigación y decisiones.

## QA realizado

- ESLint sin errores.
- Build de producción completado.
- Tres pruebas de render de servidor superadas.
- `git diff --check` sin errores de whitespace.
- QA visual en navegador a 1280×720, Human y System.
- Verificados en navegador el cambio de tema, los tabs de trayectoria, el copy renderizado y la ausencia de errores de ejecución. Three.js emite un warning de deprecación de `THREE.Clock` procedente de la integración, no un fallo de la aplicación.
- La recomposición móvil define hero lineal, cuatro flashes 2×2, tabs 2×2 y panel apilado. Antes de indexar públicamente debe repetirse la comprobación visual a 390×844, como exige `CONTENT-AND-RELEASE.md`.

El build mantiene el aviso conocido de un chunk superior a 500 kB. La escena 3D ya se carga dinámicamente y el contenido crítico es server-rendered; no se sacrifica la firma visual durante el preview. Volver a medir cuando los casos reales añadan vídeo, Figma o demos.

## Cómo continuar

1. Sustituir un caso conceptual por uno real y añadir `isConcept` antes de mezclar ambos estados.
2. Verificar qué nombres de producto y capturas pueden publicarse.
3. Reemplazar claims genéricos por ownership, decisiones, restricciones e impacto demostrable.
4. Mantener las cuatro señales del hero aunque cambie el wording.
5. Usar nuevas animaciones solo si explican evidencia o comportamiento del producto.
6. Repetir teclado, reduced motion, mobile, temas, tests y publicación privada tras cada cambio estructural.
