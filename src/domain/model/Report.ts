import { Money } from './Money.ts';

export interface SalesReportRowProps {
  productId: string;
  productName: string;
  categoryName: string;
  unitsSold: number;
  revenue: Money;
}

export class SalesReportRow {
  readonly productId: string;
  readonly productName: string;
  readonly categoryName: string;
  readonly unitsSold: number;
  readonly revenue: Money;

  constructor(props: SalesReportRowProps) {
    this.productId = props.productId;
    this.productName = props.productName;
    this.categoryName = props.categoryName;
    this.unitsSold = props.unitsSold;
    this.revenue = props.revenue;
  }
}

export interface SalesReportProps {
  startDate: string;
  endDate: string;
  totalSalesCount: number;
  grandTotal: Money;
  items: SalesReportRow[];
}

export class SalesReport {
  readonly startDate: string;
  readonly endDate: string;
  readonly totalSalesCount: number;
  readonly grandTotal: Money;
  readonly items: SalesReportRow[];

  constructor(props: SalesReportProps) {
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.totalSalesCount = props.totalSalesCount;
    this.grandTotal = props.grandTotal;
    this.items = props.items;
  }
}
