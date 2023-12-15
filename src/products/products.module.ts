import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductsModule {}
