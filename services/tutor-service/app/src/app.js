import express from 'express';
import cors from 'cors';
import { errorHandler } from './presentation/middlewares/errorHandler.js';

export function createApp({ tutorRouter }) {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'tutor-service' }));
  app.use('/tutors', tutorRouter);

  app.use((req, res) => res.status(404).json({ detail: 'Not Found' }));
  app.use(errorHandler);
  return app;
}
