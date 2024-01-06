import { InsufficientStockError, Product } from './Product';
import * as faker from 'faker';
import { ProductId } from './ProductId';

describe('상품 구매 테스트', () => {
  it('구매 수량이 상품 수량보다 많으면 구매할 수 없다.', () => {
    const product = createProduct(1000, 1);
    const amount = 10;

    expect(() => product.decreaseQuantity(amount)).toThrow(
      new InsufficientStockError('Insufficient stock'),
    );
  });

  it('총 가격을 계산할 수 있다.', () => {
    const product = createProduct(1000, 20);
    const amount = 10;

    const totalPrice = product.decreaseQuantity(amount);
    const remainingQuantity = product.getRemainingQuantity();

    expect(totalPrice).toEqual(10000);
    expect(remainingQuantity).toEqual(10);
  });

  function createProduct(price: number, quantity: number) {
    return Product.create({
      id: new ProductId(faker.datatype.uuid()),
      name: faker.commerce.productName(),
      price,
      quantity,
    });
  }
});
