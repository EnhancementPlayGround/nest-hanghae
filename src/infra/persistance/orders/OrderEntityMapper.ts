import { Injectable } from '@nestjs/common';
import { Order as OrderEntity, OrderItem } from '@prisma/client';
import { EntityMapper } from '../EntityMapper';
import Account from '@/domain/accounts/Account';
import { AccountId } from '@/domain/accounts/AccountId';
import { Order } from '@/domain/orders/Order';
import { OrderId } from '@/domain/orders/OderId';
import { OrderItemEntityMapper } from './OrderItemEntityMapper';

@Injectable()
export class OrderEntityMapper extends EntityMapper<
  Order,
  OrderId,
  OrderEntity
> {
  constructor(private readonly orderItemEntityMapper: OrderItemEntityMapper) {
    super();
  }

  toDomain(
    entity: OrderEntity & {
      orderItems: OrderItem[];
    },
  ): Order {
    const { id, userId, totalAmount } = entity;
    const orderItems = entity.orderItems.map((orderItem) =>
      this.orderItemEntityMapper.toDomain(orderItem),
    );
    return new Order(new OrderId(id), userId, totalAmount, orderItems);
  }

  toEntity(domain: Order): OrderEntity & {
    orderItems: OrderItem[];
  } {
    const { id, userId, totalAmount, orderItems } = domain;
    return {
      id: id.key,
      userId,
      totalAmount,
      orderItems: orderItems.map((item) =>
        this.orderItemEntityMapper.toEntity({
          ...item,
          orderId: id,
        }),
      ),
    };
  }
}
