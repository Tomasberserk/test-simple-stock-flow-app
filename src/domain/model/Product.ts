import { Money } from './Money.ts';

export interface ProductProps {
  id: string;
  name: string;
  price: Money;
  stock: number;
  categoryId: string;
  imageKey: string | null;
}

export class Product {
  readonly id: string;
  readonly name: string;
  readonly price: Money;
  readonly stock: number;
  readonly categoryId: string;
  readonly imageKey: string | null;

  constructor(props: ProductProps) {
    if (!props.name || props.name.trim() === '') {
      throw new Error('El nombre del producto no puede estar vacío');
    }
    if (!props.price.isPositive()) {
      throw new Error('El precio del producto debe ser mayor a cero');
    }
    if (props.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    this.id = props.id;
    this.name = props.name.trim();
    this.price = props.price;
    this.stock = props.stock;
    this.categoryId = props.categoryId;
    this.imageKey = props.imageKey;
  }

  public isAvailable(): boolean {
    return this.stock > 0;
  }

  public canFulfill(quantity: number): boolean {
    return quantity > 0 && quantity <= this.stock;
  }
}
