import {
  DomainError,
  InvalidRoleError,
  EmailAlreadyRegisteredError,
} from '../../domain/errors/index.js';
 
const STATUS_BY_ERROR = new Map([
  [InvalidRoleError, 400],
  [EmailAlreadyRegisteredError, 409],
]);
 
const UNAUTHORIZED = 401;
 
function statusFor(err) {
  for (const [ErrorClass, status] of STATUS_BY_ERROR) {
    if (err instanceof ErrorClass) return status;
  }
  return UNAUTHORIZED;
}
 
export function errorHandler(err, req, res, _next) {
  if (err instanceof DomainError) {
    return res.status(statusFor(err)).json({ detail: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ detail: 'JSON decode error' });
  }
  process.stderr.write(`${err.stack ?? err}\n`);
  res.status(500).json({ detail: 'Internal Server Error' });
}