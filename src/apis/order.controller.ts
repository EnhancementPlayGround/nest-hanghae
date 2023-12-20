import { Body, Controller, Post } from '@nestjs/common';

@Controller('order')
export default class OrderController {
  constructor() {}

  @Post()
  async createOrder(
    @Body()
    body: {
      userId: string;
      orders: {
        productId: string;
        quantity: number;
      }[];
    },
  ) {
    return {
      success: true,
      newBalance: 4500,
    };
  }
}
