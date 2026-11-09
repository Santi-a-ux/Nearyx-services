import { PrismaClient } from '@prisma/client';
import { config } from '../../config/env';

export const prisma = new PrismaClient({ datasourceUrl: config.databaseUrl, log: ['error'] });
