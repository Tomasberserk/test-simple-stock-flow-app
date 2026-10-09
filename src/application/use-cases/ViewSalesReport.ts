import { ReportRepository } from '../ports/ReportRepository.ts';
import { SalesReport } from '../../domain/model/Report.ts';

export class ViewSalesReportUseCase {
  constructor(private readonly reportRepo: ReportRepository) {}

  public async execute(from: string, to: string): Promise<SalesReport> {
    if (!from || !to) {
      throw new Error('Debe especificar ambas fechas (desde y hasta)');
    }
    return this.reportRepo.getSalesReport(from, to);
  }
}
