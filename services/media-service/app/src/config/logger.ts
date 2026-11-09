type Level = 'INFO' | 'ERROR';

function write(level: Level, message: string): void {
  const stream = level === 'ERROR' ? process.stderr : process.stdout;
  stream.write(`${new Date().toISOString()} ${level} ${message}\n`);
}

export const logger = {
  info: (message: string): void => write('INFO', message),
  error: (message: string, error?: unknown): void => {
    const detail = error instanceof Error ? (error.stack ?? error.message) : String(error ?? '');
    write('ERROR', detail ? `${message}: ${detail}` : message);
  },
};
