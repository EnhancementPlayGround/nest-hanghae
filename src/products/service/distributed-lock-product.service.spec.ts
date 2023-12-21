import DatabaseClient from "@/database/database.client";
import { DatabaseModule } from "@/database/database.module";
import { TestingModule, Test } from "@nestjs/testing";
import DistributedLockProductService from "./distributed-lock-product.service";
import { DistributedLockManager } from "../../share/distributed-lock.manager";
import { ProductService } from "./product.service";

describe('상품 구매 동시성 테스트', () => {
    let productService: DistributedLockProductService;
    let dbClient: DatabaseClient;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule],
        providers: [ProductService, DistributedLockProductService, DistributedLockManager],
      }).compile();
  
      dbClient = module.get<DatabaseClient>(DatabaseClient);
      productService = module.get<DistributedLockProductService>(DistributedLockProductService);
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
  