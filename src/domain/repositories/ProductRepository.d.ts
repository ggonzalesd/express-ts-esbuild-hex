import { Product } from '../entities/Product.entity';
import { type TransactionContext } from './TransactionManager';

export interface ProductRepository<T extends DatabaseType = DatabaseType> {
  findAll(ctx?: TransactionContext<T>): Promise<Product[]>;
}
