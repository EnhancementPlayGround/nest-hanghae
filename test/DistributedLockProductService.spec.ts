import DatabaseClient from '@/core/DatabaseClient';
import { TestingModule, Test } from '@nestjs/testing';
import DistributedLockProductService from '../src/application/products/DistributedLockProductService';
import { DistributedLockManager } from '../src/core/DistributedLockManager';
import { ProductService } from '../src/application/products/ProductService';
import { ProductId } from '@/domain/products/ProductId';
import { AppModule } from '@/app.module';

describe('상품 구매 동시성 테스트', () => {
  let productService: DistributedLockProductService;
  let dbClient: DatabaseClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dbClient = moduleFixture.get<DatabaseClient>(DatabaseClient);
    productService = moduleFixture.get<DistributedLockProductService>(
      DistributedLockProductService,
    );
  });

  afterEach(async () => {
    await dbClient.product.deleteMany({});
  });

  it('10 개의 재고가 남은 상품을 1 개씩 동시에 구매한다.', async () => {
    await dbClient.product.create({
      data: {
        id: '1',
        quantity: 10,
        name: 'apple',
        price: 1000,
        registedAt: new Date(),
      },
    });

    const purchasePromise = [];
    const productQuantities = [{ productId: new ProductId('1'), quantity: 1 }];

    for (let i = 0; i < 10; i++) {
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
