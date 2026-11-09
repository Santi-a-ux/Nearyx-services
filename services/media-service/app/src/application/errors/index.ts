export type ErrorCode =
  | 'VALIDATION'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'STORAGE_UNAVAILABLE'
  | 'STORAGE_FAILED';

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION', message);
  }
}

export class MissingCredentialsError extends AppError {
  constructor() {
    super('UNAUTHORIZED', 'Valid credentials are required');
  }
}

export class InvalidTokenError extends AppError {
  constructor(message = 'Token is invalid or expired') {
    super('UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super('FORBIDDEN', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message);
  }
}

export class PublicationNotFoundError extends NotFoundError {
  constructor() {
    super('Publication not found');
  }
}

export class CommentNotFoundError extends NotFoundError {
  constructor() {
    super('Comment not found');
  }
}

export class FileNotFoundError extends NotFoundError {
  constructor() {
    super('File not found');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message);
  }
}

export class StorageNotConfiguredError extends AppError {
  constructor() {
    super('STORAGE_UNAVAILABLE', 'File storage is not configured');
  }
}

export class StorageError extends AppError {
  constructor(status: number) {
    super('STORAGE_FAILED', `File storage responded with HTTP ${status}`);
  }
}
