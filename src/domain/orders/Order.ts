import { ProductId } from '../products/ProductId';
import { OrderId } from './OderId';
import { OrderItemId } from './OrderItemId';

export class Order {
  constructor(
    public readonly id: OrderId,
    public readonly userId: string,
    public readonly totalAmount: number,
    public readonly orderItems: OrderItem[],
  ) {}

  static create(param: {
    id: OrderId;
    userId: string;
    totalAmount: number;
    orderItems: OrderItem[];
  }) {
    const { id, userId, totalAmount, orderItems } = param;

    return new Order(id, userId, totalAmount, orderItems);
  }
}

export class OrderItem {
  constructor(
    public readonly id: OrderItemId,
    public readonly productId: ProductId,
    public readonly quantity: number,
  ) {}

  static create(param: { id: OrderId; productId: string; quantity: number }) {
    const { id, productId, quantity } = param;

    return new OrderItem(id, new ProductId(productId), quantity);
  }
}
