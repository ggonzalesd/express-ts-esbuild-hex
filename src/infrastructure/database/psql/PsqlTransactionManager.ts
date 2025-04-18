import { Pool, type PoolClient } from 'pg';
import { type TransactionManager } from '@/domain/repositories/TransactionManager';

export class PsqlTransactionManager implements TransactionManager<'pg'> {
  constructor(private client: Pool) {}

  async run<T>(fn: (ctx: PoolClient) => Promise<T>): Promise<T> {
    const connection = await this.client.connect();
    try {
      await this.client.query('BEGIN');
      const result = await fn(connection);
      await this.client.query('COMMIT');
      return result;
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  }
}
