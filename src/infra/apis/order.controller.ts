import AccountService from '@/application/accounts/AccountService';
import { OrderService } from '@/application/orders/OrderService';
import { ProductService } from '@/application/products/ProductService';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

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
    { userId, orders }: CreateOrderDto,
  ) {
    const totalPrice = await this.productSvc.decreaseProductsQuantity({
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
