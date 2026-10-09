import { CategoryItem, ProductListResult, ProductRepository } from '../ports/ProductRepository.ts';

export class BrowseCatalogUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  public async execute(query?: string, categoryId?: string, page: number = 1, perPage: number = 20): Promise<ProductListResult> {
    return this.productRepo.search(query, categoryId, page, perPage);
  }

  public async getCategories(): Promise<CategoryItem[]> {
    return this.productRepo.getCategories();
  }
}
