# Plan 20 — Intro de estudio y presencia ambiental

Estado: prototipo local del 23 de septiembre de 2026. No sustituye el sistema visual light del Plan 19 ni el contenido y orden del Plan 18. No se considera publicado hasta una autorización específica de Javier.

## Decisión

Se rescata la apertura «me has pillado trabajando» como gesto breve y opcional: en una recreación de Figma UI3, Javier coloca el retrato en el frame, escribe `Oh—sorry. You caught me working. One second.` y activa Present. Después se ve una única edición del titular (`Senior Product Designer` → `Lead Product Designer` → posicionamiento final). El portfolio semántico final existe siempre en el servidor y es visible sin JavaScript o con reduced motion.

La capa posterior ya no es una visita guiada. No hay Follow, Spotlight, captura de scroll, cámara automática ni secuencia obligatoria de secciones. Un único cursor violeta `Javier`, con el mismo SVG y Cursor Chat del sistema anterior, recorre objetivos de la página en coordenadas del documento y realiza pequeños ajustes puramente visuales. Puede salir del viewport; el visitante no tiene que esperarlo. Es una presencia de fondo, no el contenido principal.

El Director observa solo la sección central y el tiempo de pausa dentro de la pestaña. Después de una pausa clara puede acercarse y escribir una aclaración contextual, máximo dos por sesión y con enfriamiento. Los textos provisionales se editan en `app/components/studio/directorCopy.ts`; no se usa IA remota, analytics, cookies ni persistencia de comportamiento. El guion de comentarios y microajustes queda deliberadamente abierto para una revisión al final del proyecto.

## Compatibilidad con el motion futuro

La futura coreografía de entrada/reconstrucción de la web será la propietaria de sus elementos mientras se ejecute. Debe establecer `document.documentElement.dataset.siteEntrance = "active"` antes de comenzar y eliminar el atributo al terminar o al abortar. `StudioPresence` se oculta y pausa sus tweens durante ese intervalo; después reanuda la agenda ambiental. La intro Figma y la transición de Present preceden a esa futura entrada. Ningún efecto de entrada debe depender del cursor para ser comprensible.

## Límites y QA

- Intro solo en desktop con puntero fino, primera visita de la pestaña; `Skip intro` visible. `?studio=reset` fuerza la intro para QA y `?studio=off` la omite.
- `sessionStorage` recuerda únicamente si la intro se vio en esa pestaña. No se persisten dwell, scroll, puntero ni sección visitada.
- Touch, viewport de hasta 900 px y reduced motion muestran la Home terminada sin intro ni cursor.
- Todo overlay es decorativo y `pointer-events: none` salvo Skip. No toca copy, evidencia, enlaces ni orden.
- Fallos del motor de presencia deben retirar solo la capa decorativa. El scroll nativo y el contenido permanecen disponibles.
- Tests: lint, build/unit y Playwright desktop/móvil/reduced/scroll/suspensión. Playwright CLI oficial `@playwright/cli` es dependencia de desarrollo local; `npx playwright-cli --help` verifica la instalación.
