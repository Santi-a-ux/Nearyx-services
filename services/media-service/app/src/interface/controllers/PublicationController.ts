import type { Request, Response } from 'express';
import type { CreatePublication } from '../../application/use-cases/publications/CreatePublication';
import type { DeletePublication } from '../../application/use-cases/publications/DeletePublication';
import type { GetPublication } from '../../application/use-cases/publications/GetPublication';
import type { ListPublications } from '../../application/use-cases/publications/ListPublications';
import type { UpdatePublication } from '../../application/use-cases/publications/UpdatePublication';
import {
  toPublicationChanges,
  toPublicationDto,
  type CreatePublicationBody,
  type ListPublicationsQuery,
  type PublicationIdParams,
  type UpdatePublicationBody,
} from '../../infrastructure/dtos/publication.dto';
import { currentUser } from '../middlewares/authenticate';
import { getValidated } from '../middlewares/validate';

export interface PublicationUseCases {
  list: ListPublications;
  get: GetPublication;
  create: CreatePublication;
  update: UpdatePublication;
  remove: DeletePublication;
}

export class PublicationController {
  constructor(private readonly useCases: PublicationUseCases) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = getValidated<ListPublicationsQuery>(req, 'query');
    const result = await this.useCases.list.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      authorId: query.author_id,
      authorRole: query.author_role,
    });
    res.json({ data: result.data.map(toPublicationDto), pagination: result.pagination });
  };

  get = async (req: Request, res: Response): Promise<void> => {
    const { publication_id } = getValidated<PublicationIdParams>(req, 'params');
    res.json(toPublicationDto(await this.useCases.get.execute(publication_id)));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const actor = currentUser(req);
    const body = getValidated<CreatePublicationBody>(req, 'body');
    const publication = await this.useCases.create.execute(actor, {
      authorId: body.author_id ?? actor.userId,
      authorName: body.author_name,
      authorAvatar: body.author_avatar,
      authorRole: body.author_role,
      content: body.content,
      imageUrl: body.image_url,
    });
    res.status(201).json(toPublicationDto(publication));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { publication_id } = getValidated<PublicationIdParams>(req, 'params');
    const body = getValidated<UpdatePublicationBody>(req, 'body');
    const publication = await this.useCases.update.execute(
      currentUser(req),
      publication_id,
      toPublicationChanges(body),
    );
    res.json(toPublicationDto(publication));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { publication_id } = getValidated<PublicationIdParams>(req, 'params');
    await this.useCases.remove.execute(currentUser(req), publication_id);
    res.status(204).send();
  };
}
