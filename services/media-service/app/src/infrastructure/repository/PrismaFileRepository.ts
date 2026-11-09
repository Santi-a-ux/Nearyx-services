import type { PrismaClient } from '@prisma/client';
import type { StoredFile } from '../../domain/models/StoredFile';
import type { IFileRepository, NewStoredFile } from '../../domain/repository/IFileRepository';
import { withPrismaErrors } from '../database/withPrismaErrors';
import { toStoredFile } from './mappers';

export class PrismaFileRepository implements IFileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(data: NewStoredFile): Promise<StoredFile> {
    return withPrismaErrors(async () => toStoredFile(await this.prisma.storedFile.create({ data })));
  }

  async findById(id: string): Promise<StoredFile | null> {
    const row = await this.prisma.storedFile.findUnique({ where: { id } });
    return row ? toStoredFile(row) : null;
  }

  async delete(id: string): Promise<void> {
    await withPrismaErrors(() => this.prisma.storedFile.delete({ where: { id } }));
  }
}
