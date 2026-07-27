# Audit 11 — Live WIP + Spotlight

Fecha: 25 de julio de 2026.

Estado: **auditoría post-implementación completada**.

Addendum 27 de julio de 2026: corregido un fallo exclusivo del navegador publicado que cerraba Spotlight al recibir el `resize` generado por su propio scroll lock. También se eliminó la supresión persistente de escenas, se añadió Replay al dock y se sustituyó la intro familiar comprimida por entrega inmediata del hero.

Addendum conceptual 27 de julio de 2026: una auditoría como visitante nuevo demostró que la metáfora se percibía como estética pero no como contrato. El comentario del hero llegaba tarde, el dock no explicaba el siguiente evento y, a 1280×720, comment/property panel podían quedar bajo el viewport. Se implementó un prólogo integrado, read times más lentos, WIP con edición pendiente y chrome contextual fijo con colocación segura.

Addendum visual 27 de julio de 2026: Light se retiró porque duplicaba sistema, recursos y QA sin aportar una segunda dirección suficientemente valiosa. La auditoría vigente cubre exclusivamente Dark; el selector, estado, overrides y retratos Light fueron eliminados.

Addendum Plan 12: el prólogo integrado y las salidas fáciles seguían comprimiendo o suprimiendo la historia. La primera visita usa ahora loading explícito, intro de ~13,5 s y ocho escenas obligatorias con lectura bloqueada, reencuadre secuencial y tiempos duplicados. Las salidas se reservan a visitas recurrentes consentidas. QA y riesgo deliberado se documentan en `PLAN-12-GUIDED-FIRST-PASS.md`.

Addendum de continuidad 27 de julio de 2026: se corrigió un lock residual después de la apertura. El estilo `overflow` sí se restauraba, pero los listeners de rueda, touch y teclado de la intro seguían montados e interceptaban gestos. Ahora quedan inertes al entregar el hero y la matriz prueba desplazamiento real tras la intro y tras el primer Spotlight.

## Veredicto

La Home ya comunica el concepto de archivo vivo después del hero y la UI base ha subido de nivel de forma material. Snapshot es escaneable, Product practice y AI explican trabajo real, References deja de parecer una cita falsa y cada capítulo tiene WIP, acción y resultado final reconocibles.

Spotlight cumple su función: espera a que el usuario haya aterrizado, fija únicamente el target visible, explica la acción, conserva una salida inmediata y devuelve la misma posición. No existe reproducción fuera de viewport ni cola cuando se hace fast-scroll.

## Hallazgos corregidos durante la auditoría

1. **Skip temprano en móvil:** el custom property de reveal y la opacidad del último término podían quedarse en el estado inicial. `finish()` fija ahora el hero final explícitamente.
2. **Cue móvil fuera del viewport:** `Explore` pasa a posición absoluta dentro del frame y convive con el status de archivo.
3. **Focus de pointer confundido con selección:** el skip solo mueve foco al heading cuando se activa por teclado.
4. **ARIA en References:** `article[role=tabpanel]` no era una combinación permitida por axe; el panel usa ahora un `div` semántico con el mismo contrato de tabpanel.
5. **Overflow móvil:** el contenido de un `details` cerrado contribuía al ancho y el viewer WIP se desplazaba demasiado. El menú cerrado se elimina del layout, el abierto es fixed y el offset WIP móvil se contiene.
6. **Reveals en conflicto:** Home seguía cargando reveals genéricos de ScrollTrigger. Se han retirado de Home y se cargan dinámicamente solo en rutas secundarias.
7. **Preferencia incompleta:** `Forget this device` no limpiaba Auto-follow. Ahora restaura la experiencia completa de primera visita.
8. **Naming:** navegación y rail convergen en `References`; `Testimonials` queda como nombre de dominio del componente y como concepto futuro, no como etiqueta engañosa.
9. **Premisa:** `Hey — you caught me making the final pass` aparece antes de la primera acción y explica que las ediciones continúan al hacer scroll.
10. **Paneles recortados:** properties y comments pasan al overlay de Spotlight, con geometría comprobada dentro del viewport.
11. **Dock:** se desplaza a la zona libre superior del hero, se pliega al primer scroll y evita tapar cards/facts durante la lectura.
12. **Consentimiento:** deja de competir con Snapshot y no puede introducir un layout shift durante un clic.

## UI/UX por sección

- **Hero:** firma visual clara, sin copy adicional; desktop y móvil muestran nombre, rol, retrato y cue.
- **Snapshot:** cuatro flashes se leen sin acercarse; WIP es inequívocamente peor.
- **Work:** la arquitectura soporta evidencia real; el arte actual sigue siendo placeholder y no debe confundirse con un screenshot.
- **Product practice:** resuelve la ambigüedad anterior entre skills y workflow; todos los controles responden a click y teclado.
- **AI:** explica tools, tareas, outputs, guardrails y capacidad de construir comportamiento.
- **About:** aporta personalidad y dirección de arte sin repetir el CV.
- **References:** composición premium, procedencia visible y contrato de integridad.
- **Playground:** ya no interrumpe la historia profesional; conserva Replay.
- **Contact:** cierre coherente con Live File y con el estado privado.

## Accesibilidad y resiliencia

- axe limpio en Home Dark y Northstar;
- navegación por teclado y roving focus cubiertos;
- touch sin cursor de ratón;
- reduced motion y no-JS muestran el producto final;
- scroll lock solo existe durante Spotlight y se puede cancelar;
- contenido esencial nunca vive en comments, handles o panels del editor;
- la apariencia Dark mantiene contraste, reflow y geometría por prueba automatizada.

## Rendimiento

El build no contiene Three/R3F ni chunks superiores a 500 KB; el chunk cliente mayor queda por debajo de 190 KB y ScrollTrigger queda como chunk dinámico de rutas secundarias. GSAP/MotionPath continúan siendo coste deliberado de la firma. La auditoría local registra CLS `0,0144` desktop / `0` móvil y `scrollWidth === clientWidth` en ambos. El gate definitivo de LCP/INP debe repetirse sobre el build privado y nuevamente con imágenes de casos reales.

La ejecución final detecta 40 combinaciones Playwright: 23 pruebas ejecutadas y 17 omisiones intencionales de contratos duplicados por proyecto móvil. Todas las pruebas aplicables pasan.

## Riesgos que permanecen

1. Ocho intervenciones son el máximo razonable. Añadir más cues en Home degradaría el ritmo.
2. El valor de Work depende de evidencia real; una UI excelente no sustituye decisiones, rol y outcomes verificables.
3. Spotlight debe probarse en Safari/iOS y dispositivo físico antes de publicación abierta.
4. References sin contenido real no debe publicarse como prueba social.
5. La Home es larga; con casos reales debe revisarse densidad antes de añadir más secciones.

## Siguiente plan recomendado

1. Sustituir un único caso ficticio por un case study real representativo usando `CaseBlock`.
2. Introducir screenshots de Figma, before/after, vídeo o prototipo click-to-load con captions y alt.
3. Reescribir el copy alrededor de decisiones reales, contribución de Javier y evidencia permitida.
4. Recibir testimonials verificados o retirar References de la versión pública.
5. Añadir contacto, LinkedIn y CV definitivos.
6. Ejecutar QA Safari/Firefox/dispositivos, Lighthouse/CWV y revisión de confidencialidad.
7. Solo después decidir Netlify/dominio/indexación con autorización de Javier.
