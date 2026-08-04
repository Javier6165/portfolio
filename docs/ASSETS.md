# Inventario y procedencia de assets

## Fuentes originales

Los originales están fuera del repositorio `site/`, en `../Assets/`.

- Perfil profesional: `../Assets/Profile.pdf`.
- Retratos: `../Assets/Images/Portraits/`.

No sobrescribir originales. Las versiones servidas son copias optimizadas.

## Retratos

| Asset servido | Fuente original | Uso |
| --- | --- | --- |
| `public/images/portraits/hero-system.jpg` | `JaviNewPhotoDark-min.png` | Hero Live File |
| `public/images/portraits/about-system.jpg` | `editadas/_MGL0339.jpg` | About |
| `public/images/portraits/video-intro-placeholder.jpg` | `editadas/_MGL0247.jpg` | Placeholder de vídeo `Meet me in 60 seconds` |

Hero y About conservan estos JPEG como fallback y añaden AVIF/WebP responsive `-960`/`-1440`. Los originales servidos no se sobrescriben. El sufijo `system` es un nombre histórico; ambos son los únicos assets canónicos Dark. El bootstrap precarga el AVIF de Hero; `EditorIntro` espera el decode hasta 350 ms y tiene fallback de fallo. El poster provisional del vídeo es una copia JPEG separada para no confundirlo con ninguno de los dos stages fotográficos canónicos.

## Tarjeta social vigente

`public/og-live-file.jpg` mide `1200 × 630` y es la tarjeta usada por metadata Open Graph/Twitter. Se exportó a JPEG de alta calidad para reducir el peso aproximado de 758 KB a 134 KB sin perder legibilidad.

Se generó con la herramienta integrada de imagen para Live File. La mitad grafito/lima representa el producto y la superficie crema/azul/coral es el artboard del editor ficticio, no un tema Light seleccionable. El texto solicitado y validado visualmente es:

- `JAVIER ORTIZ`
- `SENIOR PRODUCT DESIGNER`
- `LIVE FILE / PORTFOLIO`

La generación original está fuera del repo bajo el almacenamiento de Codex; la copia final se recortó y redimensionó de forma determinista. `public/og.png` pertenece a una preview histórica y ya no se referencia.

## Favicon

`public/favicon.svg` es una marca geométrica local `JO`, creada para el preview. No debe tratarse como identidad definitiva sin aprobación de Javier.
