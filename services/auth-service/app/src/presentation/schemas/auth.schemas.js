import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  role: z.enum(['student', 'tutor']),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshSchema = z.object({ refresh_token: z.string() });

export const verifyTokenSchema = z.object({ token: z.string() });
