import { Injectable, Inject } from '@nestjs/common';
import { Order, OrderItem } from '../../domain/orders/Order';
import { v1 as uuid } from 'uuid';
import IOrderRepository from '../../domain/orders/IOrderRepository';

export interface ICreateOrder {
  userId: string;
  orders: {
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepositry') private readonly repo: IOrderRepository,
  ) {}

  async createOrder({ userId, orders, totalAmount }: ICreateOrder) {
    const orderItems = orders.map(
      (order) => new OrderItem(uuid(), order.productId, order.quantity),
    );
    const order = new Order(uuid(), userId, totalAmount, orderItems);
    return await this.repo.save({ order });
  }
}
