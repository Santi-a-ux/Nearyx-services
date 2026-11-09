-- Ejecutar UNA vez en Supabase -> SQL Editor, ANTES de desplegar la versión TypeScript.
-- Es seguro con la versión vieja en producción: solo agrega columnas con valor por defecto.
BEGIN;

ALTER TABLE feed.posts
  ADD COLUMN IF NOT EXISTS state VARCHAR(20) NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE feed.comments
  ADD COLUMN IF NOT EXISTS state VARCHAR(20) NOT NULL DEFAULT 'active';

-- Comentarios huérfanos (sin post) impedirían crear la llave foránea.
DELETE FROM feed.comments c
WHERE NOT EXISTS (SELECT 1 FROM feed.posts p WHERE p.id = c.post_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comments_post_id_fkey') THEN
    ALTER TABLE feed.comments
      ADD CONSTRAINT comments_post_id_fkey
      FOREIGN KEY (post_id) REFERENCES feed.posts(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_posts_state_created ON feed.posts (state, created_at DESC);

COMMIT;
