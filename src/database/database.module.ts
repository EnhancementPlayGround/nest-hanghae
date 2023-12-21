import { Module } from '@nestjs/common';
import DatabaseClient from './database.client';
import ProductRepository from './repositories/product.repository';
import AccountRepository from './repositories/account.repository';
import { RedisModule } from '@nestjs-modules/ioredis';

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
  ],
  exports: ['IProductRepositry', 'IAccountRepository'],
})
export class DatabaseModule {}
