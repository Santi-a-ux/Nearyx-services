import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8006),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_ALGORITHM: z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_KEY: z.string().min(1).optional(),
  SUPABASE_BUCKET: z.string().min(1).default('tempoimages'),
  UPLOAD_MAX_MB: z.coerce.number().positive().default(25),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${details}`);
}
const env = parsed.data;

/**
 * Acepta la URL con prefijo "postgresql+asyncpg://" (heredada del backend en Python) y, si apunta al
 * pooler de Supabase (puerto 6543), agrega los parámetros que Prisma necesita para funcionar con PgBouncer.
 */
export function normalizeDatabaseUrl(rawUrl: string): string {
  const url = new URL(rawUrl.replace(/^postgres(ql)?\+asyncpg:/, 'postgresql:'));
  if (url.port === '6543' && !url.searchParams.has('pgbouncer')) {
    url.searchParams.set('pgbouncer', 'true');
  }
  if (!url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', '3');
  }
  return url.toString();
}

export const config = {
  isProduction: env.NODE_ENV === 'production',
  port: env.PORT,
  databaseUrl: normalizeDatabaseUrl(env.DATABASE_URL),
  jwt: { secret: env.JWT_SECRET, algorithm: env.JWT_ALGORITHM },
  supabase: { url: env.SUPABASE_URL ?? null, key: env.SUPABASE_KEY ?? null, bucket: env.SUPABASE_BUCKET },
  maxUploadBytes: env.UPLOAD_MAX_MB * 1024 * 1024,
} as const;
