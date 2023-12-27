import DatabaseClient from '@/core/DatabaseClient';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { E2ETestUtils } from './helper/e2e-test-utils';

describe('주문 / 결제 API (e2e)', () => {
  let utils: E2ETestUtils;
  let app: INestApplication;
  let dbClient: DatabaseClient;

  beforeEach(async () => {
    utils = new E2ETestUtils();
    await utils.setupModule();
    ({ app, dbClient } = utils.getTestResources());
  });

  afterEach(async () => {
    await utils.tearDown();
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
