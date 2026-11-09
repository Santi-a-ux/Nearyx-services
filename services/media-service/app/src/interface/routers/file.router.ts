import { Router, type RequestHandler } from 'express';
import { fileIdParamSchema } from '../../infrastructure/dtos/file.dto';
import type { FileController } from '../controllers/FileController';
import { uploadFile } from '../middlewares/uploadFile';
import { validate } from '../middlewares/validate';

/** Se monta DESPUÉS de posts y admin: "/:file_id" no debe tapar "/posts". */
export function createFileRouter(controller: FileController, authenticate: RequestHandler): Router {
  const router = Router();
  const idParam = validate('params', fileIdParamSchema);

  router.post('/upload', authenticate, uploadFile, controller.upload);
  router.get(/^\/files\/(.+)$/, controller.redirectToContent);
  router.get('/:file_id', idParam, controller.getMetadata);
  router.delete('/:file_id', authenticate, idParam, controller.remove);

  return router;
}
