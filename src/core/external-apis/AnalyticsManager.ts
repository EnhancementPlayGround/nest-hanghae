import Logger from "@/core/logger/Logger";
import { Injectable } from "@nestjs/common";

type OrderStatistics = {
  userId: string;
  orders: {
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
};

@Injectable()
export default class AnalyticsManager {
  constructor(
    private readonly logger: Logger
  ) {}

  sendOrderStatistics(orderStatistics: OrderStatistics): void {
    this.logger.info(`Created Order: ${orderStatistics}`)
    console.log('Sending order statistics:', orderStatistics);
  }
}
