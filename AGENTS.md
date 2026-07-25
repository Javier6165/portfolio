# Instrucciones del repositorio de la web

## Antes de editar

Lee, en este orden:

1. `README.md`
2. `docs/PROJECT-CONTEXT.md`
3. `docs/DECISIONS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/AUDIT-05-LIVE-FILE.md`
6. `docs/IMPLEMENTATION-05-LIVE-FILE.md`
7. `docs/AUDIT-06-POST-LIVE-FILE.md`
8. `docs/PLAN-06-IMPROVEMENTS.md`
9. `docs/NARRATIVE-07-LIVE-FILE-CHOREOGRAPHY.md`
10. `docs/CONTENT-AND-RELEASE.md`
11. `docs/ASSETS.md` si vas a tocar imágenes.

## Contratos que debes preservar

- `app/config.ts` es la única fuente para URL y estado preview/público.
- Los temas válidos son `system` y `human`; la clave local es `javier-theme` y el evento `portfolio-theme-change` sincroniza sus transiciones.
- `Live File` es la firma vigente. Sus estados visuales se resuelven con `data-narrative`, `data-motion`, `data-live-file` e `IntroPhase`; no conviertas GSAP en la fuente de verdad lógica.
- El hero semántico contiene nombre, rol, retrato y `Explore`. El editor es decorativo y no puede ocultar ese contenido a lectores de pantalla ni dejarlo inaccesible sin JavaScript.
- `NarrativeProvider` es el único propietario de consentimiento, visita, cues y motion manual. Las claves y el esquema están documentados en `IMPLEMENTATION-05-LIVE-FILE.md`.
- La memoria persistente solo se escribe tras `Allow`; `sessionStorage` puede evitar repetir la intro en la pestaña sin consentimiento.
- `.js-hero-reveal`, `.js-reveal` y `.theme-swap` son hooks de motion. El contenido base empieza visible y reduced motion debe resolver directamente al estado final.
- Los tres cues actuales de Home son cancelables, limitados y nunca comunican información esencial. Son una implementación temporal: el guion 07 los sustituye por escenas con cambio persistente, un cursor singleton y solo tres comentarios prominentes después del hero.
- La auditoría 06 confirmó que los cues actuales no hacen Live File transversal: Work no puede alcanzar su threshold y los otros dos exigen una pausa poco natural. No presentes esta parte como terminada; sigue el Plan 06.
- La coreografía 07 exige un beat distinto en cada sección: `Clarify`, `Frame`, `Propagate`, `Activate`, `Experiment`, `Reframe` y `Hand off`. No implementes un overlay genérico ni cursores independientes por wrapper.
- `CaseBlock` es la unión discriminada para evidencia. Figma y prototipos externos son click-to-load; no añadas iframes automáticos por slug.
- Los casos conceptuales deben seguir rotulados como ficticios.
- `.openai/hosting.json` identifica el sitio existente; no cambies ni derives su `project_id`.

## Estilo de implementación

- Prefiere componentes de servidor; añade cliente solo si una interacción lo necesita.
- Usa tokens de `globals.css` y CSS Modules co-localizados para nuevos sistemas complejos.
- GSAP es el único motor de coreografía; CSS puede resolver hover, focus y microestados locales.
- Añade comentarios para fallbacks, privacidad o contratos entre archivos, no para narrar JSX evidente.
- Conserva navegación semántica, roving focus, skip link y estados de teclado/touch.
- No añadas smooth scroll, scroll-jacking, canvas, WebGL o motion imprescindible para entender contenido.

## Validación

Ejecuta `npm run lint` y `npm test`. Para cambios interactivos ejecuta también `npm run test:e2e`. La matriz cubre 1440×900, 1280×800, 768×1024 y 390×844, System/Human, axe, memoria, no-JS, reduced motion y fallos de imagen.

Los cambios desplegables se publican como una nueva versión privada del mismo proyecto Sites mediante las skills de Sites.
