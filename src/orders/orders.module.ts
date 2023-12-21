import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrdersModule {}
