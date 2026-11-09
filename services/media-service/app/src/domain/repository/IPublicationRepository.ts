import type { Publication } from '../models/Publication';
import type { RecordState } from '../models/RecordState';

export interface PagedItems<T> {
  readonly items: T[];
  readonly total: number;
}

export interface PublicationFilters {
  readonly state: RecordState | 'all';
  readonly search?: string;
  readonly authorId?: string;
  readonly authorRole?: string;
}

export interface NewPublication {
  readonly authorId: string;
  readonly authorName: string;
  readonly authorAvatar: string | null;
  readonly authorRole: string | null;
  readonly content: string;
  readonly imageUrl: string | null;
}

export interface PublicationChanges {
  readonly content?: string;
  readonly imageUrl?: string | null;
  readonly authorRole?: string | null;
}

export interface IPublicationRepository {
  list(filters: PublicationFilters, page: number, limit: number): Promise<PagedItems<Publication>>;
  findById(id: string, options?: { includeDeleted?: boolean }): Promise<Publication | null>;
  create(data: NewPublication): Promise<Publication>;
  update(id: string, changes: PublicationChanges): Promise<Publication>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<Publication>;
}
