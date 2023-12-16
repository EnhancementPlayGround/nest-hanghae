import { Inject, Injectable } from '@nestjs/common';
import IProductRepository from './IProduct.repository';

export interface IFindProductsByPage {
  page: number;
  pageSize: number;
}

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepositry') private readonly repo: IProductRepository,
  ) {}

  async findProductsByPage(params: IFindProductsByPage) {
    return this.repo.findProducts(params);
  }
}
