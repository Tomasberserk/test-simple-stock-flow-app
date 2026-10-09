import { Money } from './Money.ts';
import { Product } from './Product.ts';

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}

export class Cart {
  readonly items: ReadonlyArray<CartItem>;

  constructor(items: ReadonlyArray<CartItem> = []) {
    this.items = items;
  }

  public addItem(product: Product, quantity: number): Cart {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }

    const existingIndex = this.items.findIndex(i => i.product.id === product.id);
    const currentQty = existingIndex >= 0 ? this.items[existingIndex].quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > product.stock) {
      throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}`);
    }

    const nextItems = [...this.items];
    if (existingIndex >= 0) {
      nextItems[existingIndex] = { product, quantity: newQty };
    } else {
      nextItems.push({ product, quantity: newQty });
    }

    return new Cart(nextItems);
  }

  public updateQuantity(productId: string, quantity: number): Cart {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    const item = this.items.find(i => i.product.id === productId);
    if (!item) {
      return this;
    }

    if (quantity > item.product.stock) {
      throw new Error(`Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}`);
    }

    const nextItems = this.items.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );

    return new Cart(nextItems);
  }

  public removeItem(productId: string): Cart {
    return new Cart(this.items.filter(i => i.product.id !== productId));
  }

  public clear(): Cart {
    return new Cart([]);
  }

  public getTotal(): Money {
    let total = new Money(0);
    for (const item of this.items) {
      total = total.add(item.product.price.multiply(item.quantity));
    }
    return total;
  }

  public getTotalUnits(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }
}
