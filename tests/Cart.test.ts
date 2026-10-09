import test from 'node:test';
import assert from 'node:assert/strict';
import { Money } from '../src/domain/model/Money.ts';
import { Product } from '../src/domain/model/Product.ts';
import { Cart } from '../src/domain/model/Cart.ts';
import { AddToCartUseCase } from '../src/application/use-cases/AddToCart.ts';
import { CheckoutUseCase } from '../src/application/use-cases/Checkout.ts';
import { CartRepository } from '../src/application/ports/CartRepository.ts';
import { SaleRepository } from '../src/application/ports/SaleRepository.ts';
import { Sale } from '../src/domain/model/Sale.ts';

// Fake in-memory CartRepository
class InMemoryCartRepo implements CartRepository {
  private cart: Cart = new Cart([]);
  getCart(): Cart { return this.cart; }
  saveCart(cart: Cart): void { this.cart = cart; }
  clear(): void { this.cart = new Cart([]); }
}

// Fake SaleRepository
class FakeSaleRepo implements SaleRepository {
  public placedSale: boolean = false;
  async placeSale(items: { productId: string; quantity: number }[]): Promise<Sale> {
    this.placedSale = true;
    return new Sale({
      id: 'fake-sale-id',
      soldAt: new Date().toISOString(),
      soldByUserId: 'fake-user-id',
      soldBy: 'seller',
      items: [],
      total: new Money(100),
    });
  }
  async listSales() { return { items: [], total: 0, totalPages: 0 }; }
  async getSaleById() { return null; }
}

test('Money Value Object precision and immutability', () => {
  const m1 = new Money(25.5);
  const m2 = new Money('10.25');
  const sum = m1.add(m2);

  assert.equal(sum.getAmount(), 35.75);
  assert.equal(m1.multiply(3).getAmount(), 76.5);
});

test('Product aggregate enforces business invariants', () => {
  const product = new Product({
    id: 'p-1',
    name: 'Taladro Percutor',
    price: new Money(120),
    stock: 5,
    categoryId: 'cat-1',
    imageKey: null,
  });

  assert.equal(product.isAvailable(), true);
  assert.equal(product.canFulfill(5), true);
  assert.equal(product.canFulfill(6), false);

  // Reject empty name
  assert.throws(() => new Product({
    id: 'p-2',
    name: '   ',
    price: new Money(10),
    stock: 2,
    categoryId: 'c-1',
    imageKey: null,
  }), /nombre/);
});

test('Cart aggregate manages items and calculates total dynamically', () => {
  const product1 = new Product({
    id: 'p-1',
    name: 'Martillo',
    price: new Money(25),
    stock: 10,
    categoryId: 'c-1',
    imageKey: null,
  });

  const product2 = new Product({
    id: 'p-2',
    name: 'Destornillador',
    price: new Money(15),
    stock: 4,
    categoryId: 'c-1',
    imageKey: null,
  });

  let cart = new Cart([]);
  cart = cart.addItem(product1, 2);
  cart = cart.addItem(product2, 1);

  assert.equal(cart.getTotalUnits(), 3);
  assert.equal(cart.getTotal().getAmount(), 65); // 2*25 + 1*15

  // Enforces stock limit locally
  assert.throws(() => cart.addItem(product2, 5), /Stock insuficiente/);
});

test('AddToCart and Checkout use cases execute pure business flow without browser or server', async () => {
  const cartRepo = new InMemoryCartRepo();
  const saleRepo = new FakeSaleRepo();

  const addUseCase = new AddToCartUseCase(cartRepo);
  const checkoutUseCase = new CheckoutUseCase(cartRepo, saleRepo);

  const product = new Product({
    id: 'p-1',
    name: 'Sierra Circular',
    price: new Money(200),
    stock: 3,
    categoryId: 'c-1',
    imageKey: null,
  });

  addUseCase.execute(product, 2);
  assert.equal(cartRepo.getCart().getTotalUnits(), 2);

  const sale = await checkoutUseCase.execute();
  assert.equal(sale.id, 'fake-sale-id');
  assert.equal(saleRepo.placedSale, true);
  assert.equal(cartRepo.getCart().isEmpty(), true); // Cart cleared
});
