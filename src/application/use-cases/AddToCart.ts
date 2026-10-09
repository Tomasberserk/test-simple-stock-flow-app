import { CartRepository } from '../ports/CartRepository.ts';
import { Cart } from '../../domain/model/Cart.ts';
import { Product } from '../../domain/model/Product.ts';

export class AddToCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  public execute(product: Product, quantity: number = 1): Cart {
    const currentCart = this.cartRepo.getCart();
    const updatedCart = currentCart.addItem(product, quantity);
    this.cartRepo.saveCart(updatedCart);
    return updatedCart;
  }

  public updateQuantity(productId: string, quantity: number): Cart {
    const currentCart = this.cartRepo.getCart();
    const updatedCart = currentCart.updateQuantity(productId, quantity);
    this.cartRepo.saveCart(updatedCart);
    return updatedCart;
  }

  public remove(productId: string): Cart {
    const currentCart = this.cartRepo.getCart();
    const updatedCart = currentCart.removeItem(productId);
    this.cartRepo.saveCart(updatedCart);
    return updatedCart;
  }

  public getCart(): Cart {
    return this.cartRepo.getCart();
  }

  public clear(): Cart {
    const emptyCart = new Cart([]);
    this.cartRepo.clear();
    return emptyCart;
  }
}
