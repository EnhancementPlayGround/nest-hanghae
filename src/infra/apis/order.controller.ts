import DistributedLockAccountService from '@/application/accounts/DistributedLockAccountService';
import { OrderService } from '@/application/orders/OrderService';
import DistributedLockProductService from '@/application/products/DistributedLockProductService';
import { ProductId } from '@/domain/products/ProductId';
import { Body, Controller, Post } from '@nestjs/common';

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
    body: any,
  ) {
    const { userId, orders } = body;

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
