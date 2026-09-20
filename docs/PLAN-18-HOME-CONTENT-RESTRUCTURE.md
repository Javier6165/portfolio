# Plan 18 — Home centrada en evidencia profesional

> **Actualización visual 20-09-2026:** el contenido y el orden de este plan siguen vigentes; la instrucción histórica de conservar Dark fue sustituida por el sistema light estático del [Plan 19](PLAN-19-STATIC-HOME-DESIGN-SYSTEM.md).

Fecha: 19 de septiembre de 2026. Fuente: plan de contenido aprobado por Javier y entregado en esta tarea.

## Decisión vigente

La Home se dirige a oportunidades de **Senior Product Designer hands-on**, con experiencia real de Lead como diferenciador, no como título objetivo. La secuencia es Hero → Profile Snapshot → Selected Work → About → Proof from People → Lab → How I Work → Contact. Cada sección responde a una pregunta distinta de contratación.

La intro Figma, Director, Follow, memoria narrativa y las microediciones están desactivados en la experiencia por defecto. Su código permanece en `app/components/live-file/` para que Javier pueda decidir más adelante si rescata una parte; no debe reactivarse sin nueva decisión. La Home abre directamente, permite scroll nativo y no persiste datos narrativos.

El sprint actual es de contenido y navegación. Se conserva la dirección Dark y la composición visual existente en lo posible. No se ha hecho todavía una revisión estética integral.

## Contenido implementado

- Hero con nombre, Senior Product Designer, posicionamiento aprobado y dos acciones; el vídeo se abre como experiencia opcional desde el Hero, sin fingir que ya existe un vídeo reproducible.
- Snapshot de cuatro datos: experiencia, progresión, ámbito de producto y AI + coded prototypes.
- Selected Work prioriza LogicX y Backoffice Design System como candidatos reales. El tercer proyecto queda por seleccionar. No se atribuyen métricas, resultados o alcance de responsabilidad no documentados y no se enlazan los casos ficticios Atlas, Northstar y Pulse desde la Home.
- About breve con la trayectoria aprobada y enlace a la página completa.
- Tres extractos y atribuciones aportados por Javier, descritos como recomendaciones de LinkedIn. No se han añadido enlaces individuales sin URLs fuente.
- Lab muestra una preview explícita de su formato editorial: pregunta → prototipo → aprendizaje. No presenta proyectos inventados ni el antiguo estudio de easing como evidencia. Espera 1–4 experimentos reales.
- Cinco preguntas de How I Work con respuestas aprobadas, en acordeones HTML nativos.
- Contact establece disponibilidad para Senior Product Designer y enlaza el perfil de LinkedIn. Email y CV esperan datos finales.

## Material pendiente antes de considerar esta Home final

1. Revisar los proyectos LogicX y Backoffice Design System: problema, contribución concreta, artefactos publicables, permisos de confidencialidad, impacto y enlaces a casos. Elegir el tercer caso complementario.
2. Aportar el vídeo de 60 segundos, miniatura definitiva, subtítulos y transcripción; hasta entonces el modal comunica claramente que no hay reproducción.
3. Seleccionar de uno a cuatro experimentos reales del Lab y describir qué se probó y aprendió.
4. Confirmar los enlaces directos de las tres recomendaciones de LinkedIn y autorización de publicación, además del email profesional y CV descargable.
5. Revisar la página About y las rutas de casos ficticios por separado. Siguen existentes pero fuera de la navegación principal y no son prueba profesional de la Home.

El preview continúa en `noindex, nofollow`. La publicación debe reutilizar el proyecto Sites existente y mantener este bloqueo de indexación.

La imagen social anterior llevaba el texto `Live File / Portfolio`; se ha retirado de los metadatos hasta definir una nueva tarjeta social en la futura pasada visual. El archivo original sigue intacto en `public/`.
