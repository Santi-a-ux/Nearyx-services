# Nearyx · Media Service

Publicaciones (feed), comentarios y archivos de Nearyx.
**Express 5 + TypeScript + Prisma + PostgreSQL (Supabase)**, con las cuatro capas de la arquitectura:

```
src/
├── domain/          modelos, políticas y puertos (interfaces de repositorios y servicios)
├── application/     casos de uso (reglas de negocio) y errores de aplicación
├── infrastructure/  repository/ (Prisma), services/ (JWT, Supabase Storage), dtos/ (zod + mapeos)
└── interface/       controllers/, routers/, middlewares/
```

Las reglas de negocio viven en `application/`; los casos de uso dependen de interfaces, no de Prisma.

## Cómo correrlo

```bash
cp .env.example .env        # completa JWT_SECRET, DATABASE_URL, DIRECT_URL y SUPABASE_*
npm install
# Solo la primera vez, en Supabase -> SQL Editor: ejecutar prisma/manual/001_prepare_db.sql
npm run dev                 # desarrollo (recarga automática)
npm run build && npm start  # producción
npm test                    # pruebas de casos de uso y middlewares
npm run lint
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Pooler de Supabase (puerto 6543). Se agregan `pgbouncer=true` y `connection_limit=3` si faltan. |
| `DIRECT_URL` | Sí* | Pooler en modo sesión (puerto 5432). Solo lo usa la CLI de Prisma (`db push`). |
| `JWT_SECRET` | Sí | El mismo valor que el auth-service. Sin valor por defecto. |
| `JWT_ALGORITHM` | No | `HS256` por defecto. |
| `SUPABASE_URL`, `SUPABASE_KEY` | Sí | Para subir imágenes. Sin ellas el upload responde 503. |
| `SUPABASE_BUCKET` | No | `tempoimages` por defecto. |
| `PORT` | No | `8006` por defecto (Render lo define solo). |
| `NODE_ENV` | No | `production` en Render. |
| `UPLOAD_MAX_MB` | No | Tamaño máximo por archivo, 25 por defecto. |

## Endpoints (todos bajo `/media`, más `GET /health`)

Los errores responden `{ "detail": "mensaje" }` con el código correcto (400, 401, 403, 404, 409).

**Publicaciones**
- `GET /media/posts?page=1&limit=10&search=&author_id=&author_role=` (público) → `{ data, pagination: { total, currentPage, limit, totalPages } }`
- `POST /media/posts` (token) → 201
- `GET /media/posts/:id` (público)
- `PUT /media/posts/:id` (autor o admin)
- `DELETE /media/posts/:id` (autor o admin) → 204, **borrado lógico** (`state = 'deleted'`)

**Comentarios**
- `GET /media/posts/:post_id/comments` (público)
- `POST /media/posts/:post_id/comments` (token) → 201
- `DELETE /media/posts/:post_id/comments/:comment_id` (autor o admin) → 204, borrado lógico

**Archivos** (Supabase Storage)
- `POST /media/upload` (token, multipart: `file` + `type` = `avatar` | `post` | `document`) → 201 `{ url, file_id, file_type, file_size }`
- `GET /media/files/<ruta>` redirige a la URL pública · `GET /media/:file_id` metadatos · `DELETE /media/:file_id` (dueño o admin)

**Administración** (token + rol `admin`; sin token 401, otro rol 403)
- `GET /media/admin/posts?state=all|active|deleted` · `PATCH /media/admin/posts/:id/restore`

## Base de datos

Tablas: `feed.posts` → `feed.comments` (llave foránea `post_id`, `ON DELETE CASCADE`) y `media.files`.
El esquema de Prisma está en `prisma/schema.prisma`; los cambios sobre la base existente están en
`prisma/manual/001_prepare_db.sql` (idempotente). `npm run db:seed` crea una publicación y un comentario de ejemplo.

## Reparto del trabajo

| Integrante | Qué construyó |
|---|---|
| _Nombre 1_ | _…_ |
| _Nombre 2_ | _…_ |
| _Nombre 3_ | _…_ |
