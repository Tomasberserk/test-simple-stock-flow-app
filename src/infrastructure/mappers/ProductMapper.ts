import { Money } from '../../domain/model/Money.ts';
import { Product } from '../../domain/model/Product.ts';
import { ProductDto } from '../http/dto/api.dto.ts';

export class ProductMapper {
  public static toDomain(dto: ProductDto): Product {
    return new Product({
      id: dto.id,
      name: dto.name,
      price: new Money(dto.price),
      stock: dto.stock,
      categoryId: dto.categoryId,
      imageKey: dto.imageKey,
    });
  }

  public static toDomainList(dtos: ProductDto[]): Product[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
