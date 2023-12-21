import { Order } from '../domain/order';

export interface SaveOrderOptions {
  order: Order;
}

export default interface IOrderRepository {
  save(options: SaveOrderOptions): Promise<Order>;
}
