/** Metadatos de un archivo guardado en el bucket (tabla media.files). */
export interface StoredFile {
  readonly id: string;
  readonly userId: string;
  readonly fileUrl: string;
  readonly fileType: string;
  readonly fileSize: number;
  readonly bucketPath: string;
  readonly createdAt: Date | null;
}
