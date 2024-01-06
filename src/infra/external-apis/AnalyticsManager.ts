type OrderStatistics = {
  userId: string;
  orders: {
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
};

export default class AnalyticsManager {
  constructor() {}

  sendOrderStatistics(orderStatistics: any): void {
    console.log('Sending order statistics:', orderStatistics);
  }
}
