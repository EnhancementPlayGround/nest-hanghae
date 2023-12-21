import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import ProductRepository from './product.repository';
import { Product } from '@/products/domain/product';
import * as faker from 'faker';
import DatabaseClient from '../database.client';

describe('데이터베이스 상품 조회 테스트', () => {
  let repo: ProductRepository;
  let client: DatabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DatabaseClient, ProductRepository],
    }).compile();

    repo = module.get<ProductRepository>(ProductRepository);
    client = module.get<DatabaseClient>(DatabaseClient);
  });

  afterEach(async () => {
    await client.product.deleteMany();
  });

  it('ids를 제공하는 경우, 해당 id 값을 가진 product만 조회한다.', async () => {
    const products = createNProducts(20);
    const targetProducts = products.slice(0, 9);
    const targetProductIds = targetProducts.map((prodcut) => prodcut.id);
    await repo.save({ products });

    const expectedProducts = await repo.findProducts({ ids: targetProductIds });

    const expectedProductIds = expectedProducts.map((product) => product.id);
    expect(expectedProductIds).toEqual(
      expect.arrayContaining(targetProductIds),
    );
    expect(expectedProductIds.length).toEqual(targetProductIds.length);
  });

  it('pageOption을 주면, 그 조건에 맞게 pagenation 된 값을 조회한다.', async () => {
    const products = createNProducts(20);
    await repo.save({ products });

    const expectedProducts = await repo.findProducts({
      pageOption: { page: 1, pageSize: 10 },
    });
    expect(expectedProducts.length).toEqual(10);
  });

  function createNProducts(n: number): Product[] {
    return Array.from({ length: n }, () => {
      const registedAt = new Date();
      registedAt.setDate(registedAt.getDate() - n);
      return createProduct({ registedAt });
    });
  }

  function createProduct({ registedAt }: { registedAt: Date }) {
    return new Product(
      faker.datatype.uuid(),
      faker.commerce.productName(),
      parseInt(faker.commerce.price()),
      faker.datatype.number({ min: 0, max: 100 }), // 수량은 0에서 100 사이
      registedAt,
    );
  }
});
