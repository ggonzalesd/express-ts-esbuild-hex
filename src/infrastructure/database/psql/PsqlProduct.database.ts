import { inject, injectable } from 'tsyringe';
import { type Pool } from 'pg';

import { Product } from '@@core/entities/Product.entity';

import { type TransactionContext } from '@@core/repositories/TransactionManager.port';
import { type ProductRepository } from '@@core/repositories/ProductRepository.port';

import { DEP_PG_POOL } from './Psql.config';

type Repository = ProductRepository<'pg'>;
type CTX = TransactionContext<'pg'>;

@injectable()
export class PsqlProductDB implements Repository {
  constructor(@inject(DEP_PG_POOL) private client: Pool) {}

  async findAll(ctx?: CTX): Promise<Product[]> {
    const client = ctx ?? this.client;
    const result = await client.query<Product>('SELECT * FROM products');
    return result.rows;
  }

  async findById(id: string, ctx?: CTX): Promise<Product | null> {
    const client = ctx ?? this.client;
    const result = await client.query<Product>(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }
}
