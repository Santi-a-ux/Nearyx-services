import { CommentNotFoundError, ForbiddenError } from '../../errors';
import { canManage } from '../../../domain/policies/ownership';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { ICommentRepository } from '../../../domain/repository/ICommentRepository';

export class DeleteComment {
  constructor(private readonly comments: ICommentRepository) {}

  async execute(actor: AuthUser, postId: string, commentId: string): Promise<void> {
    const comment = await this.comments.findById(commentId);
    if (!comment || comment.postId !== postId) throw new CommentNotFoundError();
    if (!canManage(actor, comment.authorId)) {
      throw new ForbiddenError('Not authorized to delete this comment');
    }
    await this.comments.softDelete(commentId);
  }
}
