import { Product } from '@/domain/entities/Product.entity';
import { ProductRepository } from '@/domain/repositories/ProductRepository';
import { TransactionManager } from '@/domain/repositories/TransactionManager';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private transactionManager: TransactionManager,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.transactionManager.run(async (ctx) => {
      const products = await this.productRepository.findAll(ctx);
      return products;
    });
  }
}
