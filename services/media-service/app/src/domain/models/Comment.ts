import type { RecordState } from './RecordState';

export interface Comment {
  readonly id: string;
  readonly postId: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly authorAvatar: string | null;
  readonly content: string;
  readonly state: RecordState;
  readonly createdAt: Date;
}
