import AccountService from '@/application/accounts/AccountService';
import { OrderService } from '@/application/orders/OrderService';
import { ProductService } from '@/application/products/ProductService';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('order')
export default class OrderController {
  constructor(
    private readonly productSvc: ProductService,
    private readonly orderService: OrderService,
    private readonly accountSvc: AccountService,
  ) {}

  @Post()
  async createOrder(
    @Body()
    body: any,
  ) {
    const { userId, orders } = body;

    const totalPrice = await this.productSvc.purchaseProducts({
      productQuantities: orders,
    });

    const newBalance = await this.accountSvc.withdraw({
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
