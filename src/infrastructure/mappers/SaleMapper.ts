import { Money } from '../../domain/model/Money.ts';
import { Sale, SaleItem } from '../../domain/model/Sale.ts';
import { SaleItemResponseDto, SaleResponseDto } from '../http/dto/api.dto.ts';

export class SaleMapper {
  public static itemToDomain(dto: SaleItemResponseDto): SaleItem {
    return new SaleItem({
      id: dto.id,
      productId: dto.productId,
      productName: dto.productName,
      categoryName: dto.categoryName,
      quantity: dto.quantity,
      unitPrice: new Money(dto.unitPrice),
      subtotal: new Money(dto.subtotal),
    });
  }

  public static toDomain(dto: SaleResponseDto): Sale {
    return new Sale({
      id: dto.id,
      soldAt: dto.soldAt,
      soldByUserId: dto.soldByUserId,
      soldBy: dto.soldBy,
      items: dto.items.map(i => this.itemToDomain(i)),
      total: new Money(dto.total),
    });
  }

  public static toDomainList(dtos: SaleResponseDto[]): Sale[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
