import { SaleListResult, SaleRepository } from '../../application/ports/SaleRepository.ts';
import { Sale } from '../../domain/model/Sale.ts';
import { HttpClient } from '../http/client.ts';
import { PlaceSaleRequestDto, SaleListResponseDto, SaleResponseDto } from '../http/dto/api.dto.ts';
import { SaleMapper } from '../mappers/SaleMapper.ts';

export class HttpSaleRepository implements SaleRepository {
  constructor(private readonly client: HttpClient) {}

  public async placeSale(items: { productId: string; quantity: number }[]): Promise<Sale> {
    const payload: PlaceSaleRequestDto = { items };
    const dto = await this.client.post<SaleResponseDto>('/sales', payload);
    return SaleMapper.toDomain(dto);
  }

  public async listSales(page: number = 1, perPage: number = 20): Promise<SaleListResult> {
    const res = await this.client.get<SaleListResponseDto>('/sales', { page, perPage });
    return {
      items: SaleMapper.toDomainList(res.items),
      total: res.total,
      totalPages: res.totalPages,
    };
  }

  public async getSaleById(id: string): Promise<Sale | null> {
    try {
      const dto = await this.client.get<SaleResponseDto>(`/sales/${id}`);
      return SaleMapper.toDomain(dto);
    } catch {
      return null;
    }
  }
}
