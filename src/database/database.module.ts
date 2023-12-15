import { Module } from '@nestjs/common';
import DatabaseClient from './database.client';
import ProductRepository from './repositories/product.repository';

@Module({
  providers: [DatabaseClient, 
    {
        provide: 'IProductRepositry',
        useFactory: (client) => {
            return new ProductRepository(client);
        },
        inject: [DatabaseClient],
      },
    ],
  exports: ['IProductRepositry'],
})
export class DatabaseModule {}
