import { DatabaseModule } from '@/database/database.module';
import { TestingModule, Test } from '@nestjs/testing';
import { Product } from '../domain/product';
import IProductRepository from './IProduct.repository';
import { ProductService } from './product.service';
import DatabaseClient from '@/database/database.client';

describe('상품 구매 로직 테스트', () => {
  let mockRepo: IProductRepository;
  let productService;
  ProductService;

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

describe('상품 구매 동시성 테스트', () => {
  let productService: ProductService;
  let dbClient: DatabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ProductService],
    }).compile();

    dbClient = module.get<DatabaseClient>(DatabaseClient);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(async () => {
    await dbClient.product.deleteMany({});
  });

  it('100 개의 재고가 남은 상품을 1 개씩 동시에 구매한다.', async () => {
    await dbClient.product.create({
      data: {
        id: '1',
        quantity: 100,
        name: 'apple',
        price: 1000,
        registedAt: new Date(),
      },
    });

    const purchasePromise = [];
    const productQuantities = [{ productId: '1', quantity: 1 }];

    for (let i = 0; i < 100; i++) {
      purchasePromise.push(
        productService.purchaseProducts({
          productQuantities,
        }),
      );
    }

    await Promise.all(purchasePromise);

    const after = await dbClient.product.findFirst({ where: { id: '1' } });
    expect(after.quantity).toBe(0);
  });
});
