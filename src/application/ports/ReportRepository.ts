import { SalesReport } from '../../domain/model/Report.ts';

export interface ReportRepository {
  getSalesReport(from: string, to: string): Promise<SalesReport>;
}
