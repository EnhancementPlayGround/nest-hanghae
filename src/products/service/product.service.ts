import { Injectable } from '@nestjs/common';
import IProductRepository from './iProduct.repository';

export interface IFindProductsByPage {
  page: number;
  pageSize: number;
}

@Injectable()
export class ProductService {
  constructor(private readonly repo: IProductRepository) {}

  async findProductsByPage(params: IFindProductsByPage) {
    return this.repo.findProducts(params);
  }
}
