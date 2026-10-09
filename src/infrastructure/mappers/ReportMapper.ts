import { Money } from '../../domain/model/Money.ts';
import { SalesReport, SalesReportRow } from '../../domain/model/Report.ts';
import { SalesReportResponseDto, SalesReportRowDto } from '../http/dto/api.dto.ts';

export class ReportMapper {
  public static rowToDomain(dto: SalesReportRowDto): SalesReportRow {
    return new SalesReportRow({
      productId: dto.productId,
      productName: dto.productName,
      categoryName: dto.categoryName,
      unitsSold: dto.unitsSold,
      revenue: new Money(dto.revenue),
    });
  }

  public static toDomain(dto: SalesReportResponseDto): SalesReport {
    return new SalesReport({
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalSalesCount: dto.totalSalesCount,
      grandTotal: new Money(dto.grandTotal),
      items: dto.items.map(row => this.rowToDomain(row)),
    });
  }
}
