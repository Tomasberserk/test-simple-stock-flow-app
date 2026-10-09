import { Cart } from '../../domain/model/Cart.ts';

export interface CartRepository {
  getCart(): Cart;
  saveCart(cart: Cart): void;
  clear(): void;
}
