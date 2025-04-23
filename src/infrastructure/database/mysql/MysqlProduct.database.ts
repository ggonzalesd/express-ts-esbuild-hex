import { inject, injectable } from 'tsyringe';
import { type Pool } from 'mysql2/promise';

import { Product } from '@@core/entities/Product.entity';

import { type TransactionContext } from '@@core/repositories/TransactionManager.port';
import { type ProductRepository } from '@@core/repositories/ProductRepository.port';

import { DEP_MYSQL_POOL } from './Mysql.config';

type Repository = ProductRepository<'mysql'>;
type CTX = TransactionContext<'mysql'>;

@injectable()
export class MysqlProductDB implements Repository {
  constructor(@inject(DEP_MYSQL_POOL) private client: Pool) {}

  async findAll(ctx?: CTX): Promise<Product[]> {
    const client = ctx ?? this.client;
    const [rows] = await client.query('SELECT * FROM products');
    return rows as Product[];
  }

  async findById(id: string, ctx?: CTX): Promise<Product | null> {
    const client = ctx ?? this.client;
    const [rows] = await client.query('SELECT * FROM products WHERE id = ?', [
      id,
    ]);
    return (rows as Product[])[0] || null;
  }
}
