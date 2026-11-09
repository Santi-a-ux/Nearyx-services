export const FILE_TYPES = ['avatar', 'document', 'post'] as const;
export type FileType = (typeof FILE_TYPES)[number];

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const ALLOWED_MIME_TYPES: Record<FileType, readonly string[]> = {
  avatar: IMAGE_MIME_TYPES,
  post: IMAGE_MIME_TYPES,
  document: [...IMAGE_MIME_TYPES, 'application/pdf'],
};

export const isFileType = (value: string): value is FileType =>
  (FILE_TYPES as readonly string[]).includes(value);

export const isAllowedMimeType = (type: FileType, mimeType: string): boolean =>
  ALLOWED_MIME_TYPES[type].includes(mimeType);
