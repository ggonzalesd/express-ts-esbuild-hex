/* eslint-disable no-console */
import { createServer } from 'http';
import envConfig from '@/config/env.config';

import { app } from '@/app';

const { PORT, NODE_ENV, API_URL } = envConfig;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on ${API_URL}`);
  console.log(`Environment: ${NODE_ENV}`);
});
