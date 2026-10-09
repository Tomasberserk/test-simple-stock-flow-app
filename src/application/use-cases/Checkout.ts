import { CartRepository } from '../ports/CartRepository.ts';
import { SaleRepository } from '../ports/SaleRepository.ts';
import { Sale } from '../../domain/model/Sale.ts';

export class CheckoutUseCase {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly saleRepo: SaleRepository
  ) {}

  public async execute(): Promise<Sale> {
    const cart = this.cartRepo.getCart();

    if (cart.isEmpty()) {
      throw new Error('El carrito de compras está vacío');
    }

    const items = cart.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const sale = await this.saleRepo.placeSale(items);

    // Si la venta fue exitosa, vaciar el carrito
    this.cartRepo.clear();

    return sale;
  }
}
