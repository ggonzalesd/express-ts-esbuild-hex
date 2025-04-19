import { inject, injectable } from 'tsyringe';

import { Product } from '@/domain/entities/Product.entity';
import { type DataAccess } from '@/domain/repositories/DataAccess';

import { dependecyName } from '@/tools/dependencies.tool';
import { PREFIX_ACCESS_DATA } from '@/constants/dependencies.enum';

import envConfig from '@/config/env.config';

@injectable()
export class ProductService {
  constructor(
    @inject(dependecyName(PREFIX_ACCESS_DATA, envConfig.DB_DIALECT))
    private dataAccess: DataAccess,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.dataAccess.transaction.run(async (ctx) => {
      const products = await this.dataAccess.product.findAll(ctx);
      return products;
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.dataAccess.product.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }
}
