import { Inject, Injectable } from '@nestjs/common';
import IProductRepository from './IProduct.repository';

export interface IFindProductsByPage {
  page: number;
  pageSize: number;
}

export interface IFindProductsByIds {
  ids: string[];
}

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepositry') private readonly repo: IProductRepository,
  ) {}

  async findProductsByPage({ page, pageSize }: IFindProductsByPage) {
    return this.repo.findProducts({ pageOption: { page, pageSize } });
  }

  async findProductsByIds({ ids }: IFindProductsByIds) {
    return this.repo.findProducts({ ids });
  }
}
