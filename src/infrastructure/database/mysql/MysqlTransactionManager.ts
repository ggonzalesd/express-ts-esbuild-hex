import { Pool, type PoolConnection } from 'mysql2/promise';
import { type TransactionManager } from '@/domain/repositories/TransactionManager';

export class MysqlTransactionManager implements TransactionManager<'mysql'> {
  constructor(private client: Pool) {}

  async run<T>(fn: (ctx: PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.client.getConnection();
    try {
      await this.client.beginTransaction();
      const result = await fn(connection);
      await this.client.commit();
      return result;
    } catch (error) {
      await this.client.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
