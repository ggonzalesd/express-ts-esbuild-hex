import { inject, injectable } from 'tsyringe';
import { type Pool, type PoolConnection } from 'mysql2/promise';

import { type TransactionManager } from '@/domain/repositories/TransactionManager';

import { DEP_MYSQL_POOL } from './Mysql.config';

@injectable()
export class MysqlTransaction implements TransactionManager<'mysql'> {
  constructor(@inject(DEP_MYSQL_POOL) private client: Pool) {}

  async run<T>(fn: (ctx: PoolConnection) => Promise<T>): Promise<T> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.client.getConnection();
      await connection.beginTransaction();
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
