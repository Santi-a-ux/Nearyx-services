import { Router } from 'express';
import { AuthenticateUser } from './application/use-cases/auth/AuthenticateUser';
import { CreateComment } from './application/use-cases/comments/CreateComment';
import { DeleteComment } from './application/use-cases/comments/DeleteComment';
import { ListComments } from './application/use-cases/comments/ListComments';
import { DeleteFile } from './application/use-cases/files/DeleteFile';
import { GetFileContentUrl } from './application/use-cases/files/GetFileContentUrl';
import { GetFileMetadata } from './application/use-cases/files/GetFileMetadata';
import { UploadFile } from './application/use-cases/files/UploadFile';
import { CreatePublication } from './application/use-cases/publications/CreatePublication';
import { DeletePublication } from './application/use-cases/publications/DeletePublication';
import { GetPublication } from './application/use-cases/publications/GetPublication';
import { ListPublications } from './application/use-cases/publications/ListPublications';
import { ListPublicationsAsAdmin } from './application/use-cases/publications/ListPublicationsAsAdmin';
import { RestorePublication } from './application/use-cases/publications/RestorePublication';
import { UpdatePublication } from './application/use-cases/publications/UpdatePublication';
import { config } from './config/env';
import { prisma } from './infrastructure/database/prisma';
import { PrismaCommentRepository } from './infrastructure/repository/PrismaCommentRepository';
import { PrismaFileRepository } from './infrastructure/repository/PrismaFileRepository';
import { PrismaPublicationRepository } from './infrastructure/repository/PrismaPublicationRepository';
import { JwtTokenVerifier } from './infrastructure/services/JwtTokenVerifier';
import { SupabaseStorage } from './infrastructure/services/SupabaseStorage';
import { AdminPublicationController } from './interface/controllers/AdminPublicationController';
import { CommentController } from './interface/controllers/CommentController';
import { FileController } from './interface/controllers/FileController';
import { PublicationController } from './interface/controllers/PublicationController';
import { createAuthenticate } from './interface/middlewares/authenticate';
import { createAdminRouter } from './interface/routers/admin.router';
import { createCommentRouter } from './interface/routers/comment.router';
import { createFileRouter } from './interface/routers/file.router';
import { createPublicationRouter } from './interface/routers/publication.router';

/** Raíz de composición: único lugar donde se conectan las capas. */
export function buildMediaRouter(): Router {
  const publications = new PrismaPublicationRepository(prisma);
  const comments = new PrismaCommentRepository(prisma);
  const files = new PrismaFileRepository(prisma);
  const storage = new SupabaseStorage(config.supabase);
  const tokenVerifier = new JwtTokenVerifier(config.jwt.secret, config.jwt.algorithm);

  const authenticate = createAuthenticate(new AuthenticateUser(tokenVerifier));

  const publicationController = new PublicationController({
    list: new ListPublications(publications),
    get: new GetPublication(publications),
    create: new CreatePublication(publications),
    update: new UpdatePublication(publications),
    remove: new DeletePublication(publications),
  });
  const adminController = new AdminPublicationController({
    list: new ListPublicationsAsAdmin(publications),
    restore: new RestorePublication(publications),
  });
  const commentController = new CommentController({
    list: new ListComments(comments, publications),
    create: new CreateComment(comments, publications),
    remove: new DeleteComment(comments),
  });
  const fileController = new FileController({
    upload: new UploadFile(files, storage),
    metadata: new GetFileMetadata(files),
    contentUrl: new GetFileContentUrl(storage),
    remove: new DeleteFile(files, storage),
  });

  // El orden importa: posts, admin y comentarios antes de "/:file_id".
  const mediaRouter = Router();
  mediaRouter.use(createPublicationRouter(publicationController, authenticate));
  mediaRouter.use('/admin', createAdminRouter(adminController, authenticate));
  mediaRouter.use(createCommentRouter(commentController, authenticate));
  mediaRouter.use(createFileRouter(fileController, authenticate));
  return mediaRouter;
}
