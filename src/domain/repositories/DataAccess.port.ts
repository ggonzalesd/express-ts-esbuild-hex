import { type UserRepository } from '.';

export interface PoolQuery {
  query: <T>(sql: string, ...values: unknown[]) => Promise<T[]>;
}

export interface PoolConnection extends PoolQuery {
  release: () => void;
  begin: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

export interface PoolClient extends PoolQuery {
  connect: () => Promise<PoolConnection>;
}

export interface DataAccess {
  pool: PoolClient;

  user: UserRepository;

  transaction: <T>(fn: (ctx: PoolQuery) => Promise<T>) => Promise<T>;
}
