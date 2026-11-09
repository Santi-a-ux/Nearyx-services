import { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../application/errors';

/** Traduce los errores conocidos de Prisma a errores de aplicación (404 / 409) en vez de dejarlos como 500. */
export async function withPrismaErrors<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new NotFoundError('Record not found');
      if (error.code === 'P2002') throw new ConflictError('A record with these values already exists');
      if (error.code === 'P2003') throw new ConflictError('A related record does not exist');
    }
    throw error;
  }
}
