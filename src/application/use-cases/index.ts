import {
  cartRepository,
  productRepository,
  reportRepository,
  saleRepository,
  sessionRepository,
} from '../../infrastructure/providers.ts';
import { AddToCartUseCase } from './AddToCart.ts';
import { BrowseCatalogUseCase } from './BrowseCatalog.ts';
import { CheckoutUseCase } from './Checkout.ts';
import { LoginUseCase } from './Login.ts';
import { ManageCatalogUseCase } from './ManageCatalog.ts';
import { ViewSalesReportUseCase } from './ViewSalesReport.ts';

// Instancias de casos de uso ensambladas con sus respectivos adaptadores
export const browseCatalogUseCase = new BrowseCatalogUseCase(productRepository);
export const addToCartUseCase = new AddToCartUseCase(cartRepository);
export const checkoutUseCase = new CheckoutUseCase(cartRepository, saleRepository);
export const loginUseCase = new LoginUseCase(sessionRepository);
export const viewSalesReportUseCase = new ViewSalesReportUseCase(reportRepository);
export const manageCatalogUseCase = new ManageCatalogUseCase(productRepository);
