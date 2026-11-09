import { z } from 'zod';
import type { Publication } from '../../domain/models/Publication';
import type { PublicationChanges } from '../../domain/repository/IPublicationRepository';
import { paginationQuerySchema, uuidSchema } from './common.dto';

const imageUrlSchema = z.preprocess(
  (value) => (value === '' ? null : value),
  z.string().url().max(500).nullish(),
);

export const createPublicationSchema = z.object({
  author_id: uuidSchema.optional(),
  author_name: z.string().trim().min(1).max(120),
  author_avatar: z.string().max(500).nullish(),
  author_role: z.string().max(30).nullish(),
  content: z.string().trim().min(1).max(5000),
  image_url: imageUrlSchema,
});

export const updatePublicationSchema = z
  .object({
    content: z.string().trim().min(1).max(5000).optional(),
    image_url: imageUrlSchema.optional(),
    author_role: z.string().max(30).nullable().optional(),
  })
  .refine((body) => Object.values(body).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  });

const filtersSchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  author_id: uuidSchema.optional(),
  author_role: z.string().trim().min(1).max(30).optional(),
});

export const listPublicationsQuerySchema = paginationQuerySchema.merge(filtersSchema);

export const listPublicationsAdminQuerySchema = paginationQuerySchema.merge(filtersSchema).extend({
  state: z.enum(['active', 'deleted', 'all']).default('all'),
});

export const publicationIdParamSchema = z.object({ publication_id: uuidSchema });

export type CreatePublicationBody = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationBody = z.infer<typeof updatePublicationSchema>;
export type ListPublicationsQuery = z.infer<typeof listPublicationsQuerySchema>;
export type ListPublicationsAdminQuery = z.infer<typeof listPublicationsAdminQuerySchema>;
export type PublicationIdParams = z.infer<typeof publicationIdParamSchema>;

export const toPublicationDto = (publication: Publication) => ({
  id: publication.id,
  author_id: publication.authorId,
  author_name: publication.authorName,
  author_avatar: publication.authorAvatar,
  author_role: publication.authorRole,
  content: publication.content,
  image_url: publication.imageUrl,
  state: publication.state,
  created_at: publication.createdAt,
  updated_at: publication.updatedAt,
});

export const toPublicationChanges = (body: UpdatePublicationBody): PublicationChanges => ({
  content: body.content,
  imageUrl: body.image_url,
  authorRole: body.author_role,
});
