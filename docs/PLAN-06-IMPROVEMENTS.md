# Plan 06 — Mejora posterior a Live File

Fecha: 25 de julio de 2026.

Este plan parte de `AUDIT-06-POST-LIVE-FILE.md`. No reabre la dirección creativa: estabiliza `Live File`, mejora la velocidad de comprensión y prepara la entrada de proyectos reales.

La partitura creativa completa se define en `NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`. Ese documento es el contrato de la Fase 3: Home deja de tener tres overlays genéricos y pasa a ocho actos con un verbo, una acción y un estado final propios.

## Principios del siguiente ciclo

- Mantener `Live File`, System/Human, scroll nativo y GSAP como motor único.
- No añadir nuevos efectos hasta que los actuales sean legibles, medibles y coherentes.
- Corregir primero lo que afecta al primer minuto del recruiter.
- Separar fixes que no requieren contenido de las decisiones que necesitan datos de Javier.
- Cada fase termina con un gate; no se acumulan cambios sin validar.
- El sitio sigue privado y no indexado durante todo el plan.
- Cada sección conserva una traza de Live File, aunque no todas tengan comentario ni la misma intensidad.
- El cursor ficticio ejecuta cambios; nunca aparece únicamente para señalar decoración.

## Fase 0 — Guion y partitura transversal

Estado: **completada e implementada**. Evidencia en Documentos 08.

Objetivo: definir la experiencia completa antes de implementar escenas aisladas.

Entregable:

- tesis `última pasada de criterio`;
- gramática `Frame → Select → Change → Settle → Hand off`;
- score de ocho actos: Compose, Clarify, Frame, Propagate, Activate, Experiment, Reframe y Hand off;
- un cursor global en desktop y traducción táctil en móvil;
- tres comentarios prominentes después del hero y beats silenciosos en el resto;
- trigger determinista mediante ScrollTrigger, sin ratios imposibles ni esperas arbitrarias;
- estados finales persistentes para reduced motion, fast-scroll y retorno;
- guion System/Human y gates de atención.

Gate documental:

- cada sección tiene un verbo diferente;
- Work y AI son los dos picos posteriores al hero;
- ninguna escena es solo un overlay temporal;
- el recorrido completo mantiene scroll nativo y control del visitante.

Gate de prototipo, a completar en Fase 3:

- captura continua desktop/móvil de Hero → Profile → Work → AI;
- ritmo aprobado antes de completar los beats secundarios.

## Fase 1 — Estabilización inmediata

Estado: **completada**. Cursor, navegación, tema, controles, storage, dependencias y regresiones están corregidos; producción audita con cero vulnerabilidades.

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

Estado: **completada**. Intro `3,92/3,90 s`, CLS `0,0073/0`, retratos iniciales ~31 KB y consentimiento fuera del hero.

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

Estado: **completada**. Ocho actos, cursor singleton, ScrollTrigger, simulación AI, Replay Playground, traces settled y Work a `1,69/2,00` viewports.

Objetivo: que identidad, experiencia y trabajo se entiendan en un recorrido corto y que Live File deje de ser un efecto exclusivo del hero.

Trabajo:

1. mantener el hero sin párrafo explicativo;
2. reducir la segunda sección a cuatro flashes: seniority, GiG/5+ años, territorio de producto y AI + coded prototypes;
3. mover el timeline profesional detallado a `/about`; Home conserva cuatro flashes y una escena `Clarify` compacta;
4. iniciar Selected Work antes de `1,8` viewports desktop y `2,2` móvil;
5. construir `NarrativeDirector`, `JavierCursor` singleton y el contrato declarativo `LiveScene`;
6. sustituir `NarrativeCue`/IntersectionObserver por triggers sobre anchors reales mediante ScrollTrigger, sin scrub ni pinning;
7. implementar `Profile / Clarify`: agrupar los cuatro flashes y dejar `PROFILE / REFINED`;
8. implementar `Selected Work / Frame`: convertir el primer frame en card/evidencia viva y dejar `CASE 01 / LIVE`;
9. implementar `Expertise / Propagate`: una decisión compartida actualiza tres superficies y deja `1 CHANGE → 3 SURFACES`;
10. implementar `AI / Activate`: pasar de pantalla estática a una simulación real mediante un control funcional;
11. implementar `Playground / Experiment`: ejecutar un estudio cinético corto mediante playhead/replay real;
12. implementar `About / Reframe`: ajustar y aprobar el crop del retrato como rima visual del hero;
13. implementar `Footer / Hand off`: pasar de `Editing` a `Ready to share` y ceder control;
14. limitar los comentarios posteriores al hero a Profile, Work y AI; los demás beats son silenciosos;
15. añadir estados `settled` persistentes para fast-scroll, reduced motion, no-JS y visitas de retorno;
16. retirar el threshold imposible, los retries y cualquier espera arbitraria para descubrir la narrativa;
17. eliminar repetición entre Profile, Approach, AI, Playground y About preview;
18. añadir un acceso claro a contacto en header/footer cuando Javier entregue los datos;
19. probar una lectura de `30 s`, `60 s` y `3 min`.

Gate:

- un reviewer puede responder en 30 segundos: quién es Javier, nivel, experiencia, tipo de producto y diferencial;
- el primer caso aparece dentro de los límites de scroll;
- en 60 segundos se perciben al menos dos manifestaciones de Live File además del hero;
- al completar Home, todas las secciones conservan una traza de Live File;
- cada intervención demuestra clarificación, framing, propagación, comportamiento, experimentación, refinamiento o handoff; ninguna es un overlay gratuito;
- Work y AI son los dos momentos más memorables después del hero;
- ninguna escena necesita esperar quieto, conocer el concepto o usar hover;
- la Home pierde altura sin perder ninguna evidencia esencial;
- no hay párrafos redundantes entre Home y About.

Complejidad: M.

## Fase 4 — Primer case study real como vertical slice

Estado: **bloqueada por contenido y permisos reales de Javier**.

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

Estado: **parcial**. Home, System/Human y controles principales están pulidos; división de CSS, hidratación y carga selectiva quedan para el Plan 09.

Objetivo: elevar craft una vez que el recorrido principal sea estable.

Trabajo:

1. auditar todos los hovers/focus/touch con una gramática común;
2. revisar cards de proyecto, CTA y previews en System/Human;
3. ampliar diferencias de Human solo donde ayuden a ritmo y personalidad;
4. pulir la partitura transversal definida en Narrativa 07 y eliminar cualquier beat o cue redundante;
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

Estado: **parcial**. Chromium, axe, teclado, no-JS, reduced, storage, matriz full-page y performance local pasan. Quedan contenido/contacto, WebKit/Firefox, dispositivos reales, headers y medición pública.

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
    → Fase 3: implementar la partitura Live File transversal
      → Fase 4: caso real
        → Fase 5: polish sistémico
          → Fase 6: candidato público
```

Fases 0–3 están cerradas. Fases 5–6 tienen una base parcial. La Fase 4 no debe comenzar con datos incompletos o inventados; el orden vigente se detalla en `PLAN-09-NEXT-IMPROVEMENTS.md`.

## Inputs pendientes de Javier

- completar cualquier matiz sobre cómo siente el concepto después de esta primera implementación;
- elegir el primer proyecto real y confirmar qué puede mostrarse;
- facilitar email, LinkedIn y CV final;
- decidir si los otros dos casos ficticios se mantienen como conceptos, se ocultan o esperan sustitución;
- aprobar hosting, dominio e indexación solo al final.

## Siguiente acción recomendada

Recibir el dossier del primer proyecto real y ejecutar una única vertical slice con `CaseBlock`. Mientras llegan esos inputs, solo avanzar hardening reversible: dividir estilos, preparar baselines, retirar starter no usado y probar navegadores adicionales. Consulta `PLAN-09-NEXT-IMPROVEMENTS.md`.
