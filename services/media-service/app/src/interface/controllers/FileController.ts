import type { Request, Response } from 'express';
import { ValidationError } from '../../application/errors';
import type { DeleteFile } from '../../application/use-cases/files/DeleteFile';
import type { GetFileContentUrl } from '../../application/use-cases/files/GetFileContentUrl';
import type { GetFileMetadata } from '../../application/use-cases/files/GetFileMetadata';
import type { UploadFile } from '../../application/use-cases/files/UploadFile';
import { toFileDto, toUploadDto, type FileIdParams } from '../../infrastructure/dtos/file.dto';
import { currentUser } from '../middlewares/authenticate';
import { getValidated } from '../middlewares/validate';

export interface FileUseCases {
  upload: UploadFile;
  metadata: GetFileMetadata;
  contentUrl: GetFileContentUrl;
  remove: DeleteFile;
}

export class FileController {
  constructor(private readonly useCases: FileUseCases) {}

  upload = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) throw new ValidationError('Field "file" is required');
    const { type } = getValidated<{ type: string }>(req, 'body');

    const stored = await this.useCases.upload.execute(currentUser(req), {
      type,
      file: {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
      },
    });
    res.status(201).json(toUploadDto(stored));
  };

  redirectToContent = (req: Request, res: Response): void => {
    const objectPath = req.params[0];
    if (typeof objectPath !== 'string' || objectPath.length === 0) {
      throw new ValidationError('File path is required');
    }
    res.redirect(307, this.useCases.contentUrl.execute(objectPath));
  };

  getMetadata = async (req: Request, res: Response): Promise<void> => {
    const { file_id } = getValidated<FileIdParams>(req, 'params');
    res.json(toFileDto(await this.useCases.metadata.execute(file_id)));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { file_id } = getValidated<FileIdParams>(req, 'params');
    await this.useCases.remove.execute(currentUser(req), file_id);
    res.status(204).send();
  };
}
