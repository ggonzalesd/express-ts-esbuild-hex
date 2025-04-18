import { type Product } from '@/domain/entities/Product.entity';

export interface IProductDatabase {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, product: Product): Promise<Product | null>;
  delete(id: string): Promise<string | null>;
}
