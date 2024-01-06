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

  decreaseQuantity(quantityTodecreaseQuantity: number): number {
    if (quantityTodecreaseQuantity > this.quantity) {
      throw new InsufficientStockError('Insufficient stock');
    }

    this.quantity -= quantityTodecreaseQuantity;
    const totalPrice = this.price * quantityTodecreaseQuantity;
    return totalPrice;
  }

  getRemainingQuantity() {
    return this.quantity;
  }
}
