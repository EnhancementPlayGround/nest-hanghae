import { Product } from '../../domain/products/Product';
import IProductRepository from '../../domain/products/IProductRepository';
import { ProductService } from './ProductService';
import { ProductId } from '@/domain/products/ProductId';
import * as faker from 'faker';

describe('상품 구매 로직 테스트', () => {
  let mockRepo: IProductRepository;
  let productService: ProductService;

  beforeEach(() => {
    mockRepo = {
      findProducts: jest.fn(),
      save: jest.fn(),
    };
    productService = new ProductService(mockRepo);
  });

  it('상품 구매 시, 구매 수량만큼 재고를 소진시키고, 총 합계 금액을 반환한다.', async () => {
    // when
    const products = [createProduct('1', 100, 10), createProduct('2', 200, 5)];
    jest.spyOn(mockRepo, 'findProducts').mockResolvedValue(products);

    const productQuantities = [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 3 },
    ];

    // given
    const totalAmount = await productService.decreaseProductsQuantity({
      productQuantities,
    });

    // then
    expect(totalAmount).toBe(100 * 2 + 200 * 3);
    expect(mockRepo.save).toHaveBeenCalledWith({
      products,
    });
  });

  function createProduct(id: string, price: number, quantity: number) {
    return Product.create({
      id: new ProductId(id),
      name: faker.commerce.productName(),
      price,
      quantity,
    });
  }
});
