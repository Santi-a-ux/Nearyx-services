import { createApp } from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { buildMediaRouter } from './container';
import { prisma } from './infrastructure/database/prisma';

const app = createApp(buildMediaRouter());

const server = app.listen(config.port, () => {
  logger.info(`Media service listening on port ${config.port}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
