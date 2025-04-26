import { Product } from '@@core/entities/Product.entity';

import { type ProductRepository } from '@@core/repositories/ProductRepository.port';
import { PoolClient, PoolQuery } from '@/domain/repositories/DataAccess.port';

export class PsqlProductDB implements ProductRepository {
  constructor(private client: PoolClient) {}

  async findAll(ctx?: PoolQuery): Promise<Product[]> {
    const client = ctx ?? this.client;
    const result = await client.query<Product[]>('SELECT * FROM products');
    return result;
  }

  async findById(id: string, ctx?: PoolQuery): Promise<Product | null> {
    const client = ctx ?? this.client;
    const result = await client.query<Product[]>(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    return result[0] || null;
  }
}
