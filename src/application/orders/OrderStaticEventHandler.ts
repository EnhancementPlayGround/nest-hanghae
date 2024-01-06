import OrderCreatedEvent from '@/domain/orders/OrderCreatedEvent';
import AnalyticsManager from '@/core/external-apis/AnalyticsManager';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(OrderCreatedEvent)
export class OrderStaticEventHandler
  implements IEventHandler<OrderCreatedEvent>
{
  constructor(private analyticsManager: AnalyticsManager) {}

  handle(event: OrderCreatedEvent) {
    const orderData = event;
    this.analyticsManager.sendOrderStatistics(orderData);
  }
}
