import { inject, injectable } from 'tsyringe';

import { DepDb } from '@@const/dependencies.enum';
import { DEP_ENVIRONMENT } from '@@const/injection.enum';

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

@injectable({ token: DepDb.PSQL })
export class PsqlDataAccess implements DataAccess {
  public pool: PoolClient;

  public user: UserRepository;

  constructor(@inject(DEP_ENVIRONMENT) public configServier: ConfigService) {
    this.pool = psqlPoolFactory(configServier);

    this.user = new PsqlUserDB(this.pool);
  }

  public async transaction<T>(
    fn: (ctx: PoolQuery, access: DataAccess, cancel: () => void) => Promise<T>,
  ): Promise<T> {
    let connection: PoolConnection | null = null;

    let doRoolback = false;
    const cancel = () => {
      doRoolback = true;
    };

    try {
      connection = await this.pool.connect();
      await connection.begin();
      const result = await fn(connection, this, cancel);

      if (doRoolback) {
        await connection?.rollback();
        return result;
      }

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
