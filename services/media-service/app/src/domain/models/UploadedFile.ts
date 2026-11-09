/** Archivo recibido por HTTP, ya independiente de multer. */
export interface UploadedFile {
  readonly buffer: Buffer;
  readonly mimetype: string;
  readonly originalname: string;
  readonly size: number;
}
