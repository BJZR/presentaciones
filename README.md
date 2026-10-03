# Presentador

Editor de presentaciones en un solo archivo HTML. Sin dependencias ni servidor.

## Qué hace
- Textos, imágenes, rectángulos y elipses, libres sobre un lienzo 16:9.
- Arrastrar, redimensionar (esquina), guías de centro.
- Tres temas, tres transiciones, reordenar diapositivas arrastrando.
- Deshacer/rehacer, autoguardado local, guardar/abrir `.json`.
- Modo presentación a pantalla completa con reloj y progreso.

## Uso
    make          # genera dist/presentador.html
    make clean    # borra dist/

Abrir `dist/presentador.html` en el navegador.

## Atajos
| Tecla | Acción |
|---|---|
| Doble clic | editar texto (Esc termina) |
| Supr | borrar elemento |
| Ctrl+Z / Ctrl+Y | deshacer / rehacer |
| Ctrl+D | duplicar elemento |
| F5 | presentar |
| → ␣ / ← | siguiente / anterior |

## Estructura
    src/index.html      plantilla
    src/style.css       estilos
    src/js/estado.js    estado, temas, deshacer
    src/js/lienzo.js    dibujo, arrastre, edición
    src/js/diaps.js     miniaturas y diapositivas
    src/js/elementos.js crear elementos
    src/js/props.js     panel de propiedades
    src/js/presentar.js modo presentación
    src/js/archivo.js   guardar/abrir
    src/js/main.js      arranque y atajos
