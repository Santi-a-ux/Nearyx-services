import type { Prisma, PrismaClient } from '@prisma/client';
import type { Publication } from '../../domain/models/Publication';
import type {
  IPublicationRepository,
  NewPublication,
  PagedItems,
  PublicationChanges,
  PublicationFilters,
} from '../../domain/repository/IPublicationRepository';
import { withPrismaErrors } from '../database/withPrismaErrors';
import { toPublication } from './mappers';

export class PrismaPublicationRepository implements IPublicationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(
    filters: PublicationFilters,
    page: number,
    limit: number,
  ): Promise<PagedItems<Publication>> {
    const where: Prisma.PublicationWhereInput = {
      ...(filters.state === 'all' ? {} : { state: filters.state }),
      ...(filters.authorId ? { authorId: filters.authorId } : {}),
      ...(filters.authorRole ? { authorRole: filters.authorRole } : {}),
      ...(filters.search ? { content: { contains: filters.search, mode: 'insensitive' } } : {}),
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.publication.count({ where }),
      this.prisma.publication.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { items: rows.map(toPublication), total };
  }

  async findById(id: string, options?: { includeDeleted?: boolean }): Promise<Publication | null> {
    const row = await this.prisma.publication.findFirst({
      where: { id, ...(options?.includeDeleted ? {} : { state: 'active' }) },
    });
    return row ? toPublication(row) : null;
  }

  create(data: NewPublication): Promise<Publication> {
    return withPrismaErrors(async () => toPublication(await this.prisma.publication.create({ data })));
  }

  update(id: string, changes: PublicationChanges): Promise<Publication> {
    return withPrismaErrors(async () =>
      toPublication(await this.prisma.publication.update({ where: { id }, data: { ...changes } })),
    );
  }

  async softDelete(id: string): Promise<void> {
    await withPrismaErrors(() =>
      this.prisma.publication.update({ where: { id }, data: { state: 'deleted' } }),
    );
  }

  restore(id: string): Promise<Publication> {
    return withPrismaErrors(async () =>
      toPublication(await this.prisma.publication.update({ where: { id }, data: { state: 'active' } })),
    );
  }
}
