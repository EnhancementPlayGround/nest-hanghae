import { Product } from '../domain/product';
import IProductRepository from './IProduct.repository';
import { ProductService } from './product.service';

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
    jest
      .spyOn(mockRepo, 'findProducts')
      .mockResolvedValue([
        new Product('1', 'Product 1', 100, 10, new Date('1900-01-01')),
        new Product('2', 'Product 2', 200, 5, new Date('1900-01-01')),
      ]);

    const productQuantities = [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 3 },
    ];

    // given
    const totalAmount = await productService.purchaseProducts({
      productQuantities,
    });

    // then
    expect(totalAmount).toBe(100 * 2 + 200 * 3);
    expect(mockRepo.save).toHaveBeenCalledWith({
      products: [
        new Product('1', 'Product 1', 100, 8, new Date('1900-01-01')),
        new Product('2', 'Product 2', 200, 2, new Date('1900-01-01')),
      ],
    });
  });
});
