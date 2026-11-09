import type { Request, RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export type RequestSource = 'body' | 'params' | 'query';

/** Valida body, params o query con zod. Los datos ya validados quedan en req.validated. */
export const validate =
  (source: RequestSource, schema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: [source, ...issue.path].join('.'),
        message: issue.message,
      }));
      res.status(400).json({
        detail: errors.map((e) => `${e.field}: ${e.message}`).join('; '),
        errors,
      });
      return;
    }
    req.validated = { ...req.validated, [source]: result.data };
    next();
  };

export function getValidated<T>(req: Request, source: RequestSource): T {
  return (req.validated?.[source] ?? {}) as T;
}
