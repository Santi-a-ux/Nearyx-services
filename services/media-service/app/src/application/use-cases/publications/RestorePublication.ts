import { ForbiddenError, PublicationNotFoundError } from '../../errors';
import { isAdmin } from '../../../domain/policies/ownership';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { Publication } from '../../../domain/models/Publication';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export class RestorePublication {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(actor: AuthUser, id: string): Promise<Publication> {
    if (!isAdmin(actor)) throw new ForbiddenError('Only administrators can restore publications');
    const publication = await this.publications.findById(id, { includeDeleted: true });
    if (!publication) throw new PublicationNotFoundError();
    return this.publications.restore(id);
  }
}
