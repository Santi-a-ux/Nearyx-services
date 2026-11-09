import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { StorageError, StorageNotConfiguredError } from '../../application/errors';
import type {
  IFileStorage,
  StorageUploadInput,
  StorageUploadResult,
} from '../../domain/services/IFileStorage';

const SAFE_EXTENSION = /^\.[A-Za-z0-9]{1,10}$/;

export interface SupabaseStorageOptions {
  url: string | null;
  key: string | null;
  bucket: string;
  timeoutMs?: number;
}

/** Adaptador de Supabase Storage (API compatible con S3) usando su API REST. */
export class SupabaseStorage implements IFileStorage {
  private readonly baseUrl: string | null;
  private readonly key: string | null;
  private readonly bucket: string;
  private readonly timeoutMs: number;

  constructor({ url, key, bucket, timeoutMs = 20_000 }: SupabaseStorageOptions) {
    this.baseUrl = url ? url.replace(/\/+$/, '') : null;
    this.key = key;
    this.bucket = bucket;
    this.timeoutMs = timeoutMs;
  }

  publicUrl(objectPath: string): string {
    return `${this.baseUrl}/storage/v1/object/public/${this.bucket}/${this.encode(objectPath)}`;
  }

  async upload({ buffer, filename, folder, contentType }: StorageUploadInput): Promise<StorageUploadResult> {
    const { baseUrl, headers } = this.requireConfig();

    const extension = path.extname(path.basename(filename));
    const name = `${randomUUID()}${SAFE_EXTENSION.test(extension) ? extension : ''}`;
    const directory = folder.replace(/^\/+|\/+$/g, '');
    const objectPath = directory ? `${directory}/${name}` : name;

    const response = await fetch(`${baseUrl}/storage/v1/object/${this.bucket}/${this.encode(objectPath)}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': contentType, 'x-upsert': 'true' },
      body: new Uint8Array(buffer),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!response.ok) throw new StorageError(response.status);

    return { objectPath, url: this.publicUrl(objectPath) };
  }

  async remove(objectPath: string): Promise<void> {
    const { baseUrl, headers } = this.requireConfig();

    const response = await fetch(`${baseUrl}/storage/v1/object/${this.bucket}`, {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: [objectPath] }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!response.ok) throw new StorageError(response.status);
  }

  private requireConfig(): { baseUrl: string; headers: Record<string, string> } {
    if (!this.baseUrl || !this.key) throw new StorageNotConfiguredError();
    return { baseUrl: this.baseUrl, headers: { Authorization: `Bearer ${this.key}`, apikey: this.key } };
  }

  private encode(objectPath: string): string {
    return objectPath.split('/').map(encodeURIComponent).join('/');
  }
}
