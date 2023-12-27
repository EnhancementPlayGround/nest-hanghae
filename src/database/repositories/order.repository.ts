import IOrderRepository, {
  SaveOrderOptions,
} from '@/domain/orders/IOrderRepository';
import { Injectable } from '@nestjs/common';
import DatabaseClient from '../database.client';
import { OrderItem } from '@/domain/orders/Order';

@Injectable()
export default class OrderRepository implements IOrderRepository {
  constructor(private readonly client: DatabaseClient) {}

  async save({ order }: SaveOrderOptions) {
    const { id, orderItems, userId, totalAmount } = order;

    try {
      await this.client.order.create({
        data: {
          id,
          userId,
          totalAmount,
          orderItems: {
            create: orderItems.map((item) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });
    } catch (error) {
      await this.revertStockAndPoints(order.orderItems, userId, totalAmount);
      throw error;
    }

    return order;
  }

  private async revertStockAndPoints(
    orderItems: OrderItem[],
    userId: string,
    totalAmount: number,
  ) {
    await this.client.$transaction(async (prisma) => {
      // 각 상품의 재고 복구
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      // 사용자 포인트 복구
      await prisma.account.update({
        where: { userId: userId },
        data: { balance: { increment: totalAmount } },
      });
    });
  }
}
