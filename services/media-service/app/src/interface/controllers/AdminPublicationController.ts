import type { Request, Response } from 'express';
import type { ListPublicationsAsAdmin } from '../../application/use-cases/publications/ListPublicationsAsAdmin';
import type { RestorePublication } from '../../application/use-cases/publications/RestorePublication';
import {
  toPublicationDto,
  type ListPublicationsAdminQuery,
  type PublicationIdParams,
} from '../../infrastructure/dtos/publication.dto';
import { currentUser } from '../middlewares/authenticate';
import { getValidated } from '../middlewares/validate';

export interface AdminPublicationUseCases {
  list: ListPublicationsAsAdmin;
  restore: RestorePublication;
}

export class AdminPublicationController {
  constructor(private readonly useCases: AdminPublicationUseCases) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = getValidated<ListPublicationsAdminQuery>(req, 'query');
    const result = await this.useCases.list.execute({
      page: query.page,
      limit: query.limit,
      state: query.state,
      search: query.search,
      authorId: query.author_id,
      authorRole: query.author_role,
    });
    res.json({ data: result.data.map(toPublicationDto), pagination: result.pagination });
  };

  restore = async (req: Request, res: Response): Promise<void> => {
    const { publication_id } = getValidated<PublicationIdParams>(req, 'params');
    res.json(toPublicationDto(await this.useCases.restore.execute(currentUser(req), publication_id)));
  };
}
