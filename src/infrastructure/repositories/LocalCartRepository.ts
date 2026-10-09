import { CartRepository } from '../../application/ports/CartRepository.ts';
import { Cart } from '../../domain/model/Cart.ts';
import { Money } from '../../domain/model/Money.ts';
import { Product } from '../../domain/model/Product.ts';

const CART_STORAGE_KEY = 'simple_stock_flow_cart';

export class LocalCartRepository implements CartRepository {
  public getCart(): Cart {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      if (!data) return new Cart([]);

      const rawItems = JSON.parse(data) as Array<{
        product: { id: string; name: string; price: number; stock: number; categoryId: string; imageKey: string | null };
        quantity: number;
      }>;

      const items = rawItems.map(item => ({
        product: new Product({
          id: item.product.id,
          name: item.product.name,
          price: new Money(item.product.price),
          stock: item.product.stock,
          categoryId: item.product.categoryId,
          imageKey: item.product.imageKey,
        }),
        quantity: item.quantity,
      }));

      return new Cart(items);
    } catch {
      return new Cart([]);
    }
  }

  public saveCart(cart: Cart): void {
    const rawItems = cart.items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price.getAmount(),
        stock: item.product.stock,
        categoryId: item.product.categoryId,
        imageKey: item.product.imageKey,
      },
      quantity: item.quantity,
    }));

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(rawItems));
  }

  public clear(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
}
