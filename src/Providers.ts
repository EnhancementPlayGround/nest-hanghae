import AccountService from "./application/accounts/AccountService";
import DistributedLockAccountService from "./application/accounts/DistributedLockAccountService";
import { AccountsEntityMapper } from "./infra/persistance/accounts/AccountsEntityMapper";
import AccountRepository from "./infra/persistance/accounts/AccountRepository";
import { OrderService } from "./application/orders/OrderService";
import OrderRepository from "./infra/persistance/orders/OrderRepository";
import { OrderEntityMapper } from "./infra/persistance/orders/OrderEntityMapper";
import { ProductService } from "./application/products/ProductService";
import DistributedLockProductService from "./application/products/DistributedLockProductService";
import ProductRepository from "./infra/persistance/products/ProductRepository";
import { ProductEntityMapper } from "./infra/persistance/products/ProductEntityMapper";
import { DistributedLockManager } from "./infra/persistance/DistributedLockManager";
import AccountController from "./infra/apis/account.controller";
import { HealthController } from "./infra/apis/health.controller";
import OrderController from "./infra/apis/order.controller";
import ProductController from "./infra/apis/product.controller";

export const AccountProviders = [
    AccountService,
    DistributedLockAccountService,
    AccountRepository,
    AccountsEntityMapper
]

export const OrderProviders = [
    OrderService,
    OrderRepository,
    OrderEntityMapper
]

export const ProductProviders = [
    ProductService,
    DistributedLockProductService,
    ProductRepository,
    ProductEntityMapper
]

export const ControllerProviders = [
    AccountController,
    HealthController,
    OrderController,
    ProductController
]