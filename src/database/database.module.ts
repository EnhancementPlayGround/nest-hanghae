import { Module } from '@nestjs/common';
import DatabaseClient from './database.client';
import ProductRepository from './repositories/product.repository';
import AccountRepository from './repositories/account.repository';

@Module({
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
