import { z } from 'zod';
import type { Comment } from '../../domain/models/Comment';
import { uuidSchema } from './common.dto';

export const createCommentSchema = z.object({
  post_id: uuidSchema.optional(),
  author_id: uuidSchema.optional(),
  author_name: z.string().trim().min(1).max(120),
  author_avatar: z.string().max(500).nullish(),
  content: z.string().trim().min(1).max(2000),
});

export const postIdParamSchema = z.object({ post_id: uuidSchema });
export const commentParamsSchema = z.object({ post_id: uuidSchema, comment_id: uuidSchema });

export type CreateCommentBody = z.infer<typeof createCommentSchema>;
export type PostIdParams = z.infer<typeof postIdParamSchema>;
export type CommentParams = z.infer<typeof commentParamsSchema>;

export const toCommentDto = (comment: Comment) => ({
  id: comment.id,
  post_id: comment.postId,
  author_id: comment.authorId,
  author_name: comment.authorName,
  author_avatar: comment.authorAvatar,
  content: comment.content,
  created_at: comment.createdAt,
});
