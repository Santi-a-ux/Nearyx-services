import type { RequestHandler } from 'express';
import { ForbiddenError, MissingCredentialsError } from '../../application/errors';

/** Restringe una ruta a ciertos roles: sin sesión -> 401, rol sin permiso -> 403. */
export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) throw new MissingCredentialsError();
    if (!req.user.role || !roles.includes(req.user.role)) throw new ForbiddenError();
    next();
  };
