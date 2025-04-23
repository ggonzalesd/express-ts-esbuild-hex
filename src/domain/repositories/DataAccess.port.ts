import { type UserRepository } from './UserRepository.port';
import { type ProductRepository } from './ProductRepository.port';
import { type TransactionManager } from './TransactionManager.port';

export type GenericPool = {
  query: <T>(sql: string, values?: unknown) => Promise<T>;
};

export interface DataAccess {
  pool: GenericPool;

  user: UserRepository;
  product: ProductRepository;

  transaction: TransactionManager;
}
