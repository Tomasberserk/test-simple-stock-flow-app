import { httpClient } from './http/client.ts';
import { HttpProductRepository } from './repositories/HttpProductRepository.ts';
import { LocalCartRepository } from './repositories/LocalCartRepository.ts';
import { HttpSessionRepository } from './repositories/HttpSessionRepository.ts';
import { HttpSaleRepository } from './repositories/HttpSaleRepository.ts';
import { HttpReportRepository } from './repositories/HttpReportRepository.ts';

// Composition root del Frontend: ensambla los adaptadores con sus puertos
export const productRepository = new HttpProductRepository(httpClient);
export const cartRepository = new LocalCartRepository();
export const sessionRepository = new HttpSessionRepository(httpClient);
export const saleRepository = new HttpSaleRepository(httpClient);
export const reportRepository = new HttpReportRepository(httpClient);
