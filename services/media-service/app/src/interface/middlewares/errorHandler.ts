import type { NextFunction, Request, Response } from 'express';
import { AppError, type ErrorCode } from '../../application/errors';
import { logger } from '../../config/logger';

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  STORAGE_FAILED: 502,
  STORAGE_UNAVAILABLE: 503,
};

const isInvalidJson = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { type?: unknown }).type === 'entity.parse.failed';

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ detail: 'Not Found' });
};

/** Último middleware: nunca expone el stack trace al cliente (solo queda en el log del servidor). */
export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    if (error.code === 'UNAUTHORIZED') res.set('WWW-Authenticate', 'Bearer');
    res.status(STATUS_BY_CODE[error.code]).json({ detail: error.message });
    return;
  }
  if (isInvalidJson(error)) {
    res.status(400).json({ detail: 'Request body is not valid JSON' });
    return;
  }
  logger.error(`${req.method} ${req.originalUrl} failed`, error);
  res.status(500).json({ detail: 'Internal Server Error' });
}
