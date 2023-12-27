import { Product } from './Product';
import { ProductId } from './ProductId';

export const ProductRepositoryKey = 'ProductRepository';

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
  ids?: ProductId[];
}

export interface SaveProductOptions {
  products: Product | Product[];
}

export default interface IProductRepository {
  findProducts(options: FindProductOptions): Promise<Product[]>;
  save(options: SaveProductOptions): Promise<Product | Product[]>;
}
