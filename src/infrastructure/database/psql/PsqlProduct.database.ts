import { type Pool } from 'pg';

import { Product } from '@/domain/entities/Product.entity';

import { type TransactionContext } from '@/domain/repositories/TransactionManager';
import { type ProductRepository } from '@/domain/repositories/ProductRepository';

type Repository = ProductRepository<'pg'>;
type CTX = TransactionContext<'pg'>;

export class PsqlProductRepository implements Repository {
  constructor(private client: Pool) {
    this.client = client;
  }

  async findAll(ctx?: CTX): Promise<Product[]> {
    const client = ctx ?? this.client;
    const result = await client.query<Product>('SELECT * FROM products');
    return result.rows;
  }
}
