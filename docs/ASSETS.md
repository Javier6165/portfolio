# Inventario y procedencia de assets

## Fuentes originales

Los originales están fuera del repositorio `site/`, en `../Assets/`.

- Perfil profesional: `../Assets/Profile.pdf`.
- Retratos: `../Assets/Images/Portraits/`.

No sobrescribir originales. Las versiones servidas son copias optimizadas.

## Retratos

| Asset servido | Fuente original | Uso |
| --- | --- | --- |
| `public/images/portraits/hero-system.jpg` | `JaviNewPhotoDark-min.png` | Hero Live File / Dark |
| `public/images/portraits/hero-human.jpg` | `JaviNewPhoto-min.png` | Hero Live File / Light |
| `public/images/portraits/about-system.jpg` | `editadas/_MGL0339.jpg` | About / Dark |
| `public/images/portraits/about-human.jpg` | `editadas/_MGL0269.jpg` | About / Light |

Hero y About conservan estos JPEG como fallback y añaden AVIF/WebP responsive `-960`/`-1440`. Los originales servidos no se sobrescriben. El bootstrap precarga solo el AVIF del tema activo; la primera carga de retratos medida es ~31 KB. `EditorIntro` espera el decode de la imagen activa hasta 350 ms y tiene fallback de fallo.

## Tarjeta social vigente

`public/og-live-file.jpg` mide `1200 × 630` y es la tarjeta usada por metadata Open Graph/Twitter. Se exportó a JPEG de alta calidad para reducir el peso aproximado de 758 KB a 134 KB sin perder legibilidad.

Se generó con la herramienta integrada de imagen para Live File: una lectura Dark grafito/lima y una lectura Light crema/azul/coral con los mismos primitives de frame, selección, cursor y asset chip. El texto solicitado y validado visualmente es:

- `JAVIER ORTIZ`
- `SENIOR PRODUCT DESIGNER`
- `LIVE FILE / PORTFOLIO`

La generación original está fuera del repo bajo el almacenamiento de Codex; la copia final se recortó y redimensionó de forma determinista. `public/og.png` pertenece a una preview histórica y ya no se referencia.

## Favicon

`public/favicon.svg` es una marca geométrica local `JO`, creada para el preview. No debe tratarse como identidad definitiva sin aprobación de Javier.
