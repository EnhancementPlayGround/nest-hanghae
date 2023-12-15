import { ProductsModule } from '@/products/products.module';
import { Module } from '@nestjs/common';
import ProductController from './product.controller';
import { HealthController } from './health.controller';
import { HealthModule } from '@/health/health.module';

@Module({
  imports: [ProductsModule, HealthModule],
  controllers: [ProductController, HealthController]
})
export class ApisModule {}
