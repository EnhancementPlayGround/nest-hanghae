import DistributedLockAccountService from '@/accounts/service/distributed-lock-account.service';
import DistributedLockProductService from '@/products/service/distributed-lock-product.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('order')
export default class OrderController {
  constructor(
    private readonly distributedLockProductSvc: DistributedLockProductService,
    private readonly distributedLockAccountSvc: DistributedLockAccountService,
  ) {}

  @Post()
  async createOrder(
    @Body()
    {
      userId,
      orders,
    }: {
      userId: string;
      orders: {
        productId: string;
        quantity: number;
      }[];
    },
  ) {
    const totalPrice = await this.distributedLockProductSvc.purchaseProducts({
      productQuantities: orders,
    });
    const newBalance = await this.distributedLockAccountSvc.withdraw({
      userId,
      amount: totalPrice,
    });
    return {
      success: true,
      newBalance,
    };
  }
}
