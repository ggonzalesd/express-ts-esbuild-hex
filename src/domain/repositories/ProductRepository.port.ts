import { Product } from '../entities/Product.entity';
import {
  DatabaseType,
  type TransactionContext,
} from './TransactionManager.port';

export interface ProductRepository<T extends DatabaseType = DatabaseType> {
  findAll(ctx?: TransactionContext<T>): Promise<Product[]>;
  findById(id: string, ctx?: TransactionContext<T>): Promise<Product | null>;
}
