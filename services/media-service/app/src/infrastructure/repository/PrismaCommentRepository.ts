import type { PrismaClient } from '@prisma/client';
import type { Comment } from '../../domain/models/Comment';
import type { ICommentRepository, NewComment } from '../../domain/repository/ICommentRepository';
import { withPrismaErrors } from '../database/withPrismaErrors';
import { toComment } from './mappers';

export class PrismaCommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByPost(postId: string): Promise<Comment[]> {
    const rows = await this.prisma.comment.findMany({
      where: { postId, state: 'active' },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    return rows.map(toComment);
  }

  async findById(id: string): Promise<Comment | null> {
    const row = await this.prisma.comment.findFirst({ where: { id, state: 'active' } });
    return row ? toComment(row) : null;
  }

  create(data: NewComment): Promise<Comment> {
    return withPrismaErrors(async () => toComment(await this.prisma.comment.create({ data })));
  }

  async softDelete(id: string): Promise<void> {
    await withPrismaErrors(() =>
      this.prisma.comment.update({ where: { id }, data: { state: 'deleted' } }),
    );
  }
}
