import { FileNotFoundError, ForbiddenError } from '../../errors';
import { canManage } from '../../../domain/policies/ownership';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { IFileRepository } from '../../../domain/repository/IFileRepository';
import type { IFileStorage } from '../../../domain/services/IFileStorage';

export class DeleteFile {
  constructor(
    private readonly files: IFileRepository,
    private readonly storage: IFileStorage,
  ) {}

  async execute(actor: AuthUser, fileId: string): Promise<void> {
    const file = await this.files.findById(fileId);
    if (!file) throw new FileNotFoundError();
    if (!canManage(actor, file.userId)) throw new ForbiddenError('Not authorized to delete this file');
    await this.storage.remove(file.bucketPath);
    await this.files.delete(fileId);
  }
}
