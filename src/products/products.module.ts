import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import DistributedLockProductService from './service/distributed-lock-product.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProductService, DistributedLockProductService],
  exports: [ProductService, DistributedLockProductService],
})
export class ProductsModule {}
