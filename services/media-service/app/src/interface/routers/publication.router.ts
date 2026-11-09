import { Router, type RequestHandler } from 'express';
import {
  createPublicationSchema,
  listPublicationsQuerySchema,
  publicationIdParamSchema,
  updatePublicationSchema,
} from '../../infrastructure/dtos/publication.dto';
import type { PublicationController } from '../controllers/PublicationController';
import { validate } from '../middlewares/validate';

export function createPublicationRouter(
  controller: PublicationController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  const idParam = validate('params', publicationIdParamSchema);

  router.get('/posts', validate('query', listPublicationsQuerySchema), controller.list);
  router.post('/posts', authenticate, validate('body', createPublicationSchema), controller.create);
  router.get('/posts/:publication_id', idParam, controller.get);
  router.put(
    '/posts/:publication_id',
    authenticate,
    idParam,
    validate('body', updatePublicationSchema),
    controller.update,
  );
  router.delete('/posts/:publication_id', authenticate, idParam, controller.remove);

  return router;
}
