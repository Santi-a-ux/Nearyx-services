import { Router, type RequestHandler } from 'express';
import {
  listPublicationsAdminQuerySchema,
  publicationIdParamSchema,
} from '../../infrastructure/dtos/publication.dto';
import type { AdminPublicationController } from '../controllers/AdminPublicationController';
import { requireRole } from '../middlewares/requireRole';
import { validate } from '../middlewares/validate';

/** Rutas de administración: sin token -> 401, rol distinto de admin -> 403. */
export function createAdminRouter(
  controller: AdminPublicationController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.use(authenticate, requireRole('admin'));

  router.get('/posts', validate('query', listPublicationsAdminQuerySchema), controller.list);
  router.patch(
    '/posts/:publication_id/restore',
    validate('params', publicationIdParamSchema),
    controller.restore,
  );

  return router;
}
