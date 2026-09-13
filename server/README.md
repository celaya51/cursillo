# Ruta Julio Sync API

Backend privado para sincronizar el progreso del curso entre dispositivos y generar audio WAV con Piper.

## Variables de entorno

- `SYNC_TOKEN`: token privado largo. No lo publiques en GitHub.
- `CORS_ORIGIN`: `https://celaya51.github.io`
- `DATA_DIR`: `/data`
- `PIPER_VOICE`: `es_MX-ald-medium`

## Coolify

1. Crea un servicio desde este repositorio usando `server/Dockerfile`.
2. Configura el directorio/base del build como `server` (o apunta directamente al Dockerfile dentro de `server`).
3. Monta un volumen persistente en `/data`.
4. Expón el puerto `8000` detrás de un dominio HTTPS, por ejemplo `https://cursillo-api.tudominio.com`.
5. Define `SYNC_TOKEN` y `CORS_ORIGIN`.
6. Comprueba `GET /health`.

El primer arranque descarga la voz Piper `es_MX-ald-medium` (~63 MB) y la guarda en el volumen persistente.

## API

- `GET /health`
- `GET /v1/progress` con `Authorization: Bearer <SYNC_TOKEN>`
- `PUT /v1/progress` con el mismo header y `{ "state": { ... } }`
- `POST /v1/tts` con el mismo header y `{ "text": "..." }`, devuelve `audio/wav`

El frontend nunca contiene el token en GitHub: cada dispositivo lo guarda localmente después de que lo introduzcas en la sección **datos**.
