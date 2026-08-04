# Plan 17 — Director: sistema de voz y comentario contextual

Estado: **aprobado, implementado y validado el 4 de agosto de 2026**.

## Objetivo

Convertir el comentario de Director en una capa con suficiente criterio, variedad y continuidad como para parecer una inteligencia local que interpreta la sesión, sin conectar IA generativa, analytics ni seguimiento remoto.

El cursor conserva agenda propia y sigue trabajando aunque no hable. El sistema de comentario es una segunda capa: aparece cuando existe algo relevante que reconocer, explicar o rematar, no cada vez que el cursor se mueve.

Este plan no añade nuevas funcionalidades del portfolio, nuevas secciones, más animaciones ni otra coreografía obligatoria.

## Resultado entregado

- Catálogo modular de **220 líneas atómicas** con ids estables y metadatos editoriales.
- Copy específico concentrado en `director-copy/sections.ts`; copy general independiente del contenido en `generic.ts`; sesión, memoria, comportamiento y acciones en `context.ts`.
- Apertura y resolución se seleccionan como una sola unidad; editar una frase no exige tocar el motor ni cambiar su id.
- Selector puro con compatibilidad, scoring, rotación consentida, fatiga de familia/registro y guard de humor.
- Presupuesto adaptativo de 2–7 comentarios, cooldown estándar de `18 s` y respuestas directas para memoria o salida de Follow.
- Señales efímeras de visita, etapa, ritmo, dirección, revisita, final, vuelta de pestaña y Follow; no se persiste ninguna de ellas.
- Harness de QA con semilla, reloj acelerado y trigger forzado, más tests unitarios y E2E del catálogo, typing, privacidad, retorno y Follow.
- Auditoría Impeccable aplicada: cursor ambiental más calmado, nota más legible, hero con un único foco visual y placement medido contra la zona segura.

## Auditoría del sistema anterior

La base es válida, pero el límite actual no es solo de volumen:

- existen **151 líneas**: 82 aperturas/resoluciones para nueve beats de sección y 69 variantes repartidas entre trece disparadores contextuales;
- cada beat conoce únicamente un `id`, un target, un modo y dos listas de strings;
- apertura y resolución se eligen por separado, por lo que pueden pertenecer a registros distintos y no formar una conversación natural;
- el selector rota variantes no vistas, pero no entiende intención, grado de humor, familiaridad, sección compatible, rareza ni fatiga;
- `patient-reader` puede terminar anclado a cualquier sección aunque parte de su copy hable específicamente de evidencia;
- todos los disparadores compiten en una cadena fija de prioridades; no existe una utilidad contextual comparable entre varios comentarios elegibles;
- el máximo fijo de cuatro comentarios contextuales por pestaña no distingue una visita de 70 segundos de una revisión de diez minutos;
- varios mensajes verbalizan tiempos exactos (`Forty-five seconds`, `Two minutes`, `Four minutes`), lo que puede sentirse más vigilante que inteligente;
- solo la decisión de memoria recibe un reconocimiento directo. Follow, Stop, regreso de pestaña y otros hitos legítimos no tienen todavía un contrato editorial;
- las pruebas E2E comprueban disparadores y persistencia, pero no continuidad tonal, compatibilidad, distribución, repetición ni calidad del catálogo.

Conclusión: ampliar únicamente los arrays produciría más frases, pero no una Director más creíble. Primero hay que convertir el copy en datos con significado editorial y separar la decisión de **trabajar** de la decisión de **hablar**.

## Decisiones que se mantienen

- Reglas locales y copy escrito; nunca una IA remota.
- Blackboard de comportamiento efímero dentro de la pestaña.
- Tras `Allow`, solo pueden persistir `visitTier` e ids opacos de copy ya mostrado.
- Nunca se persisten puntero, dwell, scroll, secciones, acciones ni duración.
- Director no mueve la cámara, no captura scroll y cancela cualquier intervención al navegar.
- El cursor permanece presente y trabaja por su cuenta; Follow recibe el cursor de forma excluyente.
- Touch, reduced motion, no-JS, pestaña oculta, Spotlight y Follow conservan sus límites actuales.
- Tono general seco, autocrítico y amable; el humor apunta a hábitos de diseño o al propio Javier, nunca al visitante, clientes, compañeros, accesibilidad, privacidad o resultados.
- El silencio es una respuesta válida. Una edición puede no llevar comentario.

## Decisiones que se cambian

1. **De strings sueltos a unidades editoriales completas.** Apertura y resolución pertenecerán al mismo intercambio para evitar remates incompatibles.
2. **De una cadena de `if` a elegibilidad + puntuación.** Varias respuestas posibles podrán competir según contexto, novedad y tono.
3. **De un límite fijo a un presupuesto adaptativo.** La cantidad de comentarios dependerá de la duración y riqueza real de la sesión, dentro de un máximo estricto.
4. **De tiempos exactos a etapas de sesión.** Director podrá percibir `quick-scan`, `settled`, `deep-review` o `long-session`, pero no recitar el cronómetro.
5. **De un único registro a una mezcla controlada.** Habrá comentarios profesionales, observacionales, autocríticos y lúdicos, con un presupuesto de humor que evite convertir la web en una colección de chistes.
6. **De contexto genérico a contexto compatible.** Cada frase declarará en qué secciones, acciones, visitas y estados puede aparecer.
7. **De selección opaca a simulación reproducible.** El modo de QA podrá fijar semilla y escenario sin alterar el comportamiento público.

## Modelo editorial

Cada entrada debe responder a una sola intención principal:

- `craft`: explicar una decisión concreta de diseño o contenido;
- `evidence`: señalar contrato, procedencia, límite o prueba;
- `acknowledge`: reconocer una acción explícita del visitante;
- `reassure`: aclarar privacidad, control o ausencia de seguimiento;
- `observe`: reaccionar de forma prudente a un patrón amplio de la sesión;
- `self-edit`: verbalizar una duda o corrección propia de Javier;
- `handoff`: acompañar el paso entre trabajo ambiental y Follow;
- `rare`: recompensa ocasional para una sesión o visita poco habitual.

El registro se expresa mediante metadatos, no mediante pools separados difíciles de coordinar:

- `professional`: directo, útil, sin gag;
- `dry`: observación breve o autocrítica leve;
- `playful`: humor visible, reservado para momentos poco frecuentes;
- `warm`: reconocimiento humano sin exceso de familiaridad.

La intensidad de humor usa `0 | 1 | 2`:

- `0`: informativo o profesional;
- `1`: ironía seca compatible con casi toda la experiencia;
- `2`: remate claramente cómico, siempre raro y nunca consecutivo.

No existirá un “modo gracioso”. La mezcla objetivo para una sesión normal será aproximadamente 55–65% útil/profesional, 25–35% seca o autocrítica y como máximo 10–15% lúdica.

## Familias de comentario

### 1. Criterio específico de sección

Hero, Snapshot, vídeo de 60 segundos, Work, Practice, AI workflow, About, References, Playground y Contact tendrán comentarios compatibles con su contrato real. No todos necesitan una edición, pero sí un vocabulario propio.

Ejemplos de asuntos, no copy definitivo:

- Hero: nombre frente a rol frente a propuesta de valor;
- Snapshot: claridad, confianza y posición profesional;
- vídeo: utilidad de un atajo humano y honestidad del placeholder;
- Work: evidencia, atribución y casos todavía ficticios;
- Practice: sistema, gobernanza y detalle;
- AI: validación humana, límites y responsabilidad;
- About: voz personal frente a pose profesional;
- References: procedencia, permiso y ausencia deliberada de citas inventadas;
- Playground: timing, prototipo y criterio de motion;
- Contact: datos pendientes y handoff real.

Objetivo de cobertura: al menos seis intercambios compatibles por sección principal y cuatro para zonas secundarias. La prioridad es que encajen, no alcanzar una cifra arbitraria.

### 2. Comportamiento amplio de sesión

- exploración rápida;
- lectura pausada;
- cambio frecuente de dirección;
- regreso a una sección;
- vuelta al Hero;
- llegada al final;
- revisión profunda de varias zonas;
- retorno a la pestaña después de una pausa;
- sesión breve, asentada, profunda o larga.

Estas frases describen una impresión probable, no una certeza. Se evita `I saw you`, el número exacto de segundos, el número de scrolls, la posición del puntero o cualquier formulación de vigilancia.

### 3. Acciones explícitas

- `Allow` y `No thanks` para memoria local;
- activación de `Follow Javier`;
- salida voluntaria de Follow;
- uso de `Explore` cuando produzca una pausa posterior con contexto suficiente;
- `Replay` o `Forget me` si Director sigue activo y la respuesta no compite con otro overlay.

Una acción explícita permite un reconocimiento inmediato porque el vínculo causal es comprensible. Aun así, Follow posee el cursor: la respuesta puede quedar para el momento de salida y nunca superponerse al Spotlight.

### 4. Agenda propia y autoconciencia

Comentarios que hacen creíble que Javier continúa trabajando aunque el visitante no lo dirija:

- una última comprobación de alineación;
- dudas sobre copy o jerarquía;
- pequeñas manías de producto;
- el gag de seguir dentro de un archivo de diseño;
- promesas poco fiables de “último ajuste”.

Esta familia no debe narrar cada microcambio. La mayor parte del trabajo ambiental será silencioso.

### 5. Comentarios raros

Se reservan para visitas altas consentidas, una revisión inusualmente completa o combinaciones poco frecuentes. Deben sentirse descubiertos, no programados.

Reglas:

- probabilidad baja y presupuesto máximo de uno por sesión;
- al menos tres alternativas por trigger raro;
- no pueden contener información más precisa que la que el visitante espera haber compartido;
- no desbloquean contenido, no cambian navegación y no penalizan a quien no consiente memoria.

## Esquema propuesto

```ts
type DirectorLine = {
  id: string;
  family: "section" | "behavior" | "action" | "ambient" | "rare";
  intent: "craft" | "evidence" | "acknowledge" | "reassure" | "observe" | "self-edit" | "handoff" | "rare";
  register: "professional" | "dry" | "playful" | "warm";
  humor: 0 | 1 | 2;
  opening: string;
  resolution?: string;
  sections?: readonly DirectorSection[];
  triggers?: readonly DirectorTrigger[];
  visitTiers?: readonly VisitTier[];
  sessionStages?: readonly SessionStage[];
  requires?: readonly DirectorCondition[];
  excludes?: readonly DirectorCondition[];
  rarity: "common" | "occasional" | "rare";
  cooldown: "direct" | "short" | "standard" | "long";
};
```

`id` es estable y opaco para memoria. Los textos pueden cambiar sin convertir el id en un registro de comportamiento. Apertura y resolución se seleccionan como pareja. Una entrada sin resolución sirve para una reacción puntual.

El catálogo se divide por responsabilidad:

- `director-copy/sections.ts`: intercambios ligados a cada sección;
- `director-copy/generic.ts`: voz reutilizable independiente del contenido;
- `director-copy/context.ts`: respuestas a sesión, comportamiento y acciones;
- `director-copy/signals.ts`: señales efímeras entre Follow y Director;
- `director-copy/types.ts`: esquema editorial;
- `DirectorCommentary.ts`: índice, filtros, scoring, selección y memoria opaca.

`DirectorPresence.tsx` conserva observación, cursor y ejecución visual, pero deja de contener política editorial detallada.

## Blackboard ampliado

Todo salvo la memoria consentida se reinicia al cerrar la pestaña:

- `sessionStage`: `opening | quick-scan | settled | deep-review | long-session`;
- `pace`: `fast | mixed | patient`;
- `focusSection` y `previousFocusSection`;
- `sectionsSeen`, `sectionsRevisited` y profundidad máxima, solo en memoria RAM;
- `lastExplicitAction`, consumida una vez;
- últimos tres ids, familias, registros e intensidades de humor;
- tiempo desde el último comentario y desde la última acción silenciosa;
- presupuesto de comentarios y de humor;
- si Follow, Spotlight, consentimiento o navegación poseen actualmente la interacción;
- `visitTier`, únicamente real cuando existe consentimiento; sin él se comporta como primera sesión sin intentar inferir retorno.

No se añade un identificador de dispositivo ni una semilla derivada de propiedades del navegador. La semilla de sesión será aleatoria y efímera; en tests podrá inyectarse de forma explícita.

## Motor de selección

La decisión ocurre en seis pasos:

1. **Generar hechos.** El modelo convierte señales efímeras en hechos amplios: `fast-scan`, `section-dwell`, `returned-top`, `memory-denied`, etc.
2. **Filtrar.** Se eliminan entradas incompatibles con sección, trigger, visita, etapa, exclusiones, cooldown, privacidad y estado de Follow/Spotlight.
3. **Puntuar utilidad.** Acción explícita, relevancia de sección y novedad pesan más que humor o rareza.
4. **Penalizar fatiga.** Se reduce la puntuación de ids, familias, aperturas sintácticas, registro e intensidad usados recientemente.
5. **Equilibrar voz.** El presupuesto tonal impide dos gags claros seguidos, reserva los mensajes serios para contratos serios y favorece silencio si no hay una opción realmente buena.
6. **Elegir de forma ponderada.** Se selecciona entre la banda superior con una semilla efímera. Así existe variedad sin escoger una frase débil solo por azar.

Las prioridades duras son:

1. seguridad y cancelación;
2. acción explícita relevante;
3. aclaración de privacidad o evidencia;
4. comentario específico de sección;
5. observación de sesión;
6. agenda propia;
7. comentario raro.

## Cadencia y presupuesto

Acción visual y voz quedan desacopladas:

- el cursor continúa con microajustes silenciosos cuando el visitante está estable;
- una acción explícita puede producir una respuesta inmediata, una sola vez;
- el comentario ambiental exige normalmente `18–30 s` desde el anterior, ajustado por actividad y longitud del texto;
- durante navegación activa no se prepara ni se conserva una frase pendiente;
- el tiempo visible se calcula por longitud, con un mínimo de lectura; no todos los comentarios desaparecen al mismo ritmo;
- una visita corta recibe como máximo dos comentarios contextuales además del handoff del Hero;
- el presupuesto crece con la sesión: +1 al asentarse y +1 por cada tramo profundo, hasta un máximo orientativo de siete comentarios contextuales en una pestaña larga;
- respuestas directas de privacidad no consumen el presupuesto normal, pero sí abren un cooldown;
- solo puede aparecer un comentario raro por sesión y nunca en los primeros 90 segundos;
- si el selector no encuentra una frase con puntuación suficiente, Director trabaja en silencio.

Los números son valores iniciales de tuning, no contratos visuales. Se ajustarán mediante sesiones reproducibles y observación en navegador.

## Guía de escritura

- Inglés natural, directo y coherente con la voz del portfolio.
- Una idea por comentario; preferencia por 45–85 caracteres y un máximo editorial de 95.
- Apertura y resolución deben leerse como una unidad, no como dos frases intercambiables.
- No abusar de `Apparently`, rayas largas, tecnicismos, juegos de palabras ni referencias internas.
- El humor se dirige a la propia indecisión o al oficio, nunca juzga cómo navega el visitante.
- Un fast scroll se reconoce sin etiquetarlo como impaciencia; una pausa no se interpreta automáticamente como interés.
- Privacidad, contenido ficticio, fuentes y permisos se explican sin remate frívolo.
- No se afirma que el sistema “sabe”, “vigila”, “recuerda” o “ha visto” algo que no corresponda al consentimiento real.
- Los tiers de visita sí pueden reconocerse después de `Allow`, pero con formulaciones progresivas y sin repetir siempre el número.
- No se inventan hechos personales, intención de contratación, profesión, empresa ni relación previa del visitante.

## Alcance editorial inicial

No se persigue un catálogo infinito. La primera implementación debe alcanzar:

- 6 intercambios compatibles para cada sección principal;
- 4–6 para cada sección secundaria;
- 6–8 respuestas por acción o patrón frecuente;
- 3–5 por patrón raro;
- 20–24 entradas de agenda propia reutilizables con exclusiones claras;
- al menos seis opciones elegibles en cualquier escenario común después de aplicar filtros.

Esto situará el catálogo aproximadamente en **220–260 líneas atómicas**, pero la aceptación se mide por cobertura y compatibilidad, no por cantidad bruta.

## Instrumentación de QA

Se añadirá un harness solo de desarrollo/test:

- semilla reproducible;
- escenario (`first`, `returning`, `fast-scan`, `deep-read`, `memory-denied`, `follow-stop`, etc.);
- reloj acelerado;
- inspección de hechos elegibles, score y motivo de descarte;
- posibilidad de renderizar la frase más larga de cada familia para comprobar el comentario visual.

No habrá panel público, analytics ni logs persistentes. Los atributos de diagnóstico deberán desaparecer o permanecer inertes en producción.

## Implementación realizada

### Fase 0 — Biblia de voz e inventario

- clasificar las 151 líneas actuales por intención, registro, humor y compatibilidad;
- conservar las fuertes, reescribir las ambiguas y retirar las que verbalizan vigilancia o no encajan con su anchor;
- aprobar una pequeña muestra por familia antes de multiplicar variantes.

### Fase 1 — Esquema y selector puro

- introducir `DirectorLine`, hechos y filtros sin cambiar todavía la coreografía;
- emparejar apertura/resolución;
- extraer puntuación, selección y memoria a funciones puras;
- migrar los ids existentes o definir una tabla explícita de compatibilidad para no romper la rotación consentida.

### Fase 2 — Cobertura específica

- ampliar secciones y acciones explícitas;
- convertir tiempos exactos en etapas de sesión;
- añadir compatibilidad por sección y eliminar respuestas genéricas mal ancladas;
- desacoplar formalmente microajuste silencioso y comentario.

### Fase 3 — Variedad, humor y fatiga

- incorporar balance de registro, presupuesto de humor, rareza y penalización de repetición;
- hacer adaptativo el presupuesto de comentarios;
- añadir agenda propia y momentos raros;
- validar que la personalidad aumenta sin invadir el contenido profesional.

### Fase 4 — Simulación y tuning

- ejecutar escenarios sembrados de 30 segundos, 2, 5 y 10 minutos;
- revisar sesiones primera, segunda y quinta con y sin consentimiento;
- ajustar scores y cooldowns a partir del resultado observado, no solo de tests de código;
- pasar la crítica de Impeccable sobre legibilidad, jerarquía y presencia del comentario, contrastándola con criterio propio.

### Fase 5 — Regresión completa

- navegador real en desktop, viewport bajo y scroll/resize durante comentario y typing;
- reduced motion, touch, Follow, Stop, Replay, consentimiento y fallo forzado;
- `npm run lint`, `npm test` y `npm run test:e2e`;
- comparación con la versión vigente antes de convertir el nuevo selector en comportamiento por defecto.

## Matriz mínima de pruebas

| Escenario | Resultado esperado |
| --- | --- |
| Primera visita, lectura normal | Hero inmediato, voz útil y poca familiaridad |
| Visita consentida 2–4 | Reconocimiento cálido sin repetir número o copy reciente |
| Tier 5 | Variación de relación estable, sin escalar a intimidad artificial |
| Memoria rechazada | Respuesta respetuosa, session-only y cero memoria de comportamiento |
| Fast scan | Director cede al scroll y comenta solo después de una pausa real |
| Dwell en Work | Copy específico de evidencia, nunca una observación genérica incompatible |
| Revisit de sección | Reconocimiento prudente, sin afirmar intención |
| Follow → Stop | Cursor excluyente durante Follow y regreso coherente después |
| Regreso de pestaña | Reanudación silenciosa o warm; nunca reproche |
| Sesión larga | Presupuesto ampliado, mezcla tonal estable y máximo un momento raro |
| Scroll durante nota/typing | Cancelación inmediata, sin overlay ni estilos residuales |
| Sin opción de calidad | Microajuste silencioso; ningún comentario de relleno |

Pruebas unitarias adicionales:

- ids únicos y esquema completo;
- ninguna entrada común queda sin escenario elegible;
- no se repite id antes de agotar alternativas compatibles;
- una resolución siempre pertenece a su apertura;
- humor 2 nunca aparece consecutivo ni en privacidad/evidencia;
- la elección con semilla es reproducible;
- 500 sesiones simuladas respetan caps, cooldowns y distribución tonal;
- negar memoria no escribe `seenCueIds`, visita ni comportamiento;
- permitir memoria solo escribe los dos contratos aprobados.

## Criterios de aceptación

- En cinco sesiones manuales consecutivas no se percibe una secuencia fija ni una frase inevitable por sección.
- Cada comentario parece causado por el contexto actual, pero ninguno revela datos demasiado precisos.
- La voz se reconoce como una misma persona aunque alterne entre profesional, seca y lúdica.
- En una sesión normal predomina el contenido útil; los chistes funcionan como contraste y no como producto principal.
- Director continúa trabajando aunque permanezca en silencio y nunca desaparece fuera de sus exclusiones vigentes.
- Follow conserva propiedad exclusiva del cursor y Director no intenta comentar por encima.
- No hay repeticiones cercanas de id, familia, estructura o intensidad tonal.
- Todas las notas caben en la zona segura y permanecen visibles el tiempo suficiente para leerse.
- Ningún dato de comportamiento sobrevive al cierre de pestaña y la web sigue funcionando si Director falla.
- La regresión completa y la auditoría visual no encuentran problemas importantes; solo detalles menores de tuning.

## Orden de aprobación

Antes de implementar todo el catálogo se presentará una muestra breve con:

- dos intercambios profesionales;
- dos secos/autocríticos;
- dos cálidos;
- dos lúdicos;
- una respuesta de privacidad;
- un momento raro.

Esa muestra fijará la voz. Después se amplía el catálogo, se implementa el selector y se prueba en sesiones completas. Así se evita escribir cientos de líneas sobre una personalidad todavía no aprobada.
