# ClearDraft

Genera contenido de negocio (emails, descripciones de producto, comunicados internos) y
revisa automáticamente el borrador con una segunda pasada de IA que evalúa tono, claims
sin sustento, disclaimers faltantes y sesgo — como tener un redactor y un oficial de
gobernanza trabajando en serie.

Proyecto técnico para el proceso de RevAIsor. Frontend en Next.js, backend en Spring
Boot, integración de IA generativa vía la API de OpenAI (funciona con cualquier
proveedor compatible con el formato de Chat Completions).

## Arquitectura

```
Navegador (Next.js) --POST /api/draft--> Spring Boot --> API de IA (generar)
                                                       --> API de IA (revisar el borrador)
                                                       --> guarda en H2 (historial)
                     <---- draft + review -------------
```

La API key del proveedor de IA vive **solo en el backend**, vía variable de entorno.
El frontend nunca la ve — si le hablara directo a la IA, cualquiera podría robar la
clave desde las herramientas de desarrollador del navegador. Por eso Next.js le habla
al backend (no a la IA), y el backend necesita CORS habilitado para aceptar esas
peticiones (ver `FRONTEND_ORIGIN` abajo).

- **Backend**: `backend/` — Spring Boot 3, Java 21, Maven. Expone `POST /api/draft` y
  `GET /api/history`.
- **Frontend**: `frontend/` — Next.js 16 (App Router), TypeScript, Tailwind CSS.

## Requisitos

- Java 21+ y Maven (el backend)
- Node.js 20+ y npm (el frontend)
- Una API key de OpenAI (o de cualquier proveedor compatible con Chat Completions)

## Variables de entorno

### Backend (`backend/`)

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `OPENAI_API_KEY` | Sí | — | La clave de tu proveedor de IA. Sin esta, el backend arranca pero cualquier request a `/api/draft` falla. |
| `OPENAI_API_BASE_URL` | No | `https://api.openai.com/v1` | Útil para apuntar a un proveedor compatible distinto. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | El modelo a usar. |
| `FRONTEND_ORIGIN` | No | `http://localhost:3000` | Origen permitido por CORS. |

Se definen como variables de entorno del sistema operativo (no hay archivo `.env` en el
backend — Spring Boot las lee directamente del entorno, ver `application.properties`).

### Frontend (`frontend/`)

Copia `frontend/.env.local.example` a `frontend/.env.local` (ya viene creado con el
valor por defecto):

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8080` | URL del backend. |

## Cómo correrlo localmente

**1. Backend:**

```bash
cd backend
export OPENAI_API_KEY=sk-tu-clave-aqui
mvn spring-boot:run
```

Debería quedar escuchando en `http://localhost:8080`. Probar con:

```bash
curl -X POST http://localhost:8080/api/draft \
  -H "Content-Type: application/json" \
  -d '{"preset":"outreach_email","brief":"invitar a un cliente a renovar su plan","tone":"friendly"}'
```

**2. Frontend** (en otra terminal):

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Cómo desplegar a la nube

- **Backend**: empaquetar con `mvn package` (genera un `.jar` ejecutable en
  `target/`) y desplegar en cualquier plataforma que corra un jar de Java con las
  variables de entorno de la tabla de arriba configuradas — Render, Railway y Fly.io
  tienen planes gratuitos/sencillos para esto.
- **Frontend**: Vercel es la ruta más directa para un proyecto Next.js (detecta el
  framework automáticamente); configurar `NEXT_PUBLIC_API_URL` apuntando a la URL
  pública del backend ya desplegado, y `FRONTEND_ORIGIN` en el backend apuntando a la
  URL pública del frontend.

## Decisiones de diseño

- **`RestClient` en vez de `WebClient`**: no necesitamos programación reactiva para una
  sola llamada HTTP secuencial; `RestClient` (síncrono, incluido en `spring-web`) es
  más simple de razonar y evita una dependencia extra.
- **Un solo endpoint (`POST /api/draft`) para las dos llamadas de IA**: el backend hace
  generación + revisión en una sola petición del frontend. Más simple de manejar en el
  cliente (un solo estado de loading) a costa de un request un poco más lento.
- **H2 en memoria en vez de Postgres**: suficiente para demostrar el historial de
  interacciones sin necesitar Docker ni una base de datos externa. Se reinicia vacía en
  cada reinicio del backend — una limitación conocida y aceptada para el alcance de
  este proyecto.
- **`response_format: json_object` en el prompt revisor**: le pedimos al modelo JSON
  estricto para poder deserializarlo directamente, en vez de parsear texto libre.

## Limitaciones conocidas / fuera de alcance

Decisión deliberada para mantener el proyecto enfocado (ver el roadmap acordado antes
de construir):

- Sin streaming de respuesta en tiempo real.
- Sin Docker/docker-compose ni CI configurado.
- Sin autenticación de usuarios.
- El historial (H2 en memoria) no persiste entre reinicios del backend.
