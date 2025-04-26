import { Product } from '@@core/entities/Product.entity';
import { type DataAccess } from '@@core/repositories/DataAccess.port';

export class ProductService {
  constructor(private dataAccess: DataAccess) {}

  async getAllProducts(): Promise<Product[]> {
    return this.dataAccess.transaction(async () => {
      const products = await this.dataAccess.product.findAll();
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
