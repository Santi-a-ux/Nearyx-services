# Nearyx — Backend

API de microservicios para conectar estudiantes con expertos en Medellín (feed, chat, reservas, mapa).

## Despliegue
| | Link |
|---|---|
| API (gateway) | https://TU-GATEWAY.onrender.com |
| Frontend | https://TU-FRONT.vercel.app |
| Repositorio frontend | https://github.com/TU-USUARIO/TU-FRONT |

## Capturas
Guarda las imágenes en `docs/screenshots/`.

| Swagger / Postman | Base de datos (Supabase) |
|---|---|
| ![API](docs/screenshots/api.png) | ![DB](docs/screenshots/db.png) |

## Stack
Node.js 20 · Express 5 · TypeScript (media-service) · Prisma · PostgreSQL (Supabase) · Supabase Storage · JWT + bcrypt · Redis · Docker

## Arquitectura
Cada servicio sigue las capas `domain → application → infrastructure → interface`.

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| gateway | 8000 | Enrutamiento y verificación de token |
| auth-service | 8001 | Registro, login, JWT |
| user-service | 8002 | Perfiles |
| tutor-service | 8003 | Expertos y verificación |
| geo-service | 8004 | Geocodificación |
| chat-service | 8005 | Mensajería en tiempo real |
| media-service (TS) | 8006 | Publicaciones, comentarios, imágenes |
| booking-service | 8007 | Reservas |

## Instalación
```bash
git clone https://github.com/TU-USUARIO/TU-BACKEND.git
cd TU-BACKEND/services/auth-service/app
cp .env.example .env      # completa los valores
npm install
npm run seed              # crea los usuarios de prueba
npm run dev
```
Repite `cp .env.example .env`, `npm install` y `npm run dev` en cada servicio. Para media-service: `npx prisma generate` y `npm run db:seed`.

## Variables de entorno
| Variable | Servicio | Descripción |
|---|---|---|
| `DATABASE_URL` | todos | Conexión PostgreSQL |
| `JWT_SECRET` | todos | Mismo valor en todos los servicios, sin valor por defecto |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | auth | Vigencia del token (30) |
| `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET` | media, user | Subida de imágenes |

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
| Integrante | Qué construyó |
|---|---|
| Nombre 1 | auth-service, seed, JWT |
| Nombre 2 | media-service, imágenes, pruebas |
| Nombre 3 | gateway, despliegue |
