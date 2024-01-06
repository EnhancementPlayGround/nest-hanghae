import { InsufficientStockError, Product } from './Product';
import * as faker from 'faker';
import { ProductId } from './ProductId';

describe('상품 수량 테스트', () => {
  describe('수량 감소 테스트', () => {
    it('구매 수량이 상품 수량보다 많으면 구매할 수 없다.', () => {
      const product = createProduct(1000, 1);
      const amount = 10;

      expect(() => product.decreaseQuantity(amount)).toThrow(
        new InsufficientStockError('Insufficient stock'),
      );
    });

    it('상품 수량을 성공적으로 감소시킬 수 있다.', () => {
      const product = createProduct(1000, 20);
      const amount = 10;

      product.decreaseQuantity(amount);
      const remainingQuantity = product.getRemainingQuantity();

      expect(remainingQuantity).toEqual(10);
    });
  });

  describe('수량 증가 테스트', () => {
    it('수량 증가분이 음수면 추가할 수 없다.', () => {
      const product = createProduct(1000, 1);
      const amount = -10;

      expect(() => product.increaseQuantity(amount)).toThrow(
        new InsufficientStockError('Insufficient stock'),
      );
    });

    it('상품 수량을 성공적으로 증가시킬 수 있다.', () => {
      const product = createProduct(1000, 20);
      const amount = 10;

      product.increaseQuantity(amount);
      const remainingQuantity = product.getRemainingQuantity();

      expect(remainingQuantity).toEqual(30);
    });
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
