import { Module } from '@nestjs/common';
import ProductController from './product.controller';
import { HealthController } from './health.controller';
import { HealthModule } from '@/health/health.module';
import { AccountsModule } from '@/accounts/accounts.module';
import AccountController from './account.controller';
import OrderController from './order.controller';
import { OrdersModule } from '@/orders/orders.module';

@Module({
  imports: [HealthModule, AccountsModule, OrdersModule],
  controllers: [
    ProductController,
    HealthController,
    AccountController,
    OrderController,
  ],
})
export class ApisModule {}
