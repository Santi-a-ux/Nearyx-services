# Nearyx — Backend

API de microservicios para conectar estudiantes con expertos en Medellín: feed, chat, reservas y mapa.

## Despliegue

| | Link |
|---|---|
| API (gateway) | https://nearyx-gateway.onrender.com |
| Frontend | https://nearyx-working.onrender.com |
| Repositorio frontend | https://github.com/Santi-a-ux/Nearyx-front |

| Servicio | URL |
|---|---|
| gateway | https://nearyx-gateway.onrender.com |
| auth-service | https://nearyx-auth.onrender.com |
| user-service | https://nearyx-users.onrender.com |
| media-service | https://nearyx-media.onrender.com |
| booking-service | https://nearyx-booking.onrender.com |
| chat-service | https://nearyx-chat.onrender.com |
| geo-service | https://nearyx-geo.onrender.com |

El tutor-service (por su tamaño no cabe en el plan gratuito de Render) se ejecuta con Docker y se expone al gateway mediante un túnel con dominio fijo.

Los servicios corren en Render (plan gratuito) y se duermen tras 15 minutos sin tráfico. Para despertarlos todos antes de una demo:

```bash
curl "https://nearyx-gateway.onrender.com/wake?key=<WAKE_KEY>"
```

La primera vez tarda cerca de un minuto. Los pasos completos de despliegue están en [`DEPLOY_RENDER.md`](DEPLOY_RENDER.md).

## Stack

Node.js 20 · Express 5 · TypeScript (media-service) · Prisma · PostgreSQL (Supabase) · Supabase Storage · JWT + bcrypt · Redis (Upstash) · Docker

## Arquitectura

Cada servicio sigue las capas `domain → application → infrastructure → interface` (en media-service con TypeScript; en los demás con los mismos nombres de capa en JavaScript).

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| gateway | 8000 | Enrutamiento, CORS y despertar de servicios (`/wake`) |
| auth-service | 8001 | Registro, login, JWT |
| user-service | 8002 | Perfiles |
| tutor-service | 8003 | Expertos, verificación y búsqueda semántica |
| geo-service | 8004 | Geocodificación |
| chat-service | 8005 | Mensajería en tiempo real |
| media-service (TS) | 8006 | Publicaciones, comentarios, imágenes |
| booking-service | 8007 | Reservas |

Cada servicio valida el JWT por su cuenta; todos comparten el mismo `JWT_SECRET`.

**Servicio para la rúbrica:** `media-service` (Express + TypeScript + Prisma). Su README, con endpoints, base de datos y variables, está en [`services/media-service/app/README.md`](services/media-service/app/README.md).

## Instalación

### Un servicio (desarrollo)

```bash
git clone https://github.com/Santi-a-ux/Nearyx-services.git
cd Nearyx-services/services/auth-service/app
cp .env.example .env      # completa los valores
npm install
npm run seed              # crea los usuarios de prueba
npm run dev
```

Repite `cp .env.example .env`, `npm install` y `npm run dev` en cada servicio. En media-service: `npx prisma generate` y `npm run db:seed`.

### Con Docker Compose (local)

```bash
cp .env.example .env      # completa los valores
docker compose up -d --build
```

Por defecto levanta Redis, tutor-service, chat-service y el gateway; el resto de servicios se usa desde Render. El frontend es opcional: `docker compose --profile frontend up -d --build`.

## Variables de entorno

La plantilla completa está en `.env.example` (y uno por servicio). El `.env` real nunca se sube.

| Variable | Servicio | Descripción |
|---|---|---|
| `DATABASE_URL` | todos | Conexión PostgreSQL (pooler de Supabase, puerto 6543) |
| `JWT_SECRET` | todos | Mismo valor en todos los servicios; obligatorio en producción, sin valor por defecto |
| `JWT_ALGORITHM` | todos | `HS256` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | auth | Vigencia del token |
| `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET` | media, user | Subida de imágenes a Supabase Storage |
| `REDIS_URL` | chat | Redis para el chat en tiempo real |
| `EMBEDDING_DTYPE` | tutor | `q8`; debe coincidir con los embeddings guardados |
| `*_SERVICE_URL`, `CORS_ORIGINS`, `WAKE_KEY` | gateway | URLs de los servicios, orígenes permitidos y clave de `/wake` |

## Credenciales de prueba (creadas por el seed)

| Rol | Correo | Contraseña |
|---|---|---|
| admin | admin@nearyx.dev | Admin12345! |
| student | estudiante@nearyx.dev | Estudiante12345! |
| tutor | experto@nearyx.dev | Experto12345! |

El admin no se registra desde la API: solo lo crea el seed.

## Pruebas

```bash
cd services/media-service/app && npm test
```

## Reparto del trabajo

Proyecto realizado de forma individual.

| Integrante | Qué construyó |
|---|---|
| Santiago Gutiérrez Correa | Todo el backend: gateway, auth-service (seed y JWT), media-service (imágenes y pruebas), demás servicios y despliegue |
