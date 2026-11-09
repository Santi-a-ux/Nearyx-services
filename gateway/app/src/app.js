import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';

export function createApp({ httpProxy, wake }) {
  const app = express();

  app.use(cors({ origin: config.corsOrigins.length ? config.corsOrigins : true, credentials: true }));

  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

  app.get('/wake', async (req, res) => {
    if (config.wakeKey && req.query.key !== config.wakeKey) return res.status(401).json({ detail: 'Invalid wake key' });
    const mode = req.query.mode === 'db' ? 'db' : 'all';
    if (req.query.async === '1') {
      wake.run({ mode }).catch(() => {});
      return res.status(202).json({ status: 'waking', mode });
    }
    const report = await wake.run({ mode });
    return res.status(report.ok ? 200 : 503).json(report);
  });

  app.use(httpProxy);

  return app;
}
