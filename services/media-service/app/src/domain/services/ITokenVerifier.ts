export interface TokenClaims {
  readonly sub: string | null;
  readonly role: string | null;
}

export interface ITokenVerifier {
  /** Devuelve las claims, o null si el token es inválido, expiró o no es de acceso. */
  verify(token: string): TokenClaims | null;
}
