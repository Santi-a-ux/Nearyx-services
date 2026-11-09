import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function jwtSecret() {
  return required('JWT_SECRET');
}

export const config = {
  port: Number(process.env.PORT ?? 8000),
  databaseUrl: required('DATABASE_URL').replace(/^postgres(ql)?\+asyncpg:/, 'postgresql:'),
  jwt: {
    secret: jwtSecret(),
    algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
  },
};