import { ForbiddenError, PublicationNotFoundError } from '../../errors';
import { canManage } from '../../../domain/policies/ownership';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

/** Borrado lógico: el autor o un administrador marcan la publicación como "deleted". */
export class DeletePublication {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(actor: AuthUser, id: string): Promise<void> {
    const publication = await this.publications.findById(id);
    if (!publication) throw new PublicationNotFoundError();
    if (!canManage(actor, publication.authorId)) {
      throw new ForbiddenError('Not authorized to delete this publication');
    }
    await this.publications.softDelete(id);
  }
}
