import { Order } from './Order';

export const OrderRepositoryKey = 'OrderRepository';

export interface SaveOrderOptions {
  order: Order;
}

export default interface IOrderRepository {
  save(options: SaveOrderOptions): Promise<Order>;
}
