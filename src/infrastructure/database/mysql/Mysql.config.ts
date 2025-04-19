import { container } from 'tsyringe';
import { createPool } from 'mysql2/promise';

import { PREFIX_POOL } from '@/constants/dependencies.enum';
import { dependecyName } from '@/tools/dependencies.tool';

import envConfig from '@/config/env.config';

const mysqlPool = createPool({
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASS,
  database: envConfig.DB_NAME,
  connectionLimit: envConfig.DB_CONNECTION_POOL_MAX,
});

const dbDialect: typeof envConfig.DB_DIALECT = 'mysql';

export const DEP_MYSQL_POOL = dependecyName(PREFIX_POOL, dbDialect);

container.register(DEP_MYSQL_POOL, { useValue: mysqlPool });
