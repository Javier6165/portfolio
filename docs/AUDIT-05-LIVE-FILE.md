# Auditoría 05 — Live File

Fecha: 25 de julio de 2026.

## Punto de partida

`Living Fold` resolvía impacto visual, pero era una pieza aislada: no condicionaba el resto de la web, añadía un chunk cliente cercano a 866 KB y retrasaba el hero en algunos móviles. Human seguía pareciendo una inversión clara, los reveals globales apagaban contenido y los casos no podían alojar evidencia real heterogénea.

El problema no era añadir otro efecto. Era crear una gramática que conectase hero, criterio, sistemas, colaboración y prototipos sin perjudicar la lectura de un recruiter.

## Dirección elegida

`Live File` presenta el portfolio como un archivo que Javier está refinando dentro de una herramienta ficticia de diseño. Conserva del software colaborativo cuatro ideas —frame, selección, cursor y comentario— pero no su branding, toolbar ni paneles literales.

La metáfora es útil porque:

- convierte el craft en comportamiento visible;
- permite mostrar propagación y sistemas;
- puede transformar una pantalla estática en prototipo;
- admite comentarios humanos sin convertir la página en autobiografía;
- desaparece cuando el visitante necesita leer.

## Decisiones de alcance

- DOM/CSS/GSAP, no canvas ni editor funcional.
- GSAP como único motor; scroll nativo.
- Nombre y rol visibles desde el primer frame.
- Retrato en el hero; explicación profesional en la segunda sección.
- Intro cancelable por cualquier intención de continuar.
- Tres cues posteriores como máximo.
- Móvil sin cursor flotante: selección, asset tray y gesto de colocación.
- Memoria persistente solo tras consentimiento.
- Human como identidad editorial propia.
- Un único case study ficticio demuestra comportamiento sistémico.

## Alternativas descartadas

- **Mantener WebGL:** impacto alto, pero peso, accesibilidad y poca continuidad narrativa.
- **Clonar Figma:** reconocimiento inmediato, pero derivativo y con chrome innecesario.
- **Canvas/Konva/React Flow:** resolverían edición real que el portfolio no necesita.
- **Liveblocks:** presencia real, backend, red e identidad sin valor para una experiencia individual.
- **Motion/Lenis/XState:** duplicación de motores o complejidad no justificada.
- **Vídeo hero fijo:** control artístico, pero peor adaptación temática y menos integración con contenido semántico.

## Riesgos resueltos

- **Recruiter bloqueado:** skip, scroll, Escape, PageDown y hero visible.
- **Hydration mismatch:** bootstrap por atributos; storage después de paint.
- **Fatiga:** sin parallax continuo, cursor permanente o scroll-jacking.
- **Privacidad:** session-first y localStorage consentido sin identificadores.
- **Móvil vacío:** composición vertical específica.
- **Fallo de asset:** timeline cancelada y contenido final disponible.
- **Clon visual:** lenguaje propio, proporciones y paletas temáticas.

## Resultado

La dirección aprobada sustituye a `Living Fold` y convierte la firma visual en un sistema extensible. El éxito no se mide por cuántos efectos aparecen, sino por si cada intervención demuestra refinamiento, sistema, colaboración o comportamiento real sin ralentizar la comprensión.

La implementación concreta y la QA están en `IMPLEMENTATION-05-LIVE-FILE.md`.
