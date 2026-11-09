import type { Request, Response } from 'express';
import type { CreateComment } from '../../application/use-cases/comments/CreateComment';
import type { DeleteComment } from '../../application/use-cases/comments/DeleteComment';
import type { ListComments } from '../../application/use-cases/comments/ListComments';
import {
  toCommentDto,
  type CommentParams,
  type CreateCommentBody,
  type PostIdParams,
} from '../../infrastructure/dtos/comment.dto';
import { currentUser } from '../middlewares/authenticate';
import { getValidated } from '../middlewares/validate';

export interface CommentUseCases {
  list: ListComments;
  create: CreateComment;
  remove: DeleteComment;
}

export class CommentController {
  constructor(private readonly useCases: CommentUseCases) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { post_id } = getValidated<PostIdParams>(req, 'params');
    const comments = await this.useCases.list.execute(post_id);
    res.json({ comments: comments.map(toCommentDto), total: comments.length });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const actor = currentUser(req);
    const { post_id } = getValidated<PostIdParams>(req, 'params');
    const body = getValidated<CreateCommentBody>(req, 'body');
    const comment = await this.useCases.create.execute(actor, post_id, {
      postId: body.post_id,
      authorId: body.author_id ?? actor.userId,
      authorName: body.author_name,
      authorAvatar: body.author_avatar,
      content: body.content,
    });
    res.status(201).json(toCommentDto(comment));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { post_id, comment_id } = getValidated<CommentParams>(req, 'params');
    await this.useCases.remove.execute(currentUser(req), post_id, comment_id);
    res.status(204).send();
  };
}
