import type { IFileStorage } from '../../../domain/services/IFileStorage';

export class GetFileContentUrl {
  constructor(private readonly storage: IFileStorage) {}

  execute(objectPath: string): string {
    return this.storage.publicUrl(objectPath);
  }
}
