import { CategoryItem, ProductListResult, ProductRepository } from '../../application/ports/ProductRepository.ts';
import { Product } from '../../domain/model/Product.ts';
import { HttpClient } from '../http/client.ts';
import { CategoryDto, ProductDto, ProductListResponseDto } from '../http/dto/api.dto.ts';
import { ProductMapper } from '../mappers/ProductMapper.ts';

export class HttpProductRepository implements ProductRepository {
  constructor(private readonly client: HttpClient) {}

  public async search(query?: string, categoryId?: string, page: number = 1, perPage: number = 20): Promise<ProductListResult> {
    const response = await this.client.get<ProductListResponseDto>('/products', {
      query: query || undefined,
      categoryId: categoryId || undefined,
      page,
      perPage,
    });

    return {
      items: ProductMapper.toDomainList(response.items),
      total: response.total,
      page: response.page,
      perPage: response.perPage,
      totalPages: response.totalPages,
    };
  }

  public async getById(id: string): Promise<Product | null> {
    try {
      const dto = await this.client.get<ProductDto>(`/products/${id}`);
      return ProductMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  public async create(data: { name: string; price: number; stock: number; categoryId: string }): Promise<Product> {
    const dto = await this.client.post<ProductDto>('/products', data);
    return ProductMapper.toDomain(dto);
  }

  public async update(id: string, data: { name: string; price: number; stock: number; categoryId: string }): Promise<Product> {
    const dto = await this.client.put<ProductDto>(`/products/${id}`, data);
    return ProductMapper.toDomain(dto);
  }

  public async delete(id: string): Promise<void> {
    await this.client.delete(`/products/${id}`);
  }

  public async uploadImage(id: string, file: File): Promise<Product> {
    const formData = new FormData();
    formData.append('image', file);
    const dto = await this.client.postFormData<ProductDto>(`/products/${id}/image`, formData);
    return ProductMapper.toDomain(dto);
  }

  public async getCategories(): Promise<CategoryItem[]> {
    const dtos = await this.client.get<CategoryDto[]>('/categories');
    return dtos.map(d => ({ id: d.id, name: d.name }));
  }
}
