import { inject, injectable } from 'tsyringe';
import { type Pool, type PoolClient } from 'pg';

import { type TransactionManager } from '@@core/repositories/TransactionManager';

import { DEP_PG_POOL } from './Psql.config';

@injectable()
export class PsqlTransaction implements TransactionManager<'pg'> {
  constructor(@inject(DEP_PG_POOL) private client: Pool) {}

  async run<T>(fn: (ctx: PoolClient) => Promise<T>): Promise<T> {
    let connection: PoolClient | null = null;
    try {
      connection = await this.client.connect();
      await connection.query('BEGIN');
      const result = await fn(connection);
      await connection.query('COMMIT');
      return result;
    } catch (error) {
      await connection?.query('ROLLBACK');
      throw error;
    } finally {
      connection?.release();
    }
  }
}
