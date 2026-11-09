import { FileNotFoundError } from '../../errors';
import type { StoredFile } from '../../../domain/models/StoredFile';
import type { IFileRepository } from '../../../domain/repository/IFileRepository';

export class GetFileMetadata {
  constructor(private readonly files: IFileRepository) {}

  async execute(fileId: string): Promise<StoredFile> {
    const file = await this.files.findById(fileId);
    if (!file) throw new FileNotFoundError();
    return file;
  }
}
