import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { pool } from '../src/infrastructure/database/pool.js';
import { initSchema } from '../src/infrastructure/database/initSchema.js';

const USERS = [
  { email: 'admin@nearyx.dev', password: 'Admin12345!', role: 'admin' },
  { email: 'estudiante@nearyx.dev', password: 'Estudiante12345!', role: 'student' },
  { email: 'experto@nearyx.dev', password: 'Experto12345!', role: 'tutor' },
];

await initSchema();
for (const { email, password, role } of USERS) {
  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO authe.users (id, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, TRUE)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = TRUE, updated_at = now()`,
    [randomUUID(), email, hash, role],
  );
  process.stdout.write(`OK ${role}: ${email}\n`);
}
await pool.end();
