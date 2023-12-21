export class InsufficientStockError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public quantity: number,
    public readonly registedAt: Date,
  ) {}

  purchase(quantityToPurchase: number): number {
    if (quantityToPurchase > this.quantity) {
      throw new InsufficientStockError('Insufficient stock');
    }

    this.quantity -= quantityToPurchase;
    const totalPrice = this.price * quantityToPurchase;
    return totalPrice;
  }

  getRemainingQuantity() {
    return this.quantity;
  }
}
