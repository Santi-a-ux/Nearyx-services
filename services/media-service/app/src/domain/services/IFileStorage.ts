export interface StorageUploadInput {
  readonly buffer: Buffer;
  readonly filename: string;
  readonly folder: string;
  readonly contentType: string;
}

export interface StorageUploadResult {
  readonly objectPath: string;
  readonly url: string;
}

export interface IFileStorage {
  upload(input: StorageUploadInput): Promise<StorageUploadResult>;
  remove(objectPath: string): Promise<void>;
  publicUrl(objectPath: string): string;
}
