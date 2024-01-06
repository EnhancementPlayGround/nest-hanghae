import { Inject, Injectable } from '@nestjs/common';
import IProductRepository, {
  ProductRepositoryKey,
} from '../../domain/products/IProductRepository';
import { ProductId } from '@/domain/products/ProductId';
import { DistributedLock } from '@/core/distributed-lock/DistributedLockDecorator';

export interface IFindProductsByPage {
  page: number;
  pageSize: number;
}

export interface IFindProductsByIds {
  ids: string[];
}

export interface IDecreaseProductsQuantity {
  productQuantities: {
    productId: string;
    quantity: number;
  }[];
}

export interface IIecreaseProductsQuantity {
  productQuantities: {
    productId: string;
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
    return this.repo.findProducts({ ids: ids.map((id) => new ProductId(id)) });
  }

  @DistributedLock({ lockName: 'products' })
  async purchaseProducts({ productQuantities }: IDecreaseProductsQuantity) {
    const ids = productQuantities.map((pq) => pq.productId);
    const products = await this.repo.findProducts({
      ids: ids.map((id) => new ProductId(id)),
    });

    let totalAmount = 0;

    for (const product of products) {
      const { quantity } = productQuantities.find(
        (pq) => pq.productId === product.id.key,
      );

      product.decreaseQuantity(quantity);
      totalAmount += product.price * quantity;
    }

    await this.repo.save({ products });

    return totalAmount;
  }

  @DistributedLock({ lockName: 'products' })
  async increaseProductsQuantity({
    productQuantities,
  }: IIecreaseProductsQuantity) {
    const ids = productQuantities.map((pq) => pq.productId);
    const products = await this.repo.findProducts({
      ids: ids.map((id) => new ProductId(id)),
    });

    let totalAmount = 0;

    for (const product of products) {
      const { quantity } = productQuantities.find(
        (pq) => pq.productId === product.id.key,
      );

      const amount = product.increaseQuantity(quantity);
      totalAmount += amount;
    }

    return await this.repo.save({ products });
  }
}
