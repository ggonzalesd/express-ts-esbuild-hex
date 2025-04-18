import { type Pool } from 'mysql2/promise';

import { Product } from '@/domain/entities/Product.entity';

import { type TransactionContext } from '@/domain/repositories/TransactionManager';
import { type ProductRepository } from '@/domain/repositories/ProductRepository';

type Repository = ProductRepository<'mysql'>;
type CTX = TransactionContext<'mysql'>;

export class MysqlProductDatabase implements Repository {
  constructor(private client: Pool) {
    this.client = client;
  }

  async findAll(ctx?: CTX): Promise<Product[]> {
    const client = ctx ?? this.client;
    const [rows] = await client.query('SELECT * FROM products');
    return rows as Product[];
  }
}
