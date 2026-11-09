import { Router, type RequestHandler } from 'express';
import {
  commentParamsSchema,
  createCommentSchema,
  postIdParamSchema,
} from '../../infrastructure/dtos/comment.dto';
import type { CommentController } from '../controllers/CommentController';
import { validate } from '../middlewares/validate';

export function createCommentRouter(
  controller: CommentController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.get('/posts/:post_id/comments', validate('params', postIdParamSchema), controller.list);
  router.post(
    '/posts/:post_id/comments',
    authenticate,
    validate('params', postIdParamSchema),
    validate('body', createCommentSchema),
    controller.create,
  );
  router.delete(
    '/posts/:post_id/comments/:comment_id',
    authenticate,
    validate('params', commentParamsSchema),
    controller.remove,
  );

  return router;
}
