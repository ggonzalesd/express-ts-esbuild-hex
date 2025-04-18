import { Pool, createPool } from 'mysql2/promise';

import { type DataAccess } from '@/domain/repositories/DataAccess';

import envConfig from '@/config/env.config';
import { MysqlProductDatabase } from './MysqlProduct.database';

export class MysqlDataAccess implements DataAccess {
  private pool: Pool;
  public product: MysqlProductDatabase;

  constructor() {
    this.pool = createPool({
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASS,
      database: envConfig.DB_NAME,
      connectionLimit: envConfig.DB_CONNECTION_POOL_MAX,
    });

    this.product = new MysqlProductDatabase(this.pool);
  }
}
