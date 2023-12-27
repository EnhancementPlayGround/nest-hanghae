import { Inject, Injectable } from '@nestjs/common';
import IProductRepository, { ProductRepositoryKey } from '../../domain/products/IProductRepository';
import { ProductId } from '@/domain/products/ProductId';

export interface IFindProductsByPage {
  page: number;
  pageSize: number;
}

export interface IFindProductsByIds {
  ids: ProductId[];
}

export interface IPurchaseProducts {
  productQuantities: {
    productId: ProductId;
    quantity: number;
  }[];
}

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepositoryKey) private readonly repo: IProductRepository,
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
      const { quantity } = productQuantities.find((pq) =>
        pq.productId.equals(product.id),
      );

      const amount = product.purchase(quantity);
      totalAmount += amount;
    }

    await this.repo.save({ products });

    return totalAmount;
  }
}
