/* eslint-disable no-console */
import 'reflect-metadata';
import { container } from 'tsyringe';
import { createServer } from 'http';

import { DEP_CONFIG_ENV } from '@/constants/dependencies.enum';
import { type ConfigService } from '@/application/ports/ConfigServide';

import '@/infrastructure/environment/dotenv.config';

import { app } from '@/app';

const envConfig = container.resolve<ConfigService>(DEP_CONFIG_ENV);

const { PORT, NODE_ENV, API_URL } = envConfig;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on ${API_URL}`);
  console.log(`Environment: ${NODE_ENV}`);
});
