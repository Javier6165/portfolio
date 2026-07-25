# Plan 11 — Live File WIP + Spotlight

Fecha: 25 de julio de 2026.

Estado: **plan propuesto para la siguiente implementación; todavía no implementado**.

Alcance: Home completa, incluido el hero y las previews de proyecto. Los case studies interiores quedan fuera hasta una fase posterior y continúan usando contenido ficticio.

## 1. Veredicto revisado

Plan 11 no puede limitarse a mejorar la coreografía. La landing base necesita una revisión de dirección de arte, jerarquía, copy, evidencia visual y affordances antes de diseñar su versión WIP.

### Problemas de coreografía

1. Las escenas duran entre `1,35` y `2,7 s`; cursor, selección, cambio y comentario compiten dentro de ese intervalo.
2. El estado inicial ya parece terminado. La mayor parte de los cambios son transforms, highlights o labels pequeños, no correcciones que el visitante pueda comparar.
3. Los comentarios aparecen solo en tres escenas y permanecen visibles durante una fracción del timeline.
4. Scroll rápido superior a `1.800 px/s` fuerza actualmente `settled`; el visitante ve el resultado final sin la causa.
5. El trigger depende del wrapper y de una línea de viewport, no de que el objeto editado esté suficientemente visible y estable.
6. El chrome contextual no explica qué propiedad se está modificando. El cursor actúa, pero el visitante no siempre puede leer la intención.

### Problemas de UI, UX y contenido

1. **Hero:** la composición izquierda/derecha es correcta pero demasiado previsible. Hay mucho vacío sin tensión, el título y el retrato parecen dos piezas independientes y el resultado final no deja una firma visual propia.
2. **Profile 01:** los labels y hechos laterales usan una escala demasiado pequeña. La información que debería resolverse en segundos exige acercarse y leer línea por línea.
3. **Work 02:** es la sección más sólida. Debe preservar su peso editorial, pero el arte final dependerá de screenshots y evidencia reales.
4. **Practice 03:** no queda claro si describe capacidades, workflow o outputs. El copy es largo, los artefactos abstractos no aclaran nada y las cards parecen clicables aunque no exista acción.
5. **AI 04:** comunica una promesa genérica. No responde qué herramientas usa Javier, en qué momento, para qué output, con qué límites ni qué sabe construir realmente.
6. **Playground 05:** funciona como pausa visual, pero aparece antes de cerrar la historia profesional y todavía no tiene contenido suficiente para ocupar esa prioridad.
7. **About 06:** correcto pero intercambiable; repite perfil profesional sin añadir suficiente personalidad o dirección de arte.
8. **Testimonials 07:** las cards rotadas, la comilla gigante y los efectos de “papeles” se perciben menos premium que el resto. Además, el placeholder adopta demasiado pronto la forma de una cita.
9. **Sistema global:** demasiados bloques resuelven su jerarquía con cards, bordes, labels monoespaciadas y texto pequeño. Falta contraste entre spreads editoriales, viewers de artefacto y secciones de producto.

Los roles actuales de Product Design con AI siguen pidiendo lo básico a un nivel alto: UX/UI e interaction craft, capacidad para resolver sistemas complejos, prototipos de alta fidelidad, diseño de producto AI-first y colaboración con ingeniería. Algunos ya piden explícitamente artefactos funcionales y testables más allá del mock estático. [OpenAI — Product Designer, People Innovation Labs](https://openai.com/careers/product-designer-people-innovation-labs-san-francisco/) [Apple — Product Designer](https://jobs.apple.com/en-us/details/200671845-0836/product-designer?team=DESGN)

La conclusión es doble:

```text
1. DISEÑAR UNA LANDING FINAL MUCHO MEJOR
2. DISEÑAR SU CONTRAPUNTO WIP Y LA EDICIÓN QUE LAS CONECTA
```

No se implementará Spotlight sobre la UI vigente.

## 2. Nueva tesis y orden de trabajo

> El visitante entra en un archivo abierto, ve una composición con intención aunque todavía esté incompleta y presencia la última pasada de criterio que la convierte en un portfolio excepcional.

El estado final necesita funcionar como portfolio top incluso sin ninguna animación. El WIP será una desviación deliberada de ese final, no el recurso que intente salvar una sección débil.

Orden obligatorio por sección:

```text
COPY Y PROPÓSITO → UI FINAL → WIP CONTRASTADO → EDICIÓN → SPOTLIGHT
```

La nueva gramática narrativa se mantiene:

```text
NOTICE → FOLLOW → SELECT → ADJUST → COMMENT → RESOLVE → RETURN
```

- `Notice`: la sección y su imperfección se ven antes de cualquier movimiento.
- `Follow`: Spotlight declara que el visitante está siguiendo a Javier.
- `Select`: un objeto concreto recibe frame y handles.
- `Adjust`: aparece la herramienta necesaria y cambia una propiedad visible.
- `Comment`: Javier explica criterio cuando la acción no basta por sí sola.
- `Resolve`: comentario y chrome se retiran; el nuevo diseño final permanece.
- `Return`: el scroll y la interacción vuelven exactamente al visitante.

### 2.1 Arquitectura de Home propuesta

```text
Hero / Positioning
  → 01 Snapshot
    → 02 Selected Work
      → 03 Product practice
        → 04 AI-native workflow
          → 05 About
            → 06 Testimonials
              → 07 Playground
                → 08 Contact
```

Cambios:

- Playground baja por debajo de About y Testimonials; es una capa de curiosidad después de demostrar nivel, trabajo y forma de colaborar.
- `Expertise` deja de ser una lista de capacidades y se convierte en `Product practice`, un workflow real y navegable.
- AI deja de ser una declaración genérica y se convierte en una explicación concreta de operating model, herramientas, outputs y guardrails.
- Testimonials abandona la metáfora de tarjetas de cita y adopta una composición editorial de referencia y procedencia.
- About deja de repetir los cuatro flashes de Profile y se centra en personalidad, craft y manera de trabajar.

### 2.2 Sistema visual final

La dirección mantiene el grid y los modos Dark/Light, pero eleva la variedad compositiva:

- **Editorial stage:** Hero, About y Contact pueden usar imagen, tipografía y espacio como una sola composición.
- **Evidence viewer:** Work, Product practice y AI muestran artefactos grandes y legibles, no miniaturas decorativas.
- **Reference ledger:** Testimonials usa estructura tipográfica y de procedencia, no cards flotantes.
- **Experimental shelf:** Playground se comporta como colección opcional, no como el siguiente capítulo obligatorio.

Reglas de legibilidad y affordance:

- body y copy explicativo: `16–20 px` según viewport, nunca microtexto;
- datos importantes y labels laterales: mínimo `12 px`; valores `17–22 px`;
- mono por debajo de `11 px` solo para coordenadas decorativas, nunca para información profesional;
- párrafos principales ≤`62 ch`;
- targets interactivos ≥`44 px` en touch;
- si un elemento parece tab, botón o card clicable, debe responder a click, teclado y touch;
- si no es interactivo, no recibe hover de control ni affordance falsa;
- ningún artefacto abstracto sobrevive si no explica reglas, decisiones, flujo, estado o resultado;
- reducir el número de cajas equivalentes: cada sección debe tener una silueta reconocible en un full-page scroll.

El objetivo no es hacer todas las secciones más ruidosas. Es que el hero, el trabajo, Practice, AI y Testimonials tengan una decisión formal fuerte, mientras Snapshot, About y Contact respiren.

## 3. Spotlight: contrato de experiencia

Figma Spotlight permite seguir la vista, acciones y cursor de otra persona y muestra quién se está siguiendo, un borde de presencia y un control para detenerlo. Esta implementación conserva esa relación de seguimiento, no su interfaz literal. [Figma — Present to collaborators using spotlight](https://help.figma.com/hc/en-us/articles/360040322673-Present-to-collaborators-using-spotlight)

### 3.1 Cuándo puede empezar

Una escena solo será elegible si cumple simultáneamente:

- la intro ha terminado;
- no existe otra escena activa;
- el visitante no ha desactivado `Auto-follow`;
- el target real tiene al menos `68 %` visible en un pico o `58 %` en un beat corto;
- el centro del target está dentro de la zona segura entre cabecera + `32 px` y viewport − `48 px`;
- el scroll lleva estable al menos `220 ms`;
- la sección ha permanecido legible durante su `readMs` completo;
- la pestaña está visible y la ventana tiene foco.

No se hará auto-scroll para colocar una escena. Spotlight solo empieza cuando la composición ya está bien encuadrada. Por tanto, una acción nunca se reproduce por encima o por debajo de la zona que el visitante está mirando.

### 3.2 Fast scroll

Fast scroll deja de significar “marcar terminado”. El nuevo comportamiento será:

1. mientras exista velocidad alta, no comienza ninguna escena;
2. al detenerse, se calcula el único stage dominante del viewport;
3. solo ese stage puede iniciar lectura y Spotlight;
4. las secciones atravesadas no se marcan como vistas ni se reproducen fuera de pantalla;
5. si el visitante vuelve, conservan su oportunidad de mostrar WIP → final.

No se mantiene una cola de animaciones. Nunca se reproduce una escena atrasada porque el usuario haya llegado a otra sección.

### 3.3 Captura de atención

Durante la edición:

- se conserva la posición exacta y se bloquea el desplazamiento de la página;
- un borde cobalto/coral según tema recorre el viewport;
- cuatro scrims atenúan el exterior del stage sin aplicar blur al texto seleccionado;
- una barra superior muestra avatar `JO`, `Following Javier`, el nombre de la acción y `Stop following`;
- un progreso discreto comunica la duración restante;
- la captura dura entre `2,8` y `4,9 s`; nunca es indefinida;
- al terminar se restaura scroll sin salto ni cambio de anchura.

El primer gesto de rueda/touch durante Spotlight se contiene y revela `Scroll again to stop following`. Un segundo gesto deliberado dentro de `700 ms`, `Escape`, PageDown, Space o el botón `Stop following` cancelan la escena, fijan el resultado final y ejecutan la intención de navegación. El visitante siempre conserva una salida inmediata.

No hay focus trap ni foco programático. Spotlight no es un modal. El control Stop es un botón real y la página conserva su orden de foco.

### 3.4 Entrada en Auto-follow

Al terminar el hero aparece una preferencia no bloqueante:

```text
LIVE FILE · Javier is still editing    Auto-follow on · Stop
```

No requiere aceptar para usar el portfolio. `Stop` fija todos los stages futuros en final durante la sesión. Tras consentimiento de memoria se puede recordar esta preferencia; antes de él solo vive en `sessionStorage`.

### 3.5 Accesibilidad

- `prefers-reduced-motion` y el ajuste manual eliminan Spotlight, cursor, scroll lock y estados WIP animados.
- Reduced motion y no-JS renderizan directamente la versión terminada.
- La versión semántica final existe siempre en servidor; las variantes WIP visuales son `aria-hidden` cuando duplican texto.
- El resultado final no depende de ver o completar la animación.
- Todos los movimientos automáticos pueden detenerse. W3C recomienda permitir desactivar motion no esencial y ofrecer pausa o stop a contenido automático. [WAI — Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) [WAI — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

## 4. Chrome contextual

No se construirá un editor completo. Se reutilizarán siete primitives propias que recuerdan a una herramienta de diseño sin copiar Figma:

1. `SelectionFrame`: bounds, handles, nombre de layer y medidas.
2. `PropertyStrip`: tipografía, auto-layout, color o estado; máximo tres controles legibles.
3. `AssetTray`: asset local, thumbnail y drag source.
4. `ConnectionInspector`: origen, destino y trigger para convertir falsas affordances en controles reales.
5. `WorkflowStrip`: etapa, tool, output y human check en la escena de AI.
6. `TimelineStrip`: playhead, duración y easing.
7. `CommentThread`: pin, burbuja, respuesta breve y estado resuelto.

Reglas:

- solo se muestra el chrome necesario para entender esa corrección;
- entra después de seleccionar y sale antes de devolver el control;
- nunca tapa el heading, CTA ni contenido editado;
- cada panel tiene exactamente los valores que cambian; no contiene controles falsos irrelevantes;
- Dark y Light usan la misma geometría, tipografía, timing y componentes; solo cambian tokens y retratos.

## 5. Comentarios

El límite actual de tres comentarios deja de ser válido. El nuevo límite es editorial, no numérico:

- comentario solo cuando explica criterio, integridad o intención;
- máximo uno por escena;
- aparece después de que el cambio sea visible, nunca al aterrizar;
- permanece completamente legible un mínimo de `1,3 s`;
- usa pin anclado al objeto, no una pill genérica al borde del wrapper;
- se resuelve antes de cerrar Spotlight y deja únicamente un pequeño check si aporta continuidad.

Comentarios propuestos:

| Sección | Comentario |
| --- | --- |
| Hero | `Two pixels. Much better.` |
| Snapshot | `Keep the signal. Lose the résumé.` |
| Work | `Show the decision, not the decoration.` |
| Product practice | `Show the path, not a list of skills.` |
| AI | `Tools change. The operating model matters.` |
| Testimonials | `No source, no quote.` |

Playground, About y Footer son autoexplicativos y cierran con status, no con otra burbuja.

## 6. Score sección por sección

| Acto | UI final rediseñada | Estado WIP evidente | Acción de Javier | Read + Spotlight |
| --- | --- | --- | --- | --- |
| Hero / Compose | stage editorial donde título, retrato y file chrome forman una sola composición | mal salto de titular, retrato sin colocar y jerarquía plana | recompone tipo, inserta retrato y ajusta crop | `0,5 + 5,8–6,2 s`; sin scroll lock |
| 01 Snapshot / Clarify | cuatro facts grandes y legibles, integrados en una banda editorial | facts comprimidos como un párrafo lateral ilegible | divide, aumenta escala y alinea cuatro flashes | `1,4 + 4,4 s` |
| 02 Work / Frame | cards de evidencia con screenshot dominante y metadata clara | primer caso con media vacía y asset fuera del frame | inserta screenshot, elige Fill y alinea capas | `1,6 + 4,8 s` |
| 03 Product practice / Connect | workflow interactivo de tres pasos + viewer de artefacto | lista larga de capacidades, visuals abstractos y falsas affordances | agrupa, conecta y activa el viewer real | `1,5 + 4,6 s` |
| 04 AI-native workflow / Operationalise | pipeline Frame → Explore → Build → Validate con herramientas, output y guardrail | cloud de logos y promesa genérica sin relación entre herramienta y trabajo | asigna tools a etapas y activa un prototipo funcional | `1,7 + 4,9 s` |
| 05 About / Reframe | spread fotográfico con una idea personal y copy corto | crop corta la mirada y la composición repite facts profesionales | ajusta máscara y limpia copy duplicado | `1,3 + 3,7 s` |
| 06 Testimonials / Verify | reference ledger con índice y área editorial de quote/procedencia | cards rotadas que parecen citas sin fuente | cambia variante a Reference pending y retira comillas | `1,5 + 4,6 s` |
| 07 Playground / Experiment | shelf de experimentos reales o placeholders claramente opcionales | estudio principal fuera de ritmo en `00:00` | arrastra playhead y aplica easing | `1,2 + 4,1 s` |
| 08 Contact / Hand off | cierre tipográfico directo con estado de preview honesto | archivo sigue en `Editing` y CTA no tiene señal | cambia a `Ready for review` y cede | `1,0 + 2,8 s` |

## 7. Storyboard detallado

### 7.1 Hero / Compose

El hero deja de ser “titular a la izquierda + foto a la derecha”. Se convierte en un stage editorial de viewport completo donde título, retrato y file chrome comparten el mismo grid.

UI final:

- `Javier Ortiz` actúa como firma superior, no como otro bloque de navegación;
- `Senior Product Designer` ocupa dos líneas controladas y cruza visualmente con el frame del retrato;
- el retrato interrumpe el grid sin tapar la lectura: una parte queda dentro del frame y otra rompe su borde como capa de composición;
- baseline, coordenadas y `LIVE FILE / READY` aportan precisión sin convertirse en microtexto esencial;
- `Explore` y progreso aparecen como una sola affordance clara;
- movimiento ambiental posterior mínimo: respuesta de handles o depth al puntero, sin cursor permanente ni parallax continuo.

El objetivo es una silueta reconocible incluso en una captura estática, con más tensión y menos vacío accidental.

WIP:

- chrome de archivo visible desde el primer frame;
- el titular usa un salto pobre, peso equivocado y `Senior Product Design_` dentro de una caja activa;
- placeholder de retrato con checker sutil;
- chip `portrait_dark_02` o `portrait_light_02` en la bandeja.

Edición:

1. cursor termina `Designer`;
2. `PropertyStrip` corrige peso, leading y salto de línea;
3. cursor arrastra el asset al frame;
4. el retrato aparece en Fill;
5. nudge de dos píxeles;
6. comentario y resolución;
7. chrome se retira y queda el hero profesional.

El nombre y el rol final continúan en el `<h1>` semántico desde servidor. `Skip intro`, scroll, Escape y fallo de imagen entregan el resultado final.

### 7.2 Snapshot / Clarify

UI final:

- la sección pasa de headline grande + facts minúsculos a un spread de lectura inmediata;
- una frase corta ocupa `5–6` columnas y una banda de cuatro facts ocupa el resto o toda la anchura inferior;
- labels de `12–13 px` y valores de `18–22 px`, con contraste AA;
- cada fact responde una pregunta de recruiter: nivel, experiencia, territorio y ventaja AI/code;
- no repite el timeline de About ni usa texto corrido secundario.

WIP:

- la misma información real aparece visualmente como un párrafo demasiado largo;
- labels, valores y baseline no comparten columnas y usan la escala insuficiente actual;
- layer label: `PROFILE_NOTES / DRAFT`.

Edición:

1. Javier selecciona el bloque completo;
2. `PropertyStrip` muestra `Auto layout · Vertical`, `Gap 0`, `Rows 1`;
3. activa `Split into 4` y aumenta `Text 10 → 18`;
4. los cuatro facts ocupan la geometría final con stagger legible;
5. cambia gap, alinea labels y convierte la banda en una única unidad editorial;
6. comentario `Keep the signal. Lose the résumé.`;
7. resuelve y deja `PROFILE / REFINED`.

La diferencia principal no es movimiento: es pasar de una masa de CV a cuatro señales escaneables.

### 7.3 Selected Work / Frame

UI final:

- se conserva el patrón de cards grandes porque ya crea jerarquía y acceso claro a casos;
- screenshots reales o placeholders de screenshot ocupan el foco; los CSS artifacts dejan de competir con la evidencia;
- metadata se reduce a lo que ayuda a decidir: superficie, rol, año y tipo de proof;
- el CTA y toda la card mantienen un único destino evidente;
- hover, focus y touch revelan profundidad, no información esencial escondida;
- el layout debe aceptar ratios distintos de exports de Figma, vídeo o prototipo sin rehacer la card.

WIP:

- copy y CTA del primer case son legibles;
- el área de media es un drop zone vacío con checker;
- `atlas_rule_builder_v04` espera en `AssetTray`;
- capas back/mid están visiblemente desalineadas.

Edición:

1. Javier arrastra el asset al drop zone;
2. la imagen entra inicialmente en Fit y deja espacio incorrecto;
3. aparece el panel `Image · Fit / Fill / Crop`;
4. Javier selecciona Fill y ajusta el encuadre;
5. las capas encajan detrás del frame;
6. `Open case study` pasa a ready;
7. comentario `Show the decision, not the decoration.`;
8. final `CASE 01 / LIVE`.

Las otras dos cards no repiten autoplay. Hover, foco o touch pueden mostrar su frame/asset label manualmente.

### 7.4 Product practice / Connect

Propósito: explicar cómo trabaja Javier, no volver a enumerar skills.

Copy de trabajo:

- kicker: `03 / Product practice`;
- heading: `I make the system visible before I make the interface.`;
- resumen: una frase sobre convertir reglas, actores y edge cases en decisiones que diseño e ingeniería pueden construir.

UI final:

- lado izquierdo: tres pasos reales y accionables;
- lado derecho: un viewer grande que cambia de artefacto;
- cada paso es un tab verdadero con teclado y touch;
- `Map the system`: rule map con actores, condiciones y consecuencias;
- `Frame the decision`: flow anotado con tradeoffs y estados críticos;
- `Prove the behaviour`: mini prototipo o secuencia de estados;
- cada tab muestra `Question`, `Output` y `Who it aligns`, no un párrafo largo;
- los visuals serán placeholders semánticos hasta sustituirlos por evidencia real; deben parecer diagramas o pantallas útiles, no planetas, ondas o formas abstractas.

WIP:

- las tres ideas aparecen como una lista larga de capabilities sin orden;
- los artefactos están sueltos, pequeños y sin correspondencia;
- algunas filas parecen tabs, pero todavía no están conectadas;
- layer label: `PRACTICE / UNGROUPED`.

Edición:

1. Javier selecciona títulos y artefactos;
2. `AutoLayoutStrip` reduce copy y crea tres pasos;
3. abre `PrototypeConnections` y enlaza cada paso con su output;
4. el viewer se convierte en un control real y muestra el primer artefacto;
5. comentario `Show the path, not a list of skills.`;
6. resuelve y deja `PRACTICE / CONNECTED`.

La mejora observable es pasar de una sección que parece clicable sin serlo a una explicación interactiva y clara del workflow.

### 7.5 AI-native workflow / Operationalise

Propósito: responder de manera concreta qué experiencia tiene Javier con IA y cómo cambia su trabajo.

Copy de trabajo:

- kicker: `04 / AI-native product practice`;
- heading: `How I use AI to frame, prototype and validate product decisions.`;
- resumen: IA reduce el tiempo entre pregunta y evidencia; Javier conserva criterio, restricciones, privacidad y responsabilidad.

Antes de fijar copy se confirmará la lista real y el uso exacto de Codex, Figma Make, Cursor, Claude, Lovable y cualquier otra herramienta. No se atribuirá experiencia por aparecer en el mercado o en este plan.

UI final:

- pipeline interactivo `Frame → Explore → Build → Validate`;
- cada etapa responde cuatro campos: `Task`, `Tools`, `Output`, `Human check`;
- los logos/chips son metadata secundaria, nunca el contenido principal;
- un viewer grande muestra brief estructurado, opción, prototipo y resultado de validación;
- `Build` conserva una demo funcional y ejecutable;
- un bloque corto `Where I do not delegate` cubre criterio, privacidad, decisiones y QA;
- la sección distingue uso cotidiano, experimentación y capacidad demostrada.

WIP:

- herramientas flotan como cloud de logos sin jerarquía;
- el copy se limita a una promesa genérica del tipo “AI makes me faster”;
- la preview sigue siendo un `STATIC FRAME` sin relación con los tools;
- layer label: `AI TOOLS / UNMAPPED`.

Edición:

1. Javier selecciona el cloud de herramientas;
2. `WorkflowStrip` crea las cuatro etapas;
3. arrastra cada tool al uso que corresponda —mapping pendiente de confirmación real—;
4. asigna output y human check;
5. abre `Prototype` y conecta `Build → Run simulation`;
6. ejecuta el comportamiento real y espera su resultado;
7. comentario `Tools change. The operating model matters.`;
8. devuelve el pipeline y los controles al visitante; final `AI WORKFLOW / LIVE`.

Si el visitante toca una etapa o control durante el read time, la escena automática cede y esa interacción abre el artefacto correspondiente sin cursor ficticio.

### 7.6 About / Reframe

Propósito: añadir presencia y personalidad sin repetir Snapshot ni el CV.

UI final:

- spread fotográfico con una imagen dominante y un bloque de copy breve;
- una frase personal sobre cómo Javier combina hands-on craft, pensamiento sistémico y responsabilidad de lead;
- ubicación y disponibilidad como metadata secundaria, no otro listado de facts;
- una pequeña contact sheet o detalle de imagen puede añadir dirección de arte si las fotografías disponibles lo soportan;
- CTA claro a About, donde sí vive la progresión completa.

WIP:

- el retrato está en su máscara, pero el crop corta la mirada y desequilibra el spread;
- el copy repite nivel, años y territorio ya explicados en Snapshot;
- label `IMAGE / FILL · Y 31 %`.

Edición:

1. Javier selecciona solo la máscara;
2. aparece una strip con Fill, zoom y posición Y;
3. ajusta Y y escala con dos nudges lentos;
4. selecciona el copy duplicado y lo reduce a una idea personal;
5. foto y texto recuperan equilibrio;
6. final `PORTRAIT + STORY / APPROVED`.

No hay comentario: crop, reducción de copy y resultado se explican visualmente.

### 7.7 Testimonials / Verify

Propósito: demostrar cómo se percibe trabajar con Javier sin recurrir a una estética de testimonial genérica ni inventar prueba social.

UI final:

- se retiran cards rotadas, gran comilla de fondo y composición de papeles;
- desktop usa un `Reference ledger`: índice de tres personas/perspectivas a la izquierda y área editorial de quote a la derecha;
- cada entrada es un tab real con nombre, relación, proyecto/contexto y estado de fuente;
- con contenido real, la cita activa ocupa una columna amplia con atribución y procedencia claras;
- mientras no haya fuentes, el área derecha explica qué referencia falta y no muestra comillas;
- móvil usa accordion accesible, no carrusel horizontal obligatorio.

WIP:

- tres cards rotadas utilizan comillas y jerarquía de testimonial;
- el contenido sigue siendo placeholder sin identidad, pero la forma podría sugerir citas reales;
- un pin `Source?` está pendiente.

Edición:

1. Javier abre el pin y comenta `No source, no quote.`;
2. selecciona el grupo de cards;
3. `ContentStatusPanel` muestra `Quote / Unverified`;
4. cambia component variant a `Reference / Pending`;
5. las cards se alinean como ledger y desaparecen comillas, rotaciones y sombras teatrales;
6. entra `Placeholder · source required` como status dominante;
7. el comentario se resuelve;
8. queda `REFERENCES / SOURCE PENDING`.

Cuando existan testimonios reales, la misma estructura cambia a `Reference / Verified` sin alterar la arquitectura ni fabricar transiciones.

### 7.8 Playground / Experiment

Propósito: cerrar el cuerpo de Home con curiosidad y rango, después de demostrar trabajo, proceso, AI y colaboración.

UI final:

- Playground baja a la posición 07 y se presenta como `Experimental shelf`;
- la arquitectura admite dos o tres piezas reales con thumbnail, formato y pregunta explorada;
- el estudio cinético actual puede ser la primera pieza placeholder, pero no debe fingir una colección terminada;
- cada pieza tiene Play/Replay o abre su página; ninguna tile parece interactiva sin acción;
- el copy es breve y la sección ocupa menos altura hasta existir material suficiente.

WIP:

- `MAKE / IT / REAL` está sin ritmo, con baseline y espaciado provisionales;
- timeline en `00:00`, easing `Linear` y status `Paused`;
- las futuras posiciones de experimentos están claramente rotuladas como placeholder.

Edición:

1. Javier selecciona el grupo tipográfico;
2. aparece `TimelineStrip` inferior;
3. cambia easing a `Cubic out`;
4. arrastra el playhead a `00:02`;
5. el estudio ejecuta una única composición cinética;
6. final `EXPERIMENT / PLAYED` y Replay real.

No hay comentario: la relación timeline → movimiento se entiende visualmente.

### 7.9 Footer / Hand off

UI final:

- una frase de contacto grande, una acción primaria y metadata mínima;
- no repite el chrome de cards ni añade otro bloque de explicación;
- email, LinkedIn y CV solo entran cuando Javier facilite datos definitivos;
- el estado sigue declarando `PRIVATE PREVIEW` hasta autorización de release.

WIP:

- status global `Editing`;
- contacto temporal y CTA visibles pero sin señal de entrega;
- file label `PRIVATE PREVIEW`.

Edición:

1. Javier abre el menú de estado;
2. cambia `Editing` → `Ready for review`;
3. el CTA recibe señal y el rail completa el último capítulo;
4. cursor sale del viewport;
5. queda `PREVIEW READY / YOUR TURN`.

No se usa `Ready to share` mientras falten contacto, CV, casos y testimonials reales.

## 8. Timings

El timing deja de comprimir todos los eventos en el mismo segundo.

```text
0.0–1.2/1.7  sección visible; WIP se puede comparar
0.0–0.3      Spotlight entra al terminar readMs
0.3–1.0      cursor llega y selecciona
1.0–2.4      toolbar/sidebar y ajuste principal
2.2–3.8      comentario cuando exista
3.6–4.7      resolución, status y salida
```

Reglas:

- cursor visible al menos `1,8 s` en una escena con acción;
- un cambio importante tarda al menos `650 ms` y no más de `1,4 s`;
- comentario visible completo al menos `1,3 s`;
- Spotlight máximo `4,9 s` para cualquier escena automática;
- no se combina cambio de layout, comentario y salida en el mismo instante;
- picos Work/AI duran más; About/Footer son más breves.

## 9. Móvil y touch

Móvil conserva Follow mode, pero no dibuja un ratón:

- barra `Javier is editing` y borde de Spotlight;
- halo táctil y handles;
- panels como bottom sheets de máximo `36 %` del viewport;
- drag de asset y playhead con recorrido corto;
- scroll freeze máximo `3,4 s`;
- primer segundo toque/gesto cancela Follow y devuelve el scroll;
- comments como pin + sheet breve, nunca sobre el copy.

Si el stage no cabe con el bottom sheet sin ocultar su resultado, esa escena usa una property strip superpuesta dentro del objeto, no un panel externo.

## 10. Visitas, memoria y replay

### Primera visita

- intro completa;
- Auto-follow activo, con Stop siempre visible;
- todos los actos de Home elegibles una vez;
- ninguna escena empieza fuera de viewport;
- status final permite `Replay edit` por interacción.

### Segunda visita

- intro corta;
- Work, AI y Testimonials pueden reproducirse automáticamente;
- el resto nace final y ofrece replay manual.

### Tercera y posteriores

- Home final casi inmediata;
- ninguna captura automática;
- `Replay live edit` en Experience settings reinicia WIP y Follow mode.

Sin consentimiento, tiers y Auto-follow solo persisten en la pestaña. Analytics no lee estos estados.

## 11. Arquitectura propuesta

Estados:

```ts
type LiveScenePhase =
  | "wip"
  | "eligible"
  | "observing"
  | "spotlight-entering"
  | "editing"
  | "commenting"
  | "settling"
  | "settled"
  | "interrupted"
  | "reduced";
```

Definición:

```ts
type PlannedLiveSceneVerb =
  | "clarify"
  | "frame"
  | "connect"
  | "operationalise"
  | "reframe"
  | "verify"
  | "experiment"
  | "handoff";

type LiveSceneDefinition = {
  id: string;
  verb: PlannedLiveSceneVerb;
  stageSelector: string;
  targetSelector: string;
  tool: "type" | "layout" | "asset" | "connections" | "workflow" | "prototype" | "timeline" | "crop" | "content-status" | "file-status";
  readMs: number;
  spotlightMs: number;
  minVisibility: number;
  commentId?: string;
  autoVisitTier: 1 | 2;
};
```

Componentes:

- `LiveSceneDirector`: exclusión, dominant stage, scroll stability, tiers y estados.
- `SpotlightController`: entrada/salida, scroll lock, Stop, Escape y restauración exacta.
- `SpotlightChrome`: borde, scrims, avatar, progress y acción actual.
- `EditorPrimitives`: selection, property strip, panels, tray, timeline y comments.
- un presenter co-localizado por sección para WIP y final; no un transform genérico.
- `NarrativeProvider`: memoria y preferencia de Follow, sin analytics.

`GSAP` continúa siendo el único motor. React/atributos gobiernan estado; GSAP interpola. DOM/CSS resuelve todo, sin canvas, WebGL, Lenis o XState.

El lock guardará `scrollY`, compensará el scrollbar y restaurará la posición con tolerancia de `1 px`. El estado lógico se fija antes de liberar para evitar que el usuario vea un frame WIP al continuar.

## 12. Fases de implementación

### Fase 0 — Contenido, propósito y arquitectura

- fijar la pregunta que responde cada sección y eliminar solapamientos;
- redactar copy de trabajo para Snapshot, Product practice, AI y About;
- confirmar con Javier qué herramientas de IA usa, para qué y con qué nivel de experiencia;
- definir placeholders de artefacto que representen rules, flows, prototypes y outputs reales;
- actualizar orden, navegación y rail: Playground pasa a 07.

Gate: un recruiter puede explicar quién es Javier, qué tipo de producto diseña, cómo trabaja y cómo usa IA leyendo solo el wireframe textual.

### Fase 1 — UI final estática

- rediseñar Hero, Snapshot, Product practice, AI, About, Testimonials y Playground sin narrativa WIP;
- preservar y preparar Work para screenshots reales;
- crear snapshots finales en 1440 y 390, Dark/Light;
- revisar escala tipográfica, silueta de página, contraste, densidad y affordances;
- no construir Spotlight todavía.

Gate: la Home final parece un portfolio de alto nivel con motion desactivado y cada sección tiene una función inequívoca.

### Fase 2 — Contrapartes WIP

- diseñar un defecto claro para cada nueva UI final;
- implementar snapshots `wip` y `settled` mediante query de desarrollo;
- verificar que la mejora se entiende comparando dos capturas sin cursor ni comentario;
- asegurar que WIP continúa siendo legible y no finge un error de producción.

Gate: una persona puede señalar qué estaba mal y qué se corrigió en cada sección viendo dos estados estáticos.

### Fase 3 — Infraestructura Spotlight

- estados nuevos, dominant stage y scroll stability;
- Spotlight chrome, lock/restauración, Stop y Auto-follow;
- editor primitives para strip, tray, viewer, sidebar, timeline y comment;
- reduced motion, no-JS y sesión;
- playground de desarrollo para probar interrupciones sin recorrer Home.

Gate: una escena aislada nunca empieza fuera de viewport y devuelve el scroll a ±`1 px`.

### Fase 4 — Vertical slice narrativa

- Hero, Snapshot, primer Work, Product practice y AI;
- comentarios, toolbars y artefactos funcionales;
- fast scroll, interacción temprana, Stop y tiers;
- revisión creativa antes de extender el patrón.

Gate: en 30–45 s se entiende posicionamiento, nivel, WIP, criterio y capacidad AI/code sin explicación externa.

### Fase 5 — Resto de Home

- About, Testimonials, Playground y Footer;
- status global, navegación reordenada y Replay edit;
- polish de ritmo y contraste entre picos/respiraciones;
- evitar que todas las escenas usen la misma selección o panel.

Gate: todas las secciones tienen UI final sólida, WIP/final distintos y ninguna repite exactamente la misma acción.

### Fase 6 — Mobile, accesibilidad, auditoría y publicación privada

- touch translation, bottom sheets y cancelación por gesto;
- teclado, focus, hidden tab, resize/orientation y storage bloqueado;
- visual regression WIP/final y cuatro viewports;
- auditoría creativa, UX, performance, axe y QA completa;
- actualizar ADR, arquitectura, handoff e implementation docs;
- retirar reglas/documentos superseded solo tras consolidar decisiones durables;
- publicar nueva versión privada en el proyecto Sites existente.

Gate: Follow mode aporta narrativa sin impedir completar Home y la UI base mantiene calidad alta en todos los fallbacks.

## 13. QA obligatoria

### UI, contenido y jerarquía

- hero reconocible y potente en screenshot, sin depender de intro;
- labels profesionales ≥`12 px` y body ≥`16 px` en desktop/móvil;
- Snapshot se comprende en ≤`8 s`;
- Product practice se entiende como workflow y sus tres controles son reales;
- AI identifica herramienta, tarea, output y human check sin convertir la sección en logo wall;
- Playground aparece después de About y Testimonials;
- Testimonials placeholder no parece una cita real;
- ningún visual abstracto permanece si no ayuda a explicar el contenido;
- ningún elemento parece clicable sin serlo;
- cada sección tiene una silueta distinta dentro de la misma dirección de arte.

### Narrativa

- WIP reconocible antes de cursor;
- cambio principal visible en capturas before/after;
- comentario posterior al cambio y legible ≥`1,3 s`;
- una acción y una herramienta específica por sección;
- Spotlight no comienza con target fuera de safe zone.

### Scroll

- slow scroll, fast scroll, trackpad, wheel, touch flick, anchor link y scroll inverso;
- una sola escena dominante, sin cola;
- Stop/Escape/segundo gesto cancelan;
- scroll restaurado ±`1 px` y sin salto lateral;
- hidden tab, blur, resize y orientación liberan cualquier lock.

### Accesibilidad

- reduced motion y ajuste manual sin WIP animado ni lock;
- no-JS final completo;
- teclado puede abandonar Follow y continuar;
- sin focus trap, pérdida de foco o cambio programático de sección;
- axe y contraste Dark/Light.

### Visual y rendimiento

- baselines separados `wip`, `editing` y `settled` para cada acto principal;
- 1440×900, 1280×800, 768×1024 y 390×844;
- Dark/Light con geometría exacta;
- CLS ≤`0,03` en Home y sin overflow;
- Spotlight responde en el siguiente frame y no añade canvas/WebGL.

## 14. Decisiones que esta fase sustituirá al implementarse

El plan requiere actualizar formalmente los ADR solo cuando el código esté validado:

- ADR-006: scroll seguirá siendo nativo fuera de Spotlight, pero existirá una captura temporal, acotada y cancelable.
- ADR-016: deja de limitar comments prominentes a tres; el límite pasa a ser uno justificado por escena.
- ADR-017: fast-scroll ya no fija automáticamente `settled`; difiere la escena hasta que exista stage dominante y scroll estable.
- la partitura cambia `Expertise / Propagate` por `Product practice / Connect`, `AI / Activate` por `AI-native workflow / Operationalise` y mueve Playground después de Testimonials.
- los timings actuales `450–750 ms` + `1,35–2,7 s` se sustituyen por read time `1–1,7 s` y Spotlight `2,8–4,9 s`.
- `idle` deja de ser visualmente final: en primera visita representa un WIP intencional y accesible.

Hasta completar la implementación, `NARRATIVE-07` e `IMPLEMENTATION-08` siguen describiendo el comportamiento publicado.

## 15. Fuera de alcance

- contenido real de case studies;
- coreografía dentro de `/work/[slug]`;
- clon completo de Figma o toolbar permanente;
- colaboración real, red o cursores múltiples;
- scroll timeline global, snap o pinning entre secciones;
- estados WIP que oculten información esencial;
- animación automática en tercera visita;
- publicación pública, indexación o cambio de hosting.

La medida de éxito no será el número de efectos. Será que el visitante pueda explicar, después de Home: “Entré en un archivo sin terminar, seguí a Javier mientras corregía decisiones concretas y terminé viendo un portfolio entregado.”
