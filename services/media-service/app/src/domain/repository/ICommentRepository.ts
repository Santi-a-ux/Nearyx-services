import type { Comment } from '../models/Comment';

export interface NewComment {
  readonly postId: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly authorAvatar: string | null;
  readonly content: string;
}

export interface ICommentRepository {
  listByPost(postId: string): Promise<Comment[]>;
  findById(id: string): Promise<Comment | null>;
  create(data: NewComment): Promise<Comment>;
  softDelete(id: string): Promise<void>;
}
