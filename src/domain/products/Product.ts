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

  decreaseQuantity(quantityToDecrease: number): number {
    if (quantityToDecrease > this.quantity) {
      throw new InsufficientStockError('Insufficient stock');
    }

    this.quantity -= quantityToDecrease;
    return this.quantity;
  }

  increaseQuantity(quantityToIncrease: number): number {
    if (quantityToIncrease < 0) {
      throw new InsufficientStockError('Insufficient stock');
    }

    this.quantity += quantityToIncrease;
    return this.quantity;
  }

  getRemainingQuantity() {
    return this.quantity;
  }
}
