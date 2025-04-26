import { type UserRepository } from './UserRepository.port';
import { type ProductRepository } from './ProductRepository.port';

export interface PoolQuery {
  query: <T>(sql: string, ...values: unknown[]) => Promise<T>;
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
  product: ProductRepository;

  transaction: <T>(fn: (ctx: PoolQuery) => Promise<T>) => Promise<T>;
}
