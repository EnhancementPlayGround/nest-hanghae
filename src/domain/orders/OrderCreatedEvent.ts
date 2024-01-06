export default class OrderCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly orders: {
      productId: string;
      quantity: number;
    }[],
    public readonly totalAmount: number,
  ) {}
}
