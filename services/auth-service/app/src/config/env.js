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
  get databaseUrl() {
    return required('DATABASE_URL').replace(/^postgres(ql)?\+asyncpg:/, 'postgresql:');
  },
  jwt: {
    secret: jwtSecret(),
    algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
    accessExpireMinutes: Number(process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES ?? 30),
    refreshExpireDays: Number(process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS ?? 7),
  },
};
