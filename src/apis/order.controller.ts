import DistributedLockAccountService from '@/accounts/service/distributed-lock-account.service';
import { OrderService } from '@/orders/service/order.service';
import DistributedLockProductService from '@/products/service/distributed-lock-product.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export default class OrderController {
  constructor(
    private readonly distributedLockProductSvc: DistributedLockProductService,
    private readonly distributedLockAccountSvc: DistributedLockAccountService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  async createOrder(
    @Body()
    { userId, orders }: CreateOrderDto,
  ) {
    
    const totalPrice = await this.distributedLockProductSvc.purchaseProducts({
      productQuantities: orders,
    });

    const newBalance = await this.distributedLockAccountSvc.withdraw({
      userId,
      amount: totalPrice,
    });

    await this.orderService.createOrder({
      userId,
      orders,
      totalAmount: newBalance,
    });

    return {
      success: true,
      newBalance,
    };
  }
}
