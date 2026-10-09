import { Product } from '../../domain/model/Product.ts';

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface ProductRepository {
  search(query?: string, categoryId?: string, page?: number, perPage?: number): Promise<ProductListResult>;
  getById(id: string): Promise<Product | null>;
  create(data: { name: string; price: number; stock: number; categoryId: string }): Promise<Product>;
  update(id: string, data: { name: string; price: number; stock: number; categoryId: string }): Promise<Product>;
  delete(id: string): Promise<void>;
  uploadImage(id: string, file: File): Promise<Product>;
  getCategories(): Promise<CategoryItem[]>;
}
