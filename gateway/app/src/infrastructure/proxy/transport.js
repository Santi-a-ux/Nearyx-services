import http from 'node:http';
import https from 'node:https';

const transports = {
  'http:': { client: http, agent: new http.Agent({ keepAlive: true }) },
  'https:': { client: https, agent: new https.Agent({ keepAlive: false }) },
};

/** @returns {{ client: typeof http, agent: http.Agent }} the node client matching `target.protocol`. */
export const transportFor = (target) => transports[target.protocol];