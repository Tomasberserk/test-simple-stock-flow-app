import { Sale } from '../../domain/model/Sale.ts';

export interface SaleListResult {
  items: Sale[];
  total: number;
  totalPages: number;
}

export interface SaleRepository {
  placeSale(items: { productId: string; quantity: number }[]): Promise<Sale>;
  listSales(page?: number, perPage?: number): Promise<SaleListResult>;
  getSaleById(id: string): Promise<Sale | null>;
}
