import { ProductId } from './ProductId';

export class InsufficientStockError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class Product {
  constructor(
    public readonly id: ProductId,
    public name: string,
    public price: number,
    public quantity: number,
    public readonly registedAt: Date,
  ) {}

  static create(param: {
    id: ProductId;
    name: string;
    price: number;
    quantity: number;
  }) {
    const { id, name, price, quantity } = param;

    return new Product(id, name, price, quantity, new Date());
  }

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
