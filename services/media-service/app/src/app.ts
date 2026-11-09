import express, { type Express, type Router } from 'express';
import { errorHandler, notFound } from './interface/middlewares/errorHandler';

export function createApp(mediaRouter: Router): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'media-service' });
  });
  app.use('/media', mediaRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
