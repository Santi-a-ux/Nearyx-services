import type { AuthUser } from '../models/AuthUser';

export const ADMIN_ROLE = 'admin';

export const isAdmin = (user: AuthUser): boolean => user.role === ADMIN_ROLE;

/** El dueño del recurso o un administrador pueden modificarlo. */
export const canManage = (user: AuthUser, ownerId: string): boolean =>
  isAdmin(user) || user.userId === ownerId;
