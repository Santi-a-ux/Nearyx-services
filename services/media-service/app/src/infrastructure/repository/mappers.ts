import type { Comment as CommentRow, Publication as PublicationRow, StoredFile as FileRow } from '@prisma/client';
import type { Comment } from '../../domain/models/Comment';
import type { Publication } from '../../domain/models/Publication';
import type { RecordState } from '../../domain/models/RecordState';
import type { StoredFile } from '../../domain/models/StoredFile';

const toRecordState = (value: string): RecordState => (value === 'deleted' ? 'deleted' : 'active');

export const toPublication = (row: PublicationRow): Publication => ({
  id: row.id,
  authorId: row.authorId,
  authorName: row.authorName,
  authorAvatar: row.authorAvatar,
  authorRole: row.authorRole,
  content: row.content,
  imageUrl: row.imageUrl,
  state: toRecordState(row.state),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const toComment = (row: CommentRow): Comment => ({
  id: row.id,
  postId: row.postId,
  authorId: row.authorId,
  authorName: row.authorName,
  authorAvatar: row.authorAvatar,
  content: row.content,
  state: toRecordState(row.state),
  createdAt: row.createdAt,
});

export const toStoredFile = (row: FileRow): StoredFile => ({
  id: row.id,
  userId: row.userId,
  fileUrl: row.fileUrl,
  fileType: row.fileType,
  fileSize: row.fileSize,
  bucketPath: row.bucketPath,
  createdAt: row.createdAt,
});
