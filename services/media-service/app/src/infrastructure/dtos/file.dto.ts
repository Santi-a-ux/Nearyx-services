import { z } from 'zod';
import type { StoredFile } from '../../domain/models/StoredFile';
import { uuidSchema } from './common.dto';

export const fileIdParamSchema = z.object({ file_id: uuidSchema });
export type FileIdParams = z.infer<typeof fileIdParamSchema>;

export const toFileDto = (file: StoredFile) => ({
  id: file.id,
  user_id: file.userId,
  file_url: file.fileUrl,
  file_type: file.fileType,
  file_size: file.fileSize,
  bucket_path: file.bucketPath,
  created_at: file.createdAt,
});

export const toUploadDto = (file: StoredFile) => ({
  url: file.fileUrl,
  file_id: file.id,
  file_type: file.fileType,
  file_size: file.fileSize,
});
