import jwt, { type Algorithm } from 'jsonwebtoken';
import type { ITokenVerifier, TokenClaims } from '../../domain/services/ITokenVerifier';

export class JwtTokenVerifier implements ITokenVerifier {
  constructor(
    private readonly secret: string,
    private readonly algorithm: Algorithm,
  ) {}

  verify(token: string): TokenClaims | null {
    try {
      const payload = jwt.verify(token, this.secret, { algorithms: [this.algorithm] });
      if (typeof payload === 'string') return null;
      // Un refresh token no sirve para llamar a la API.
      if (payload.type === 'refresh') return null;
      return {
        sub: typeof payload.sub === 'string' ? payload.sub : null,
        role: typeof payload.role === 'string' ? payload.role : null,
      };
    } catch {
      return null;
    }
  }
}
