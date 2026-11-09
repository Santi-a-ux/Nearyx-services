import { buildPagination, type PaginatedResult } from '../../common/pagination';
import type { Publication } from '../../../domain/models/Publication';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export interface ListPublicationsInput {
  page: number;
  limit: number;
  search?: string;
  authorId?: string;
  authorRole?: string;
}

/** Listado público: solo publicaciones activas. */
export class ListPublications {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(input: ListPublicationsInput): Promise<PaginatedResult<Publication>> {
    const { page, limit, ...filters } = input;
    const { items, total } = await this.publications.list({ ...filters, state: 'active' }, page, limit);
    return { data: items, pagination: buildPagination(total, page, limit) };
  }
}
