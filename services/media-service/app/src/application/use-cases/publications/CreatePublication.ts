import { ForbiddenError } from '../../errors';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { Publication } from '../../../domain/models/Publication';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export interface CreatePublicationInput {
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  authorRole?: string | null;
  content: string;
  imageUrl?: string | null;
}

export class CreatePublication {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(actor: AuthUser, input: CreatePublicationInput): Promise<Publication> {
    if (input.authorId !== actor.userId) {
      throw new ForbiddenError('Author does not match authenticated user');
    }
    return this.publications.create({
      authorId: input.authorId,
      authorName: input.authorName,
      authorAvatar: input.authorAvatar ?? null,
      authorRole: input.authorRole ?? null,
      content: input.content,
      imageUrl: input.imageUrl ?? null,
    });
  }
}
