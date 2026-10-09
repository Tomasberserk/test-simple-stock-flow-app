import { Money } from './Money.ts';

export interface SaleItemProps {
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: Money;
  subtotal: Money;
}

export class SaleItem {
  readonly id: string;
  readonly productId: string;
  readonly productName: string;
  readonly categoryName: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  readonly subtotal: Money;

  constructor(props: SaleItemProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.productName = props.productName;
    this.categoryName = props.categoryName;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.subtotal = props.subtotal;
  }
}

export interface SaleProps {
  id: string;
  soldAt: string;
  soldByUserId: string;
  soldBy: string;
  items: SaleItem[];
  total: Money;
}

export class Sale {
  readonly id: string;
  readonly soldAt: string;
  readonly soldByUserId: string;
  readonly soldBy: string;
  readonly items: SaleItem[];
  readonly total: Money;

  constructor(props: SaleProps) {
    this.id = props.id;
    this.soldAt = props.soldAt;
    this.soldByUserId = props.soldByUserId;
    this.soldBy = props.soldBy;
    this.items = props.items;
    this.total = props.total;
  }
}
