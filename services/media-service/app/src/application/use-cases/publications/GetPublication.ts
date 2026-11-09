import { PublicationNotFoundError } from '../../errors';
import type { Publication } from '../../../domain/models/Publication';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export class GetPublication {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(id: string): Promise<Publication> {
    const publication = await this.publications.findById(id);
    if (!publication) throw new PublicationNotFoundError();
    return publication;
  }
}
