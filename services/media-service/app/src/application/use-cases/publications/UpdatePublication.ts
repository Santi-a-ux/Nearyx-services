import { ForbiddenError, PublicationNotFoundError } from '../../errors';
import { canManage } from '../../../domain/policies/ownership';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { Publication } from '../../../domain/models/Publication';
import type {
  IPublicationRepository,
  PublicationChanges,
} from '../../../domain/repository/IPublicationRepository';

export class UpdatePublication {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(actor: AuthUser, id: string, changes: PublicationChanges): Promise<Publication> {
    const publication = await this.publications.findById(id);
    if (!publication) throw new PublicationNotFoundError();
    if (!canManage(actor, publication.authorId)) {
      throw new ForbiddenError('Not authorized to update this publication');
    }
    return this.publications.update(id, changes);
  }
}
