import { Injectable } from '@nestjs/common';
import { Product as ProductEntity } from '@prisma/client';
import { EntityMapper } from '../EntityMapper';
import { Product } from '@/domain/products/Product';
import { ProductId } from '@/domain/products/ProductId';

@Injectable()
export class ProductEntityMapper extends EntityMapper<
  Product,
  ProductId,
  ProductEntity
> {
  toDomain(entity: ProductEntity): Product {
    const { id, name, price, quantity, registedAt } = entity;
    return new Product(new ProductId(id), name, price, quantity, registedAt);
  }
}
