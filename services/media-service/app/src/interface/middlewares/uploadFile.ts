import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { config } from '../../config/env';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadBytes, files: 1 },
}).single('file');

/** Lee el multipart (campos "file" y "type"). Responde 413 si el archivo es muy grande y 400 si falta algo. */
export function uploadFile(req: Request, res: Response, next: NextFunction): void {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE';
      res.status(tooLarge ? 413 : 400).json({ detail: tooLarge ? 'File too large' : error.message });
      return;
    }
    if (error) {
      next(error);
      return;
    }

    const type = (req.body as Record<string, unknown> | undefined)?.type;
    if (!req.file) {
      res.status(400).json({ detail: 'Field "file" is required' });
      return;
    }
    if (typeof type !== 'string' || type.length === 0) {
      res.status(400).json({ detail: 'Field "type" is required' });
      return;
    }
    req.validated = { ...req.validated, body: { type } };
    next();
  });
}
