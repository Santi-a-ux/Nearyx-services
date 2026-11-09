import { buildPagination, type PaginatedResult } from '../../common/pagination';
import type { Publication } from '../../../domain/models/Publication';
import type { RecordState } from '../../../domain/models/RecordState';
import type { IPublicationRepository } from '../../../domain/repository/IPublicationRepository';

export interface ListPublicationsAsAdminInput {
  page: number;
  limit: number;
  state: RecordState | 'all';
  search?: string;
  authorId?: string;
  authorRole?: string;
}

/** Listado de administración: incluye las publicaciones eliminadas (borrado lógico). */
export class ListPublicationsAsAdmin {
  constructor(private readonly publications: IPublicationRepository) {}

  async execute(input: ListPublicationsAsAdminInput): Promise<PaginatedResult<Publication>> {
    const { page, limit, ...filters } = input;
    const { items, total } = await this.publications.list(filters, page, limit);
    return { data: items, pagination: buildPagination(total, page, limit) };
  }
}
