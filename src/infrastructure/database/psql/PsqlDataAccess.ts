import { psqlPoolFactory } from './Psql.config';
import { PsqlUserDB } from './PsqlUser.database';

import type {
  PoolClient,
  PoolQuery,
  DataAccess,
  PoolConnection,
  UserRepository,
} from '@@core/repositories';

import { ConfigService } from '@@app/ports';

export class PsqlDataAccess implements DataAccess {
  public pool: PoolClient;

  public user: UserRepository;

  constructor(public configServier: ConfigService) {
    this.pool = psqlPoolFactory(configServier);

    this.user = new PsqlUserDB(this.pool);
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
