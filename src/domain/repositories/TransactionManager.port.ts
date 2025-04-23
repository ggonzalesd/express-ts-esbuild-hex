import { type PoolClient as PsqlPool } from 'pg';
import { type PoolConnection as MysqlPool } from 'mysql2/promise';

export type DatabaseType = 'pg' | 'mysql';

interface TransactionContextMap {
  pg: Pick<PsqlPool, 'query'>;
  mysql: Pick<MysqlPool, 'query'>;
}

export type TransactionContext<T> = T extends DatabaseType
  ? TransactionContextMap[T]
  : never;

export interface TransactionManager<CTX extends DatabaseType = DatabaseType> {
  run<T>(fn: (ctx: NoInfer<TransactionContext<CTX>>) => Promise<T>): Promise<T>;
}
