import http from 'http';
import { env } from './shared/config/env';
import { createApp } from './app';
import { initSockets } from './shared/sockets';

const app = createApp();
const server = http.createServer(app);

initSockets(server);

server.listen(env.PORT, () => {
  console.log(`VidyaSetu backend listening on :${env.PORT} (${env.NODE_ENV})`);
});
