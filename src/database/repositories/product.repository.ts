import { Injectable } from '@nestjs/common';
import DatabaseClient from '@/database/database.client';
import { Product } from '@/products/domain/product';
import IProductRepository, {
  FindProductOptions,
  SaveProductOptions,
  WrongRangeError,
} from '@/products/service/iProduct.repository';

@Injectable()
export default class ProductRepository implements IProductRepository {
  constructor(private readonly client: DatabaseClient) {}

  async findProducts({ page = 1, pageSize = 10 }: FindProductOptions) {
    if (page < 1 || pageSize < 1) {
      throw new WrongRangeError('Page and pageSize must be greater than 0');
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const productEntitis = await this.client.product.findMany({
      skip,
      take,
      orderBy: {
        registedAt: 'desc',
      },
    });

    const products = productEntitis.map(
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

    const productData = products.map(
      ({ id, name, price, quantity, registedAt }) => ({
        id,
        name,
        price,
        quantity,
        registedAt,
      }),
    );

    await this.client.product.createMany({
      data: productData,
      skipDuplicates: true,
    });

    return products;
  }
}
