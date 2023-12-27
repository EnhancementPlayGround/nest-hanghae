import { AppModule } from './../src/app.module';
import DatabaseClient from '@/core/DatabaseClient';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { E2ETestUtils } from './helper/e2e-test-utils';

describe('잔액 API (e2e)', () => {
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

  it('/accounts (POST) - 잔액 충전 동시성 테스트', async () => {
    await dbClient.account.create({
      data: {
        id: 'userId',
        userId: 'userId',
        balance: 0,
      },
    });

    const depositPromises = [];

    for (let i = 0; i < 10; i++) {
      depositPromises.push(
        request(app.getHttpServer())
          .post('/accounts')
          .send({ userId: 'userId', amount: 1000 }),
      );
    }

    await Promise.all(depositPromises);

    const { body } = await request(app.getHttpServer()).get(
      '/accounts?userId=userId',
    );
    expect(body.balance).toBe(10000);
  });
});
