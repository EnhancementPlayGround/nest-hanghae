import { Injectable } from '@nestjs/common';
import { OrderItem as OrderItemEntity } from '@prisma/client';
import { EntityMapper } from '../EntityMapper';
import Account from '@/domain/accounts/Account';
import { AccountId } from '@/domain/accounts/AccountId';
import { Order, OrderItem } from '@/domain/orders/Order';
import { OrderId } from '@/domain/orders/OderId';
import { OrderItemId } from '@/domain/orders/OrderItemId';
import { ProductId } from '@/domain/products/ProductId';

@Injectable()
export class OrderItemEntityMapper extends EntityMapper<
  OrderItem,
  OrderItemId,
  OrderItemEntity
> {
  toDomain(entity: OrderItemEntity): OrderItem {
    const { id, productId, quantity } = entity;
    return new OrderItem(
      new OrderItemId(id),
      new ProductId(productId),
      quantity,
    );
  }

  toEntity(
    domain: OrderItem & {
      orderId: OrderId;
    },
  ): OrderItemEntity {
    const { id, productId, quantity, orderId } = domain;

    return {
      id: id.key,
      productId: productId.key,
      quantity,
      orderId: orderId.key,
    };
  }
}
