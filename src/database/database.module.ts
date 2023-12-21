import { Module } from '@nestjs/common';
import DatabaseClient from './database.client';
import ProductRepository from './repositories/product.repository';
import AccountRepository from './repositories/account.repository';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'password',
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
