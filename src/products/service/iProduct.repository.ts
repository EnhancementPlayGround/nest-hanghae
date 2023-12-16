import { Product } from '../domain/product';

export class WrongRangeError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export interface FindProductOptions {
  pageOption?: {
    page: number;
    pageSize: number;
  };
  ids?: string[];
}

export interface SaveProductOptions {
  products: Product | Product[];
}

export default interface IProductRepository {
  findProducts(options: FindProductOptions): Promise<Product[]>;
  save(options: SaveProductOptions): Promise<Product | Product[]>;
}
