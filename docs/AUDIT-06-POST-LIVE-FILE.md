# Auditoría 06 — Estado posterior a Live File

Fecha: 25 de julio de 2026.

## Resumen ejecutivo

La primera implementación valida la dirección creativa del hero. `Live File` ofrece allí una firma reconocible, System y Human se sienten como identidades distintas y la base semántica, responsive y de privacidad es mucho más sólida que la versión anterior.

La idea, sin embargo, todavía no es transversal. Fuera del hero existen tres overlays programados, pero no una presencia perceptible y consistente de Live File. En un recorrido normal es razonable no ver ninguno; uno de ellos ni siquiera puede activarse con la geometría actual. Por tanto, el concepto está aprobado como dirección, no completado como sistema narrativo.

No hace falta sustituirlo. Sí hace falta una fase de estabilización y extensión antes de introducir proyectos reales. Cinco contradicciones afectan directamente a la experiencia:

1. Live File se percibe únicamente en el hero;
2. el nombre del cursor ficticio es ilegible por un error de `currentColor`;
3. la preferencia de memoria aparece justo después del hero y tapa su payoff, especialmente en móvil;
4. la expansión automática del frame produce un CLS de `0,113` en desktop y `0,143` en móvil, por encima del objetivo `≤0,1`;
5. los dos retratos del hero se descargan simultáneamente con prioridad alta, casi `950 KB` solo en JPEG.

Además, el trabajo empieza demasiado tarde para una lectura de recruiter: aproximadamente a `2,5` viewports en desktop y `3` en móvil. La home completa mide alrededor de `9.600–10.400 px` antes de incorporar contenido real.

## Alcance y método

Se revisaron:

- versión privada 9 de Sites y sus errores recientes;
- Home, About, Playground, los tres casos y 404;
- primera visita, reduced motion, no-JS, fallo de imagen y memoria 1/2/3;
- System y Human en `1440×900`, `1280×800`, `768×1024` y `390×844`;
- teclado, tabs, navegación móvil, almacenamiento bloqueado y estados de foco;
- HTML semántico, metadata, robots, privacidad y click-to-load;
- build, chunks, imágenes, CSS, arquitectura React y dependencias;
- pruebas existentes y cobertura que todavía falta.

Las mediciones de carga se ejecutaron sobre la build de producción local para eliminar variabilidad de red. Son útiles para comparar versiones, pero no sustituyen Lighthouse sobre la URL final ni datos de campo.

## Lo que funciona bien

### Producto y narrativa

- El editor ficticio se reconoce sin copiar una herramienta existente.
- La intro contiene una secuencia entendible: titular, retrato, refinamiento y expansión.
- El hero final es profesional y claro en ambos temas.
- Human no es una inversión clara de System: cambia tipografía, fotografía, paleta y composición.
- La segunda sección explica trayectoria, GiG, territorio de producto e IA + prototipos.
- Los casos ficticios están rotulados con claridad y no presentan sus métricas como resultados reales.

### UX, accesibilidad y resiliencia

- Nombre, heading, navegación y CTAs existen sin JavaScript.
- `Skip intro`, `Escape`, `PageDown`, scroll y touch permiten continuar.
- Reduced motion resuelve directamente al portfolio terminado.
- Skip link, foco visible, landmarks, un `h1` por ruta y tabs con roving focus están presentes.
- Axe no detecta violaciones automáticas en Home ni Northstar en desktop o móvil.
- No existe overflow horizontal en la matriz responsive probada.
- Fallo del retrato, storage opcional y embeds no cargados tienen una estrategia de fallback.

### Técnica y operación

- Lint, build y tres pruebas SSR pasan.
- Playwright: `14` pruebas pasan y `8` duplicaciones móviles se omiten intencionalmente.
- El proyecto privado está activo, limitado a un usuario y sin grupos.
- No se encontraron errores de Worker en las últimas 24 horas.
- `noindex, nofollow` y `robots.txt` mantienen el preview fuera de buscadores.
- Three/R3F ya no forman parte del bundle.
- El mayor chunk propio dejó de ser un bloque WebGL de ~866 KB.

## Hallazgos priorizados

### P0 — resolver antes de ampliar contenido

#### 1. Live File es, en la práctica, un concepto limitado al hero

La implementación declara tres cues posteriores, pero no consigue que el lenguaje del editor condicione la experiencia completa:

- `trajectory` solo se activa después de permanecer aproximadamente `2,4 s` sin scroll sobre el bloque;
- `work` no puede activarse: el observer exige `intersectionRatio ≥0,48`, pero el wrapper de tres cards es más alto que el viewport y nunca alcanza ese ratio;
- `prototype` puede activarse tras una espera similar si el cooldown y el scroll lo permiten;
- los cues son overlays temporales de bounds/cursor/comentario; al desaparecer, la sección vuelve a ser una landing convencional;
- no hay continuidad visible en case studies, About, Playground o footer.

Esto explica que Javier haya visto Live File únicamente en el hero aunque los componentes existan en el código. No es un problema de gusto o atención: la activación de Work es matemáticamente imposible y las otras dependen de un patrón de lectura poco natural.

**Recomendación:** diseñar tres manifestaciones transversales, deterministas y distintas entre sí:

1. trayectoria como selección/refinamiento visible ligada al cambio de etapa;
2. Selected Work como frames que se convierten en cards o evidencia, anclados por card y no al listado completo;
3. AI/coded prototypes como transición directa de pantalla a comportamiento tras una interacción real.

Los case studies podrán extender la gramática con anotaciones, before/after y token propagation. No se trata de añadir cursores a todas las secciones: cada intervención debe modificar o demostrar algo, y ser visible en el recorrido normal.

**Gate:** en una revisión no guiada de 60 segundos se perciben al menos dos manifestaciones de Live File además del hero; ningún trigger requiere esperar quieto dos segundos ni depende de un ratio imposible.

#### 2. La transición final incumple el objetivo de CLS

Resultados automáticos sin interacción:

| Variante | CLS |
| --- | ---: |
| Desktop `1440×900` | `0,113` |
| Móvil `390×844` | `0,143` |
| Desktop reduced motion | `0,012` |
| Móvil reduced motion | `0,000` |

La fuente principal es el cambio real de geometría de `.frame` cuando Flip pasa del marco editor al viewport. Aunque Flip compensa visualmente con transform, el navegador registra el cambio de layout.

**Recomendación:** mantener el hero semántico en su geometría final desde el primer frame y representar el editor mediante una capa o un transform visual. La expansión debe terminar en `transform: none` sin cambiar el layout medido.

**Gate:** CLS local `≤0,05` en intro automática desktop y móvil; objetivo público `≤0,1`.

#### 3. Cursor y cues pierden la firma narrativa

`.cursor > span` usa `background: currentColor` y después `color: #fff`. El `currentColor` efectivo del fondo también acaba siendo blanco, por lo que `Javier` queda blanco sobre blanco. El mismo patrón existe en `EditorIntro` y `NarrativeCue`.

Visualmente aparece una pastilla blanca vacía junto a una flecha azul. Es un bug pequeño de código, pero afecta al elemento que da sentido a la metáfora.

**Gate:** nombre legible en System/Human, desktop y todos los cues; test visual específico durante la intro.

#### 4. El consentimiento interrumpe el payoff

La preferencia de memoria aparece inmediatamente al completar o saltar la intro. En desktop tapa la parte baja del hero y acompaña al visitante durante varias secciones. En móvil ocupa cerca de un cuarto del viewport y cubre el retrato.

No bloquea el foco, pero se percibe como un banner de cookies y contradice el requisito “explícito y discreto”. También contamina todas las capturas de la matriz visual.

**Recomendación:** no mostrarla sobre el primer viewport. Activarla después de que el usuario abandone el hero o convertirla en una preferencia compacta dentro de la segunda sección/footer, sin `position: fixed` permanente.

**Gate:** el hero completo puede contemplarse sin overlays; Allow y No thanks siguen siendo equivalentes, accesibles y no preseleccionados.

#### 5. Dependencias con avisos de seguridad actuales

`npm audit` informa de `18` avisos: `13` high, `4` moderate y `1` low; no hay críticos. Separando el paquete de producción aparecen `3` high asociados a Next/PostCSS/Sharp.

Actualizaciones directas indicadas por el registro:

- Next `16.2.6 → 16.2.11`;
- `react-server-dom-webpack 19.2.6 → 19.2.8`;
- Cloudflare Vite plugin `1.37.1 → 1.47.0`;
- Vite `8.0.13 → 8.1.5`;
- revisar Wrangler y el árbol que hereda Miniflare tras esas actualizaciones.

Varias vulnerabilidades afectan a dev servers, Server Actions o capacidades que este portfolio no usa, pero las actualizaciones patch/minor siguen siendo necesarias antes de publicación abierta.

**Gate:** cero avisos high de producción o excepción documentada con superficie no alcanzable.

### P1 — alto impacto en recruiter y calidad percibida

#### 6. El hero descarga ambos retratos con prioridad alta

Carga inicial observada en producción local: ~`1,63 MB` de cuerpos de recursos. Los mayores assets son:

- `hero-human.jpg`: `481 KB`;
- `hero-system.jpg`: `468 KB`.

Ambos usan `fetchPriority="high"`, aunque solo uno es visible. Una conversión en memoria con calidad razonable produjo referencias aproximadas de `78–85 KB` en WebP y `32–34 KB` en AVIF por hero; la calidad debe validarse visualmente antes de sustituirlos.

**Recomendación:** AVIF/WebP con fallback, `srcset/sizes`, prioridad alta solo para el tema activo y precarga diferida del alternativo.

**Gate:** imágenes iniciales del hero `≤200 KB` combinadas en una primera visita y sin flash al cambiar de tema.

#### 7. La secuencia es clara, pero demasiado larga para la promesa de comprensión inmediata

La primera secuencia termina alrededor de `5,5 s`. Durante el primer tramo `Designer` no es visible y el retrato aparece después. El contenido semántico existe, pero la lectura visual del rol completo no está presente desde el primer frame.

**Recomendación:** comprimir la coreografía a `3,8–4,3 s` o mantener `Designer` como forma tenue/outline antes de revelarlo. El efecto se conserva, pero el recruiter entiende el rol inmediatamente.

#### 8. Selected Work aparece demasiado tarde

Posición aproximada de las secciones con reduced motion:

| Sección | Desktop | Móvil |
| --- | ---: | ---: |
| Profile | `900 px` | `844 px` |
| Selected Work | `2.283 px` | `2.574 px` |
| Approach | `5.144 px` | `5.473 px` |
| AI practice | `6.472 px` | `7.197 px` |
| Footer/contact | `9.078 px` | `9.783 px` |

La segunda sección combina resumen profesional y un timeline interactivo de gran altura. La información es útil, pero retrasa los casos.

**Recomendación:** conservar en la segunda sección los cuatro flashes profesionales y mover el timeline completo después de Selected Work o a About. Objetivo: que el primer caso empiece antes de `1,8` viewports desktop y `2,2` móvil.

#### 9. El menú móvil no se cierra al navegar por anclas de Home

El menú usa `<details>`. Al pulsar `Work` o `Approach` dentro de la misma ruta, cambia el hash pero `open` permanece activo y el menú sigue cubriendo el destino.

**Gate:** cerrar tras cualquier enlace, con Escape y al cambiar de ruta; devolver foco de forma predecible.

#### 10. Hay controles visuales que no hacen nada

- `Review` en AI Practice;
- `Review`, `Open` y `Continue` en token propagation.

Son botones reales y entran en la navegación por teclado, pero no tienen comportamiento. Esto reduce credibilidad precisamente en bloques que prometen “behaviour proves it”.

**Recomendación:** convertirlos en etiquetas no interactivas o implementar una respuesta observable con estado, feedback y teclado.

#### 11. La ausencia de contacto y trabajo real sigue siendo el mayor límite de conversión

La arquitectura ya soporta evidencia, pero un recruiter todavía no puede:

- contactar directamente;
- abrir LinkedIn o CV;
- validar una historia real de producto, rol, decisiones y outcomes.

Esto depende de contenido de Javier y no debe resolverse con datos inventados.

### P2 — robustez, accesibilidad y mantenimiento

- El selector System/Human no expone estado con `aria-pressed` ni anuncia el modo actual; en móvil su label visual desaparece.
- `ThemeToggle` no captura errores de `localStorage`; el tema cambia, pero genera un `pageerror` cuando el navegador bloquea persistencia.
- El `h1` contiene dos spans sin whitespace textual y `textContent` resulta `Senior ProductDesigner`; el nombre accesible sí es correcto, pero copy/paste y herramientas de extracción no.
- `NarrativeCue` reintenta cada dos segundos mientras una sección visible no puede activar el cue, incluso si reduced motion, límite o memoria impiden que llegue a mostrarse.
- Los tests no verifican cues, Replay/Forget, rechazo de memoria, storage bloqueado, cierre del menú móvil, estado del tema, botones simulados ni click-to-load.
- La “matriz visual” genera capturas, pero no tiene baselines `toHaveScreenshot`; no detecta regresiones automáticamente.
- E2E usa servidor de desarrollo, no la build de producción.
- `CaseEvidence` es completamente cliente aunque texto, imagen y galería podrían ser server components.
- `globals.css` aporta ~`65 KB` crudos a todas las rutas; aún mezcla Home, casos, About y Playground.
- ScrollTrigger/MotionController aporta ~`18 KB` gzip para reveals que podrían resolverse con una primitive más ligera o cargarse después del hero.
- Faltan cabeceras explícitas de seguridad en la build local: CSP, `Referrer-Policy`, `X-Content-Type-Options` y `Permissions-Policy`. Deben definirse antes de publicación abierta y probarse con los embeds.

### P3 — limpieza y polish

- Tailwind/PostCSS, Drizzle, ejemplos D1 y auth helper provienen del starter pero no participan en el portfolio.
- `public/file.svg`, `globe.svg`, `window.svg` y `og.png` son assets históricos sin uso.
- La función `Portrait` conserva una variante `profile` que no se renderiza.
- El 404 devuelve correctamente HTTP 404, pero mantiene el title general.
- El seguimiento del cursor en project cards actualiza custom properties en cada `pointermove` sin agrupar en `requestAnimationFrame`.
- Falta QA explícita en Safari, Firefox y dispositivos táctiles reales.

## Cobertura real de los criterios originales

| Criterio | Estado |
| --- | --- |
| Nombre y rol desde el primer frame | Semántico sí; visualmente parcial hasta la revelación |
| Intro completa `≤6,5 s` | Cumple |
| Recurrente `≤2 s` | Cumple en tests |
| Sin contenido bloqueado por motion | Cumple |
| No-JS usable | Cumple |
| Reduced motion | Cumple |
| LCP `≤2,5 s` | Local holgado; pendiente URL/field data |
| INP `≤200 ms` | Sin evidencia de campo; pendiente medición |
| CLS `≤0,1` | No cumple durante intro automática |
| JS inicial menor que Living Fold | Cumple claramente |
| Matriz responsive | Capturada y revisada; no es regresión automática |
| Memoria consentida | Cumple, pero el prompt es demasiado intrusivo |
| Casos ficticios rotulados | Cumple |

## Conclusión

La fase no ha fallado: ha convertido una dirección aislada en un hero creativo viable. Todavía no la ha convertido en el sistema transversal que prometía el plan. El siguiente ciclo debe ser de **estabilización, extensión narrativa y edición**, no de acumular overlays. Primero hay que proteger el payoff, corregir el cursor, eliminar el CLS, optimizar retratos y hacer que Live File reaparezca de forma evidente y útil en trayectoria, trabajo y AI/prototipos. Después tendrá sentido insertar el primer caso real y ampliar la narrativa con evidencia auténtica.

El orden ejecutable y sus gates están en `PLAN-06-IMPROVEMENTS.md`. La partitura creativa sección por sección está cerrada en `NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`.
