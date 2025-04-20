import { container } from 'tsyringe';
import { Pool } from 'pg';

import { dependecyName } from '@/tools/dependencies.tool';
import { ADAPTER_DATABASE, PREFIX_POOL } from '@/constants/dependencies.enum';

import envConfig from '@/config/env.config';

const psqlPool = new Pool({
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASS,
  database: envConfig.DB_NAME,
  max: envConfig.DB_CONNECTION_POOL_MAX,
});

const database: typeof ADAPTER_DATABASE = 'postgres';

export const DEP_PG_POOL = dependecyName(PREFIX_POOL, database);

container.register(DEP_PG_POOL, { useValue: psqlPool });
