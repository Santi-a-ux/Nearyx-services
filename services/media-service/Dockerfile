FROM node:22-slim
WORKDIR /app

# Prisma necesita openssl; curl se usa para el health check de la plataforma.
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

COPY app/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY app/ ./
# Genera el cliente de Prisma y compila TypeScript a dist/.
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8006
EXPOSE 8006

USER node
CMD ["node", "dist/server.js"]
