# LMS Vértice · Iteración 2

Prototipo estático en HTML, CSS y JavaScript, preparado para publicarse dentro de una subcarpeta de un sitio web.

## Publicación en una carpeta

Puedes subir todo el contenido de esta carpeta, por ejemplo, a:

    public_html/campus-demo/

Y abrirlo en:

    https://tudominio.com/campus-demo/

Todas las rutas de la aplicación son relativas, incluido el contenido interactivo, por lo que no necesita estar en la raíz del dominio.

## SCORM / contenido web

El contenido extraído está en:

    scorm/modulo-1/content/index.html

El player lo carga dentro de un iframe del mismo origen.

La iteración 2 detecta dinámicamente la sección del contenido Rise mediante los atributos `data-lesson-id` del documento embebido. El paquete contiene 38 secciones. El sistema calcula el porcentaje usando:

- índice de la sección actual;
- posición dentro de esa sección;
- máximo punto alcanzado;
- valores enviados a la API SCORM simulada si el contenido los utiliza.

El progreso nunca disminuye si el usuario vuelve hacia atrás. Además se almacena la sección actual para mostrarla en el campus.

## Persistencia

Todos los datos se almacenan en localStorage bajo la clave:

    verticeLmsStateV2

Se guardan, entre otros:

- login del prototipo;
- avance SCORM;
- sección actual;
- máximo porcentaje alcanzado;
- tiempo en el contenido;
- secciones visitadas;
- respuestas de evaluación;
- intento actual;
- resultado;
- insignias derivadas del progreso;
- información editable del perfil.

Si existe información de la iteración anterior (`verticeLmsStateV1`), se migra automáticamente la primera vez.

## Evaluación

La evaluación se habilita al alcanzar 80% del contenido SCORM. Cada respuesta se guarda inmediatamente en localStorage. También se conserva el tiempo del intento, la pregunta actual y el resultado.

## Actualizaciones y caché

Los HTML cargan CSS y JS con `?v=2.0.0` y se incluye `.htaccess` para revalidar HTML. En una próxima entrega basta con cambiar el número de versión para forzar la actualización de CSS y JS.

## Prueba local

No abrir con `file://`.

Windows:

    start_server.bat

macOS/Linux:

    ./start_server.sh

O manualmente:

    python3 -m http.server 8080

Luego:

    http://localhost:8080/

## Login del prototipo

- cualquier correo con formato válido;
- contraseña de mínimo 6 caracteres.

No se almacena la contraseña.


## Iteración 2.2 - corrección de tracking Rise

El player ya no calcula el avance únicamente por scroll. Se inyectó `scorm/modulo-1/content/vertice-progress-bridge.js`, que lee el porcentaje que el propio contenido Rise muestra (por ejemplo `15% COMPLETA`), identifica la sección visible (`Sección 6 de 34`) y lo comunica al campus mediante `postMessage`. El campus guarda este valor en `localStorage` bajo la clave `verticeLmsStateV2`.

El cálculo por DOM/scroll queda únicamente como respaldo.


## Curso actual
- La inteligencia artificial en la fabricación de un vehículo
- Contenido Rise/Web extraído: 55 secciones detectadas en runtime-data.js.
- LocalStorage usa la clave `verticeLmsStateV3` para iniciar el nuevo curso sin mezclar el avance del curso anterior.
