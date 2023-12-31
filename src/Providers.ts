import AccountService from './application/accounts/AccountService';
import { AccountsEntityMapper } from './infra/persistance/accounts/AccountsEntityMapper';
import AccountRepository from './infra/persistance/accounts/AccountRepository';
import { OrderService } from './application/orders/OrderService';
import OrderRepository from './infra/persistance/orders/OrderRepository';
import { OrderEntityMapper } from './infra/persistance/orders/OrderEntityMapper';
import { ProductService } from './application/products/ProductService';
import ProductRepository from './infra/persistance/products/ProductRepository';
import { ProductEntityMapper } from './infra/persistance/products/ProductEntityMapper';
import AccountController from './presentation/account.controller';
import { HealthController } from './presentation/health.controller';
import OrderController from './presentation/order.controller';
import ProductController from './presentation/product.controller';
import { OrderItemEntityMapper } from './infra/persistance/orders/OrderItemEntityMapper';

export const AccountProviders = [
  AccountService,
  AccountsEntityMapper,
  {
    provide: 'AccountRepository',
    useClass: AccountRepository,
  },
];

export const OrderProviders = [
  OrderService,
  OrderEntityMapper,
  {
    provide: 'OrderRepository',
    useClass: OrderRepository,
  },
  OrderItemEntityMapper,
];

export const ProductProviders = [
  ProductService,
  ProductEntityMapper,
  {
    provide: 'ProductRepository',
    useClass: ProductRepository,
  },
];

export const ControllerProviders = [
  AccountController,
  HealthController,
  OrderController,
  ProductController,
];
