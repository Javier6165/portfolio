# Plan 06 — Mejora posterior a Live File

Fecha: 25 de julio de 2026.

Este plan parte de `AUDIT-06-POST-LIVE-FILE.md`. No reabre la dirección creativa: estabiliza `Live File`, mejora la velocidad de comprensión y prepara la entrada de proyectos reales.

## Principios del siguiente ciclo

- Mantener `Live File`, System/Human, scroll nativo y GSAP como motor único.
- No añadir nuevos efectos hasta que los actuales sean legibles, medibles y coherentes.
- Corregir primero lo que afecta al primer minuto del recruiter.
- Separar fixes que no requieren contenido de las decisiones que necesitan datos de Javier.
- Cada fase termina con un gate; no se acumulan cambios sin validar.
- El sitio sigue privado y no indexado durante todo el plan.

## Fase 1 — Estabilización inmediata

Objetivo: eliminar bugs visibles y trampas de interacción antes de seguir diseñando.

Trabajo:

1. corregir el fondo de las labels del cursor en intro y cues;
2. cerrar el menú móvil tras navegar, con Escape y foco correcto;
3. añadir estado accesible al selector System/Human y fallback de storage;
4. corregir el whitespace semántico del `h1`;
5. decidir cada falso botón: implementar respuesta o retirarlo del tab order;
6. detener retries de cues cuando no son elegibles;
7. actualizar Next, RSC, Vite/Cloudflare/Wrangler de forma compatible;
8. ejecutar audit de dependencias tras actualizar;
9. añadir pruebas para cada regresión anterior.

Gate:

- lint, build y E2E limpios;
- cero `pageerror` con storage bloqueado;
- menú móvil cerrado después de `Work`/`Approach`;
- ningún control focusable sin resultado;
- cursor `Javier` legible en ambos temas;
- cero high de producción o excepción documentada.

Complejidad: M.

## Fase 2 — Hero estable, más rápido y sin interrupción

Objetivo: conservar el wow reduciendo coste, espera y layout shift.

Trabajo:

1. mantener el hero semántico en geometría final;
2. representar el frame editor mediante overlay/transform sin alterar layout;
3. sustituir la expansión Flip que registra CLS por una transición transform-only;
4. comprimir timing a `3,8–4,3 s`;
5. hacer visible el rol completo desde el primer frame mediante ghost/outline o representación equivalente;
6. mover el consentimiento fuera del payoff y eliminar su persistencia visual entre secciones;
7. exportar retratos AVIF/WebP con fallback y revisar calidad al 100%;
8. cargar con prioridad alta solo el retrato activo y diferir el alternativo;
9. verificar retorno, familiar, skip, scroll, fallo de imagen, no-JS y reduced motion.

Gate:

- CLS intro `≤0,05` local en desktop y móvil;
- primera intro `≤4,3 s`; retorno `≤1,8 s`;
- hero sin overlay de consentimiento durante su contemplación;
- imágenes iniciales del hero `≤200 KB` combinadas;
- sin flash de fotografía al cambiar de tema;
- nombre y rol comprensibles en el primer segundo.

Complejidad: L. Es la fase con mayor riesgo técnico/creativo.

## Fase 3 — Arquitectura de información y Live File transversal

Objetivo: que identidad, experiencia y trabajo se entiendan en un recorrido corto y que Live File deje de ser un efecto exclusivo del hero.

Trabajo:

1. mantener el hero sin párrafo explicativo;
2. reducir la segunda sección a cuatro flashes: seniority, GiG/5+ años, territorio de producto y AI + coded prototypes;
3. mover el timeline detallado tras Selected Work o a About;
4. iniciar Selected Work antes de `1,8` viewports desktop y `2,2` móvil;
5. rediseñar trayectoria como una selección/refinamiento visible ligada a la interacción de sus tabs;
6. dividir el cue de Work por card y convertir el primer frame en card/evidencia de forma determinista;
7. hacer que AI Practice transforme una pantalla estática en comportamiento real al interactuar, en lugar de depender de un cursor tardío;
8. retirar el threshold imposible y cualquier espera arbitraria para descubrir la narrativa;
9. mantener un máximo de tres intervenciones, pero asegurar que al menos dos aparecen en un recorrido normal;
10. eliminar repetición entre Profile, Approach, AI, Playground y About preview;
11. decidir qué preview de Playground merece permanecer en Home;
12. añadir un acceso claro a contacto en header/footer cuando Javier entregue los datos;
13. probar una lectura de `30 s`, `60 s` y `3 min`.

Gate:

- un reviewer puede responder en 30 segundos: quién es Javier, nivel, experiencia, tipo de producto y diferencial;
- el primer caso aparece dentro de los límites de scroll;
- en 60 segundos se perciben al menos dos manifestaciones de Live File además del hero;
- cada intervención demuestra refinamiento, framing o comportamiento; ninguna es un overlay gratuito;
- la Home pierde altura sin perder ninguna evidencia esencial;
- no hay párrafos redundantes entre Home y About.

Complejidad: M.

## Fase 4 — Primer case study real como vertical slice

Objetivo: demostrar que el sistema sirve para trabajo auténtico y no solo para placeholders.

Dependencias de Javier:

- elección del proyecto;
- permiso/confidencialidad;
- rol y colaboración reales;
- screenshots/exportaciones;
- outcomes verificables o aprendizaje cualitativo;
- créditos correspondientes.

Trabajo:

1. elegir el caso con mejor combinación de complejidad, ownership y evidencia;
2. construir una narrativa específica, sin forzar la plantilla ficticia;
3. usar `CaseBlock` para screenshots, galería, before/after, vídeo o prototipo;
4. separar hechos, contribución, decisiones y outcomes;
5. implementar una única demostración de comportamiento que aporte prueba;
6. mantener click-to-load para Figma/demos externas;
7. validar legibilidad de capturas en móvil y desktop;
8. retirar etiquetas ficticias solo de ese caso.

Gate:

- contexto, problema, papel, decisiones, colaboración y resultado se entienden;
- cada media aporta evidencia y tiene caption/alt/fallback;
- no existe información confidencial ni métrica inventada;
- el caso funciona sin embed externo;
- un recruiter puede resumir la contribución de Javier tras leerlo.

Complejidad: XL, dependiente de contenido.

## Fase 5 — Sistema visual y microinteracciones

Objetivo: elevar craft una vez que el recorrido principal sea estable.

Trabajo:

1. auditar todos los hovers/focus/touch con una gramática común;
2. revisar cards de proyecto, CTA y previews en System/Human;
3. ampliar diferencias de Human solo donde ayuden a ritmo y personalidad;
4. pulir las tres intervenciones transversales definidas en Fase 3 y eliminar cualquier cue redundante;
5. convertir AI Practice y token propagation en demostraciones coherentes, no controles simulados;
6. cargar ScrollTrigger después del hero o sustituir reveals simples por una primitive más ligera;
7. dividir estilos por ruta/componente y retirar legacy por zonas;
8. reducir hidratación de bloques estáticos de `CaseEvidence`.

Gate:

- cada interacción tiene hover, foco y equivalente táctil cuando corresponda;
- ningún efecto compite con lectura o CTA;
- Human y System son distintos en más de un viewport, no solo en el hero;
- reducción demostrable de CSS/JS inicial o justificación documentada.

Complejidad: L.

## Fase 6 — QA de lanzamiento y hardening

Objetivo: convertir el preview en candidato público, todavía sin abrirlo hasta aprobación.

Trabajo:

1. ejecutar E2E contra build de producción;
2. convertir la matriz en regresión visual con baselines revisados;
3. cubrir cues, settings, rechazo, storage bloqueado, menú, theme state y embeds;
4. probar Chrome, Safari/WebKit, Firefox y al menos un iPhone/Android real;
5. medir Lighthouse/CWV con media final;
6. añadir cabeceras de seguridad compatibles con Sites/Netlify y embeds;
7. validar canonical, OG, sitemap, 404 y metadata por caso;
8. limpiar Tailwind/Drizzle/starter y assets históricos si Sites sigue construyendo sin ellos;
9. añadir email, LinkedIn y CV revisados;
10. decidir hosting y dominio final;
11. solicitar aprobación explícita antes de desactivar preview/noindex.

Gate:

- LCP `≤2,5 s`, INP `≤200 ms`, CLS `≤0,1` en candidato real;
- cero high de producción;
- axe + teclado + reflow + storage + no-JS + reduced motion limpios;
- sin errores de Worker ni consola;
- contenido, créditos, contacto y privacidad aprobados por Javier;
- publicación abierta autorizada explícitamente.

Complejidad: L.

## Orden recomendado

```text
Fase 1: bugs y seguridad
  → Fase 2: hero estable y rápido
    → Fase 3: recorrido recruiter + Live File transversal
      → Fase 4: caso real
        → Fase 5: polish sistémico
          → Fase 6: candidato público
```

Fases 1 y 2 no necesitan contenido real y deben ejecutarse primero. La Fase 3 es obligatoria para cumplir el concepto aprobado y puede avanzar mientras Javier reúne material. La Fase 4 no debe comenzar con datos incompletos o inventados.

## Inputs pendientes de Javier

- completar cualquier matiz sobre cómo siente el concepto después de esta primera implementación;
- elegir el primer proyecto real y confirmar qué puede mostrarse;
- facilitar email, LinkedIn y CV final;
- decidir si los otros dos casos ficticios se mantienen como conceptos, se ocultan o esperan sustitución;
- aprobar hosting, dominio e indexación solo al final.

## Siguiente acción recomendada

Abrir el próximo ciclo con Fase 1 y Fase 2 juntas como un **stabilisation sprint de Live File**. El resultado debe ser la misma idea, pero más nítida: cursor legible, payoff sin banner, intro más corta, cero layout shift y una carga visual mucho más ligera. La Fase 3 debe ejecutarse inmediatamente después para cumplir la promesa transversal: trayectoria, Selected Work y AI/prototipos tienen que hablar el mismo lenguaje mediante comportamiento perceptible, no solo mediante componentes que existen en el código. Solo entonces conviene empezar el primer caso real.
