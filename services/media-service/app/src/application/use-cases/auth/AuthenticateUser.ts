import { InvalidTokenError } from '../../errors';
import { isUuid } from '../../../domain/identifiers';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { ITokenVerifier } from '../../../domain/services/ITokenVerifier';

/** Resuelve quién llama a partir del JWT que emite el auth-service (sin consultar la base de datos). */
export class AuthenticateUser {
  constructor(private readonly tokenVerifier: ITokenVerifier) {}

  execute(token: string): AuthUser {
    const claims = this.tokenVerifier.verify(token);
    if (!claims) throw new InvalidTokenError();
    if (!isUuid(claims.sub)) throw new InvalidTokenError('User ID is invalid');
    return { userId: claims.sub.toLowerCase(), role: claims.role };
  }
}
