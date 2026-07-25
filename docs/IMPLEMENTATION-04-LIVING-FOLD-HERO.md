# Implementación 04 — Living Fold hero

> Documento histórico. Este engine y sus dependencias Three/R3F fueron retirados. La implementación vigente está en `IMPLEMENTATION-05-LIVE-FILE.md`.

Fecha: 24 de julio de 2026  
Estado: implementado; pendiente de aprobación visual de Javier en el preview privado.

## Resultado

El primer viewport anterior se sustituyó por una composición deliberadamente mínima:

- `Javier Ortiz`;
- `Senior Product Designer`;
- un único enlace `Explore`;
- una lámina 3D continua como protagonista.

No hay fotografía, párrafos, métricas, tarjetas, partículas, diagrama ni selector de dominios en el hero. La síntesis profesional y el retrato temático abren la segunda sección, seguidos por la trayectoria interactiva existente.

## Por qué esta dirección

`AUDIT-04-HERO-RETHINK.md` comparó vídeo, coreografía multimedia, modelos 3D y componentes de 21st.dev. `Living Fold` ofrecía el mejor equilibrio entre impacto inmediato, autoría, interacción y capacidad de funcionar todavía como una buena imagen estática. Javier autorizó implementarla directamente sin exigir los tres motion boards inicialmente propuestos.

## Archivos

- `app/page.tsx`: composición mínima del hero y nueva `profile-intro`.
- `app/components/LivingFold.tsx`: frontera cliente, sincronización de tema/reduced motion y fallback en servidor.
- `app/components/LivingFoldScene.tsx`: escena R3F y shaders custom.
- `app/globals.css`: encuadre, fallback CSS, composición responsive y segunda sección.
- `app/components/MotionController.tsx`: conserva únicamente reveals de texto/secciones; el despliegue 3D vive dentro de la escena.
- `tests/rendered-html.test.mjs`: comprueba la nueva jerarquía y que el antiguo claim/engine no regresen.

## Coreografía

1. La lámina parte de un corte comprimido y se despliega hacia dos pliegues principales.
2. Después mantiene un movimiento ambiental lento; no hay ruido de partículas.
3. El puntero aplica elevación local y una rotación de grupo limitada.
4. Durante el primer scroll la geometría pierde profundidad, se ensancha y se comprime verticalmente hasta sugerir una franja de entrega.
5. El scroll sigue siendo completamente nativo: no hay pinning ni captura de rueda.

## Material y temas

El fragment shader calcula iluminación y Fresnel directamente desde la geometría deformada.

- `System`: base casi negra, violeta y azul eléctricos, con un reflejo lima secundario.
- `Human`: coral, rosa, arena y azul. Esta paleta solo resuelve el hero actual; no sustituye el futuro rediseño integral de `Human` solicitado por Javier.

El cambio se interpola dentro del shader; no recrea el canvas ni descarga assets.

## Rendimiento y degradación

- un solo `Canvas` y una sola `PlaneGeometry` de `144 × 82` segmentos;
- DPR limitado a `1–1.6`;
- sin luces, modelos, texturas, vídeo, bloom ni postprocesado;
- carga dinámica con SSR desactivado solo para la escena;
- fotograma CSS completo renderizado en servidor y visible mientras carga WebGL;
- con `prefers-reduced-motion`, el canvas no se muestra y el fallback es la composición final;
- el visual es `aria-hidden`; el contenido y la navegación siguen siendo HTML.

El bundle de Three genera un chunk cliente grande por naturaleza, pero queda separado del HTML inicial mediante importación dinámica. No añadir otra escena o una librería de postproducción sin medir el coste y documentar el beneficio visual.

## Responsive

La cámara es estable y la escala de la geometría se deriva del viewport R3F. En móvil la lámina reduce escala, el fallback amplía su encuadre y el rol baja de tamaño. La segunda sección pasa de grid a columna, manteniendo fotografía y facts en orden lógico.

## Contratos para futuras ediciones

- mantener un único gesto visual dominante;
- no volver a superponer controles o credenciales sobre el visual;
- no hacer que puntero o motion sean necesarios para entender el rol o avanzar;
- preservar `LivingFold` como progressive enhancement con fallback;
- mantener `profile-intro` como primer bloque explicativo, salvo que una auditoría posterior documente otra secuencia;
- si un render producido en Blender o vídeo supera claramente esta versión, conservar poster, reduced motion y navegación semántica antes de reemplazarla.

## Validación ejecutada

- `npm run lint` — correcto.
- `npm test` — build de producción y tres smoke tests correctos.
- robots siguen bloqueando indexación y los casos ficticios conservan su rotulado.

La aceptación visual final requiere revisar el preview desplegado en escritorio y móvil; esta revisión no cambia por sí sola los contratos de accesibilidad y fallback anteriores.
