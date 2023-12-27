import IOrderRepository, {
  SaveOrderOptions,
} from '@/domain/orders/IOrderRepository';
import { Injectable } from '@nestjs/common';
import DatabaseClient from '../../../core/DatabaseClient';
import { OrderEntityMapper } from './OrderEntityMapper';

@Injectable()
export default class OrderRepository implements IOrderRepository {
  constructor(
    private readonly client: DatabaseClient,
    private readonly orderMapper: OrderEntityMapper,
  ) {}

  async save({ order }: SaveOrderOptions) {
    const { id, orderItems, userId, totalAmount } = order;

    const orderEntity = await this.client.order.create({
      data: {
        id: id.key,
        userId,
        totalAmount,
        orderItems: {
          create: orderItems.map((item) => ({
            id: item.id.key,
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return this.orderMapper.toDomain(orderEntity);
  }
}
