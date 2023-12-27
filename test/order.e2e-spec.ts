import { AppModule } from './../src/app.module';
import DatabaseClient from '@/infra/persistance/DatabaseClient';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('주문 / 결제 API (e2e)', () => {
  let app: INestApplication;
  let dbClient: DatabaseClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dbClient = moduleFixture.get<DatabaseClient>(DatabaseClient);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await dbClient.product.deleteMany({});
    await dbClient.account.deleteMany({});
  });

  it('/order (POST) - 주문 생성', async () => {
    await dbClient.product.create({
      data: {
        id: 'prod1',
        name: '사과',
        price: 1000,
        quantity: 10,
        registedAt: new Date(),
      },
    });
    await dbClient.product.create({
      data: {
        id: 'prod2',
        name: '배',
        price: 500,
        quantity: 10,
        registedAt: new Date(),
      },
    });
    await dbClient.account.create({
      data: {
        id: 'user123',
        userId: 'user123',
        balance: 8000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return request(app.getHttpServer())
      .post('/order')
      .send({
        userId: 'user123',
        orders: [
          {
            productId: 'prod1',
            quantity: 2,
          },
          {
            productId: 'prod2',
            quantity: 3,
          },
        ],
      })
      .expect(201)
      .expect({
        success: true,
        newBalance: 4500,
      });
  });
});
