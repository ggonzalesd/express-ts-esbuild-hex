import { type UserRepository } from './UserRepository';
import { type ProductRepository } from './ProductRepository';
import { type TransactionManager } from './TransactionManager';

export type GenericPool = {
  query: <T>(sql: string, values?: unknown) => Promise<T>;
};

export interface DataAccess {
  pool: GenericPool;

  user: UserRepository;
  product: ProductRepository;

  transaction: TransactionManager;
}
