import AccountService from '@/application/accounts/AccountService';
import { OrderService } from '@/application/orders/OrderService';
import { ProductService } from '@/application/products/ProductService';
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InsufficientStockError } from '@/domain/products/Product';
import { InsufficientFundsError } from '@/domain/accounts/Account';

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
    const totalPrice = await this.purchase({ orders });

    const newBalance = await this.withdraw({ userId, orders, totalPrice });

    await this.saveOrder({ userId, orders, totalPrice });

    return {
      success: true,
      newBalance,
    };
  }

  private async purchase({ orders }) {
    try {
      return await this.productSvc.purchaseProducts({
        productQuantities: orders,
      });
    } catch (ex) {
      if (ex instanceof InsufficientStockError) {
        throw new BadRequestException('수량이 부족합니다.');
      }
      throw new InternalServerErrorException('수량 감소에 실패했습니다.');
    }
  }

  private async withdraw({ userId, orders, totalPrice }) {
    try {
      return await this.accountSvc.withdraw({
        userId,
        amount: totalPrice,
      });
    } catch (ex) {
      if (ex instanceof InsufficientFundsError) {
        await this.productSvc.increaseProductsQuantity({
          productQuantities: orders,
        });

        throw new BadRequestException('계좌 잔액이 부족합니다.');
      }

      throw new InternalServerErrorException('계좌 출금에 실패했습니다.');
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
      await Promise.all([
        this.productSvc.increaseProductsQuantity({
          productQuantities: orders,
        }),
        this.accountSvc.deposit({ userId, amount: totalPrice }),
      ]);

      throw new InternalServerErrorException('계좌 출금에 실패했습니다.');
    }
  }
}
