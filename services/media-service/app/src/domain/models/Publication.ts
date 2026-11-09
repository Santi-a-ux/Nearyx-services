import type { RecordState } from './RecordState';

export interface Publication {
  readonly id: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly authorAvatar: string | null;
  readonly authorRole: string | null;
  readonly content: string;
  readonly imageUrl: string | null;
  readonly state: RecordState;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
