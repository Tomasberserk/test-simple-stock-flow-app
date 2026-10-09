import { ProductRepository } from '../ports/ProductRepository.ts';
import { Product } from '../../domain/model/Product.ts';

export class ManageCatalogUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  public async createProduct(data: { name: string; price: number; stock: number; categoryId: string }): Promise<Product> {
    return this.productRepo.create(data);
  }

  public async updateProduct(id: string, data: { name: string; price: number; stock: number; categoryId: string }): Promise<Product> {
    return this.productRepo.update(id, data);
  }

  public async deleteProduct(id: string): Promise<void> {
    return this.productRepo.delete(id);
  }

  public async uploadImage(id: string, file: File): Promise<Product> {
    return this.productRepo.uploadImage(id, file);
  }
}
