import { Module } from '@nestjs/common';
import DatabaseClient from './database.client';
import ProductRepository from './repositories/product.repository';
import AccountRepository from './repositories/account.repository';
import { RedisModule } from '@nestjs-modules/ioredis';
import OrderRepository from './repositories/order.repository';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  providers: [
    DatabaseClient,
    {
      provide: 'IProductRepositry',
      useFactory: (client) => {
        return new ProductRepository(client);
      },
      inject: [DatabaseClient],
    },
    {
      provide: 'IAccountRepository',
      useFactory: (client) => {
        return new AccountRepository(client);
      },
      inject: [DatabaseClient],
    },
    {
      provide: 'IOrderRepositry',
      useFactory: (client) => {
        return new OrderRepository(client);
      },
      inject: [DatabaseClient],
    },
  ],
  exports: ['IProductRepositry', 'IAccountRepository', 'IOrderRepositry'],
})
export class DatabaseModule {}
