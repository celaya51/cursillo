# Ruta Julio — programación, automatización e integración

Curso web personalizado, mobile-first y con interfaz tipo Metro / Windows Phone.

## Abrir

GitHub Pages:

`https://celaya51.github.io/cursillo/`

## Características

- Interfaz cuadrada y táctil.
- Diagnóstico inicial que cambia el orden recomendado de estudio.
- 13 módulos de aprendizaje con ruta adaptativa.
- Recomendación automática del siguiente módulo.
- Ayuda escalonada: intento propio → pista → documentación / IA.
- Repaso activo; los temas marcados como difíciles suben de prioridad.
- Temporizador de foco y tres modos de trabajo con IA.
- Voz del navegador cuando funciona y audio WAV generado en servidor como alternativa para Brave.
- Tamaño de texto, espaciado, modo enfoque y tema oscuro.
- Progreso local con respaldo JSON.
- Sincronización automática entre dispositivos mediante el backend opcional de `server/`.
- Diseño responsive para teléfono, tableta y escritorio.

## Arquitectura

El frontend (`index.html`, `styles.css`, `content.js`, `app.js`) se sirve directamente con GitHub Pages.

`server/` contiene un backend FastAPI preparado para Coolify. Usa SQLite en un volumen persistente para el progreso y Piper con voz `es_MX-ald-medium` para generar audio. El token de sincronización nunca se guarda en el repositorio; se configura como variable de entorno en el VPS y localmente en cada navegador.

Consulta `server/README.md` para el despliegue.
