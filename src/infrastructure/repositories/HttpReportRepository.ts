import { ReportRepository } from '../../application/ports/ReportRepository.ts';
import { SalesReport } from '../../domain/model/Report.ts';
import { HttpClient } from '../http/client.ts';
import { SalesReportResponseDto } from '../http/dto/api.dto.ts';
import { ReportMapper } from '../mappers/ReportMapper.ts';

export class HttpReportRepository implements ReportRepository {
  constructor(private readonly client: HttpClient) {}

  public async getSalesReport(from: string, to: string): Promise<SalesReport> {
    const dto = await this.client.get<SalesReportResponseDto>('/reports/sales', {
      from,
      to,
    });
    return ReportMapper.toDomain(dto);
  }
}
