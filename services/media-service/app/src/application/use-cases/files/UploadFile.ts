import { FILE_TYPES, isAllowedMimeType, isFileType } from '../../../domain/policies/uploadPolicy';
import { ValidationError } from '../../errors';
import type { AuthUser } from '../../../domain/models/AuthUser';
import type { StoredFile } from '../../../domain/models/StoredFile';
import type { UploadedFile } from '../../../domain/models/UploadedFile';
import type { IFileRepository } from '../../../domain/repository/IFileRepository';
import type { IFileStorage } from '../../../domain/services/IFileStorage';

export interface UploadFileInput {
  file: UploadedFile;
  type: string;
}

export class UploadFile {
  constructor(
    private readonly files: IFileRepository,
    private readonly storage: IFileStorage,
  ) {}

  async execute(actor: AuthUser, { file, type }: UploadFileInput): Promise<StoredFile> {
    if (!isFileType(type)) {
      throw new ValidationError(`Invalid type. Must be one of: ${FILE_TYPES.join(', ')}`);
    }
    if (file.size === 0) throw new ValidationError('File is empty');
    if (!isAllowedMimeType(type, file.mimetype)) {
      throw new ValidationError(`File type "${file.mimetype}" is not allowed for "${type}"`);
    }

    const { objectPath, url } = await this.storage.upload({
      buffer: file.buffer,
      filename: file.originalname,
      folder: `${actor.userId}/${type}`,
      contentType: file.mimetype,
    });

    return this.files.create({
      userId: actor.userId,
      fileUrl: url,
      fileType: file.mimetype,
      fileSize: file.size,
      bucketPath: objectPath,
    });
  }
}
