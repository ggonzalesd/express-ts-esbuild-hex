import { psqlPoolFactory } from './Psql.config';
import { PsqlUserDB } from './PsqlUser.database';
import { PsqlProductDB } from './PsqlProduct.database';

import type {
  PoolClient,
  PoolQuery,
  DataAccess,
  PoolConnection,
} from '@@core/repositories/DataAccess.port';

import { ConfigService } from '@@app/ports';

import { UserRepository } from '@@core/repositories/UserRepository.port';
import { ProductRepository } from '@@core/repositories/ProductRepository.port';

export class PsqlDataAccess implements DataAccess {
  public pool: PoolClient;

  public user: UserRepository;
  public product: ProductRepository;

  constructor(public configServier: ConfigService) {
    this.pool = psqlPoolFactory(configServier);

    this.user = new PsqlUserDB(this.pool);
    this.product = new PsqlProductDB(this.pool);
  }

  public async transaction<T>(fn: (ctx: PoolQuery) => Promise<T>): Promise<T> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.pool.connect();
      await connection.begin();
      const result = await fn(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection?.rollback();
      throw error;
    } finally {
      connection?.release();
    }
  }
}
