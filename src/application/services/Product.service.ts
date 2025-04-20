import { inject, injectable } from 'tsyringe';

import { Product } from '@/domain/entities/Product.entity';
import { type DataAccess } from '@/domain/repositories/DataAccess';

import { dependecyName } from '@/tools/dependencies.tool';
import {
  ADAPTER_DATABASE,
  PREFIX_ACCESS_DATA,
} from '@/constants/dependencies.enum';

@injectable()
export class ProductService {
  constructor(
    @inject(dependecyName(PREFIX_ACCESS_DATA, ADAPTER_DATABASE))
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
