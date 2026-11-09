import type { Request, RequestHandler } from 'express';
import { MissingCredentialsError } from '../../application/errors';
import type { AuthenticateUser } from '../../application/use-cases/auth/AuthenticateUser';
import type { AuthUser } from '../../domain/models/AuthUser';

/** Middleware centralizado: exige "Authorization: Bearer <JWT>" y deja el usuario en req.user. */
export const createAuthenticate =
  (authenticateUser: AuthenticateUser): RequestHandler =>
  (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new MissingCredentialsError();
    req.user = authenticateUser.execute(header.slice('Bearer '.length).trim());
    next();
  };

export function currentUser(req: Request): AuthUser {
  if (!req.user) throw new MissingCredentialsError();
  return req.user;
}
