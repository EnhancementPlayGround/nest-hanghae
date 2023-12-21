export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly totalAmount: number,
    public readonly orderItems: OrderItem[],
  ) {}
}

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}
