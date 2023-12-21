import { Inject, Injectable } from '@nestjs/common';
import IProductRepository from './IProduct.repository';

export interface IFindProductsByPage {
  page: number;
  pageSize: number;
}

export interface IFindProductsByIds {
  ids: string[];
}

export interface IPurchaseProducts {
  productQuantities: {
    productId: string;
    quantity: number;
  }[];
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

  async purchaseProducts({ productQuantities }: IPurchaseProducts) {
    const ids = productQuantities.map((pq) => pq.productId);
    const products = await this.repo.findProducts({ ids });

    let totalAmount = 0;

    for (const product of products) {
      const { quantity } = productQuantities.find(
        (pq) => pq.productId === product.id,
      );

      const amount = product.purchase(quantity);
      totalAmount += amount;
    }

    await this.repo.save({ products });

    return totalAmount;
  }
}
