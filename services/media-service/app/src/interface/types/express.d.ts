import type { AuthUser } from '../../domain/models/AuthUser';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
      validated?: Partial<Record<'body' | 'params' | 'query', unknown>>;
    }
  }
}

export {};
