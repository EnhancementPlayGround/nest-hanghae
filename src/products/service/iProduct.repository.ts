import { Product } from '@prisma/client';

export class WrongRangeError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export interface FindProductOptions {
  page: number;
  pageSize: number;
}

export interface SaveProductOptions {
  products: Product | Product[];
}

export default interface IProductRepository {
  findProducts(options: FindProductOptions): Promise<Product[]>;
  save(options: SaveProductOptions): Promise<Product | Product[]>;
}
