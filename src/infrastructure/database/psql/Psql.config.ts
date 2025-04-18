import { Pool } from 'pg';

import { type DataAccess } from '@/domain/repositories/DataAccess';

import envConfig from '@/config/env.config';
import { PsqlProductRepository } from './PsqlProduct.database';

export class PsqlDataAccess implements DataAccess {
  private pool: Pool;
  public product: PsqlProductRepository;

  constructor() {
    this.pool = new Pool({
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASS,
      database: envConfig.DB_NAME,
      max: envConfig.DB_CONNECTION_POOL_MAX,
    });

    this.product = new PsqlProductRepository(this.pool);
  }
}
