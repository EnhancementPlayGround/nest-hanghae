import { AppModule } from './../src/app.module';
import DatabaseClient from '@/core/DatabaseClient';
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
    await dbClient.orderItem.deleteMany({});
    await dbClient.order.deleteMany({});
    await app.close();
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

  it('/order (POST) - 주문 생성 동시성 테스트', async () => {
    await dbClient.product.create({
      data: {
        id: 'prod1',
        name: '사과',
        price: 1000,
        quantity: 10,
        registedAt: new Date(),
      },
    });
    await dbClient.account.create({
      data: {
        id: 'user123',
        userId: 'user123',
        balance: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const orderPromises = [];

    for (let i = 0; i < 10; i++) {
      orderPromises.push(
        request(app.getHttpServer())
          .post('/order')
          .send({
            userId: 'user123',
            orders: [
              {
                productId: 'prod1',
                quantity: 1,
              },
            ],
          }),
      );
    }

    await Promise.all(orderPromises);

    const accountAfter = await dbClient.account.findUnique({
      where: { userId: 'user123' },
    });
    const orderRecords = await dbClient.order.findMany({
      where: { userId: 'user123' },
    });
    const productAfter = await dbClient.product.findUnique({
      where: { id: 'prod1' },
    });

    expect(accountAfter.balance).toBe(0);
    expect(orderRecords.length).toBe(10);
    expect(productAfter.quantity).toBe(0);
  });
});
