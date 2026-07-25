# Auditoría 08 — Live File transversal

Fecha: 25 de julio de 2026.

## Veredicto

La Fase 3 cumple su objetivo. Live File ya no es un hero aislado: Home conserva una traza reconocible en cada sección, tiene un cursor singleton en desktop, traducción táctil en móvil y ocho acciones posteriores con propósito distinto. Work y AI funcionan como picos; el resto respira.

La auditoría previa señalaba cinco P0. Los cinco están cerrados:

1. Work tenía un trigger matemáticamente imposible: sustituido por ScrollTrigger sobre anchors reales.
2. Intro por encima del presupuesto de CLS: ahora `0,0073/0`.
3. Label del cursor ilegible: fondo/texto explícitos y contraste revisado.
4. Consentimiento sobre el payoff: integrado después de Profile.
5. Vulnerabilidades high de producción: cero tras actualizar el stack.

Además, Selected Work pasó de 2,5–3 viewports a 1,69 desktop y 2,00 móvil; la intro bajó de ~5,5 s a ~3,9 s; y los retratos iniciales pasaron de casi 950 KB JPEG a ~31 KB AVIF cargados.

## Método

- build local de producción y script de performance reproducible;
- scroll deliberado, fast-scroll, primera/segunda/tercera visita;
- no-JS, reduced motion, fallo de retrato y storage bloqueado;
- teclado, axe y controles funcionales;
- full-page System/Human en cuatro viewports;
- timing real de armado, comentario diferido y cancelación al abandonar una sección;
- auditoría de dependencias de producción y desarrollo;
- lectura editorial de 30/60 segundos basada en posiciones reales.

## Gates creativos

| Gate | Resultado |
| --- | --- |
| Nombre y rol desde el primer frame | Cumple |
| Cuatro flashes profesionales en Profile | Cumple |
| Work antes de 1,8 vp desktop / 2,2 móvil | Cumple: 1,69 / 2,00 |
| Dos manifestaciones después del hero en 60 s | Cumple: Profile + Work; AI después |
| Traza en todas las secciones Home | Cumple |
| Un verbo distinto por sección | Cumple |
| Work y AI como picos | Cumple |
| Máximo tres comentarios posteriores | Cumple |
| Sin esperar quieto ni hover obligatorio | Cumple |
| Contenido visible antes de la intervención | Cumple: 450–750 ms de pausa |
| Comentarios posteriores a lectura/corrección | Cumple: ~1,6–1,75 s desde armado |
| Scroll nativo y control del visitante | Cumple |
| System/Human con dirección propia | Cumple |

## Gates técnicos

| Gate | Resultado |
| --- | --- |
| Intro ≤4,3 s | 3,94 / 3,89 s |
| CLS local ≤0,05 | 0,0073 / 0 |
| Hero inicial ≤200 KB de imagen | ~31 KB |
| No-JS usable | Cumple |
| Reduced motion | Cumple |
| Sin overflow | Cumple en 4 viewports |
| axe | 0 violaciones automáticas |
| Producción sin vulnerabilidades conocidas | 0 |
| Lint/build/smoke/E2E | Limpios |

## Qué funciona especialmente bien

- El concepto se percibe sin convertir la página en un clon de Figma.
- El editor aparece como capa de criterio y desaparece antes de competir con el producto.
- Los estados finales dan continuidad incluso con motion reducido.
- Profile es mucho más rápido de escanear y no repite el timeline completo.
- La primera card transforma el framing en evidencia sin bloquear su link.
- AI respalda el posicionamiento con comportamiento ejecutable.
- Playground permite repetir, de modo que su movimiento no es un autoplay decorativo.
- Human cambia tipografía, composición, color, retrato y geometría en toda Home.
- Testimonials introduce un pico editorial tardío sin fingir prueba social: `Verify`, `source required` y el contrato tipado hacen visible la integridad del contenido.
- La ampliación de axe a Human móvil detectó y cerró una deuda previa: muted, coral pequeño y texto sobre cobalto cumplen ahora el control automático AA en Home y Northstar.
- La implementación conserva servidor, no-JS y fallos seguros.
- Las correcciones ya no compiten con la llegada a la sección: primero se arma, después actúa; si el visitante continúa, la escena cede sin reaparecer tarde.

## Hallazgos restantes

### P0 — bloqueos de lanzamiento, no de esta fase

1. **No existe todavía un caso real.** Atlas, Northstar, Pulse y sus métricas siguen siendo conceptos. El portfolio puede demostrar craft, pero no ownership verificable.
2. **Falta conversión real.** Email, LinkedIn y CV siguen pendientes; footer y About lo indican explícitamente.
3. **Faltan testimonials reales.** Los tres slots actuales son perspectivas y prompts explícitos, no recomendaciones; necesitan fuente, atribución y permiso o deben retirarse del candidato público.
4. **No se puede abrir indexación.** Contenido, confidencialidad, contacto, dominio y aprobación siguen pendientes de Javier.

### P1 — siguiente mayor impacto

1. Extender Live File a un caso real: problema seleccionado, anotaciones sobre evidencia, before/after o prototipo y handoff de contribución.
2. Sustituir un único caso ficticio antes de expandir el framework a los demás.
3. Probar Safari/WebKit, Firefox y dispositivos táctiles reales con la media definitiva.
4. Medir Lighthouse sobre la URL candidata y luego field data; el LCP local es muy bajo, pero no prueba red pública.
5. Añadir visual regression con baselines aprobados; la matriz actual detecta overflow y genera evidencia, pero no compara píxel a píxel.

### P2 — mantenimiento y hardening

1. El JS codificado inicial es ~453 KB. Mucho menor que Living Fold, pero GSAP, ScrollTrigger y MotionPath pueden cargarse de forma más selectiva tras fijar contenido real.
2. El CSS codificado es ~103 KB y `globals.css` aún mezcla Home, About, casos y legacy; Testimonials ya está co-localizado en su módulo.
3. `CaseEvidence` hidrata el renderer completo aunque algunos tipos sean estáticos.
4. Ocho avisos quedan en tooling de desarrollo: Babel/ESLint y dependencias antiguas de Drizzle. Producción tiene cero; eliminar D1/Drizzle cuando Sites confirme que no son necesarios reducirá superficie.
5. E2E usa el dev server; la build de producción sí tiene smoke tests y performance audit, pero falta un comando E2E de producción unificado. La suite actual deja 26 pruebas verdes y 10 duplicaciones móviles omitidas de forma explícita.
6. Faltan cabeceras CSP, Referrer-Policy, X-Content-Type-Options y Permissions-Policy antes de publicación abierta.

### P3 — polish

1. Validar si los status persistentes deben ser algo más discretos después de varias sesiones.
2. Agrupar pointermove de project cards con `requestAnimationFrame` si profiling real muestra trabajo innecesario.
3. Revisar el crop final de cada fotografía cuando Javier elija retratos definitivos.
4. Retirar starter assets y ejemplos que no participen en Sites.

## Conclusión

Home ya tiene una dirección visual y una partitura completas. La prioridad correcta ya no es sumar efectos por inercia, sino llevar el mismo nivel de intención a evidencia real. `Verify` se justifica porque convierte la procedencia del contenido en parte del concepto; cualquier beat futuro debe explicar una decisión, sistema, colaboración o comportamiento, no ocupar espacio visual.

El orden recomendado está en `PLAN-09-NEXT-IMPROVEMENTS.md`.
