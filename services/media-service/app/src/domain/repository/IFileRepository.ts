import type { StoredFile } from '../models/StoredFile';

export interface NewStoredFile {
  readonly userId: string;
  readonly fileUrl: string;
  readonly fileType: string;
  readonly fileSize: number;
  readonly bucketPath: string;
}

export interface IFileRepository {
  create(data: NewStoredFile): Promise<StoredFile>;
  findById(id: string): Promise<StoredFile | null>;
  delete(id: string): Promise<void>;
}
