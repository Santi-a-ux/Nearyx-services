import pg from 'pg';
import { config } from '../../config/env.js';

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: Number(process.env.PG_POOL_MAX ?? 5),
});