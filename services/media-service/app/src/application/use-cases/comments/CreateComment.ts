import { ForbiddenError, PublicationNotFoundError, ValidationError } from '../../errors';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { Comment } from '../../../domain/models/Comment';
import type { ICommentRepository } from '../../../domain/repository/ICommentRepository';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export interface CreateCommentInput {
  /** Opcional: si viene en el body debe coincidir con el de la URL. */
  postId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
}

export class CreateComment {
  constructor(
    private readonly comments: ICommentRepository,
    private readonly publications: IPublicationRepository,
  ) {}

  async execute(actor: AuthUser, postId: string, input: CreateCommentInput): Promise<Comment> {
    if (input.postId !== undefined && input.postId !== postId) {
      throw new ValidationError('post_id in the body does not match the URL');
    }
    if (input.authorId !== actor.userId) {
      throw new ForbiddenError('Comment author does not match authenticated user');
    }
    if (!(await this.publications.findById(postId))) throw new PublicationNotFoundError();

    return this.comments.create({
      postId,
      authorId: input.authorId,
      authorName: input.authorName,
      authorAvatar: input.authorAvatar ?? null,
      content: input.content,
    });
  }
}
