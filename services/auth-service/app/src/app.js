import express from 'express';
import cors from 'cors';
import { errorHandler } from './presentation/middlewares/errorHandler.js';

export function createApp({ authRouter, checkDatabase }) {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
  app.get('/health/db', async (req, res) => {
    try {
      await checkDatabase();
      res.json({ status: 'ok', db: 'up' });
    } catch {
      res.status(503).json({ status: 'error', db: 'down' });
    }
  });
  app.use('/auth', authRouter);

  app.use(errorHandler);
  return app;
}
