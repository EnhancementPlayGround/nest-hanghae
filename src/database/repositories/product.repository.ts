import { Injectable } from '@nestjs/common';
import DatabaseClient from '@/database/database.client';
import { Product } from '@/products/domain/product';
import IProductRepository, {
  FindProductOptions,
  SaveProductOptions,
  WrongRangeError,
} from '@/products/service/IProduct.repository';

@Injectable()
export default class ProductRepository implements IProductRepository {
  constructor(private readonly client: DatabaseClient) {}

  async findProducts({ pageOption, ids }: FindProductOptions) {
    const skip = pageOption
      ? (pageOption.page - 1) * pageOption.pageSize
      : undefined;
    const take = pageOption ? pageOption.pageSize : undefined;

    if (pageOption && (pageOption.page < 1 || pageOption.pageSize < 1)) {
      throw new WrongRangeError('Page and pageSize must be greater than 0');
    }

    const whereCondition = ids && ids.length > 0 ? { id: { in: ids } } : {};

    const productEntities = await this.client.product.findMany({
      skip, // skip과 take는 pageOption이 있을 때만 적용됩니다.
      take,
      where: whereCondition,
      orderBy: {
        registedAt: 'desc',
      },
    });

    const products = productEntities.map(
      (entity) =>
        new Product(
          entity.id,
          entity.name,
          entity.price,
          entity.quantity,
          entity.registedAt,
        ),
    );

    return products;
  }

  async save({ products }: SaveProductOptions) {
    if (!Array.isArray(products)) {
      products = [products];
    }

    for (const product of products) {
      const { id, name, price, quantity, registedAt } = product;
  
      await this.client.product.upsert({
        where: { id },
        update: {
          name,
          price,
          quantity,
          registedAt,
        },
        create: {
          id,
          name,
          price,
          quantity,
          registedAt,
        },
      });
    }

    return products;
  }
}
