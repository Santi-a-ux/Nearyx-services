import { PublicationNotFoundError } from '../../errors';
import type { Comment } from '../../../domain/models/Comment';
import type { ICommentRepository } from '../../../domain/repository/ICommentRepository';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export class ListComments {
  constructor(
    private readonly comments: ICommentRepository,
    private readonly publications: IPublicationRepository,
  ) {}

  async execute(postId: string): Promise<Comment[]> {
    if (!(await this.publications.findById(postId))) throw new PublicationNotFoundError();
    return this.comments.listByPost(postId);
  }
}
