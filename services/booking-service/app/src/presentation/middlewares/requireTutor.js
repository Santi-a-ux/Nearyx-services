import { ForbiddenRoleError } from '../../domain/errors/index.js';

export const requireTutor = (req, res, next) => {
  if (req.user?.role !== 'tutor') throw new ForbiddenRoleError();
  next();
};
