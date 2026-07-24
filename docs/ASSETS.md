# Inventario y procedencia de assets

## Fuentes originales

Los originales están fuera del repositorio `site/`, en la carpeta hermana `../Assets/`.

- Perfil profesional: `../Assets/Profile.pdf`.
- Retratos: `../Assets/Images/Portraits/`.

No sobrescribir los originales. Las versiones servidas se generaron como copias optimizadas.

## Mapeo de retratos

| Asset servido | Fuente original | Uso |
| --- | --- | --- |
| `public/images/portraits/hero-system.jpg` | `JaviNewPhotoDark-min.png` | Hero oscuro/System |
| `public/images/portraits/hero-human.jpg` | `JaviNewPhoto-min.png` | Hero claro/Human |
| `public/images/portraits/about-system.jpg` | `editadas/_MGL0339.jpg` | About oscuro/System |
| `public/images/portraits/about-human.jpg` | `editadas/_MGL0269.jpg` | About claro/Human |

Las copias se redimensionaron y comprimieron a JPEG para proteger LCP sin alterar los originales.

## Tarjeta social

`public/og.png` fue generada una sola vez con la herramienta integrada de generación de imágenes.

Dirección del prompt: una composición editorial premium que representa calma emergiendo de un sistema digital complejo; fondo grafito, grid modular, señal chartreuse y acento violeta, detalle concentrado a la derecha y espacio negativo a la izquierda; sin personas, dashboards literales, texto, logos ni marcas de agua.

La imagen se validó visualmente y se ajustó a `1200 × 630`.

## Favicon

`public/favicon.svg` es una marca geométrica local `JO`, creada para el preview. No debe tratarse como identidad definitiva sin aprobación de Javier.
