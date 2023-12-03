import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    process.env.NODE_ENV = 'test'
    process.env.VERSION = '0.0.0'
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({
        status: 'ok',
        info: {
          'env status': {
            status: 'up',
            env: process.env.NODE_ENV,
            version: process.env.VERSION
          },
        },
        error: {},
        details: {
          'env status': {
            status: 'up',
            env: process.env.NODE_ENV,
            version: process.env.VERSION
          },
        },
      });
  });
});
