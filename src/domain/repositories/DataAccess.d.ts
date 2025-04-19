import { type ProductRepository } from './ProductRepository';
import { type TransactionManager } from './TransactionManager';

export type GenericPool = {
  query: <T>(sql: string, values?: unknown) => Promise<T>;
};

export interface DataAccess {
  pool: GenericPool;
  product: ProductRepository;
  transaction: TransactionManager;
}
