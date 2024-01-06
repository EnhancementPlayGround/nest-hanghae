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
    const totalPrice = await this.productSvc.purchaseProducts({
      productQuantities: orders,
    });

    const newBalance = await this.withdraw({ userId, orders, totalPrice });

    await this.saveOrder({ userId, orders, totalPrice });

    return {
      success: true,
      newBalance,
    };
  }

  private async withdraw({ userId, orders, totalPrice }) {
    try {
      return await this.accountSvc.withdraw({
        userId,
        amount: totalPrice,
      });
    } catch (ex) {
      await this.productSvc.increaseProductsQuantity({
        productQuantities: orders,
      });
    }
  }

  private async saveOrder({ userId, orders, totalPrice }) {
    try {
      await this.orderService.createOrder({
        userId,
        orders,
        totalAmount: totalPrice,
      });
    } catch (ex) {
      await this.productSvc.increaseProductsQuantity({
        productQuantities: orders,
      });
      await this.accountSvc.deposit({ userId, amount: totalPrice });
    }
  }
}
