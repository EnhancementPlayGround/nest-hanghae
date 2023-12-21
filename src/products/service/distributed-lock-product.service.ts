import { Injectable } from '@nestjs/common';
import { DistributedLockManager } from '../../share/distributed-lock.manager';
import { IPurchaseProducts, ProductService } from './product.service';

@Injectable()
export default class DistributedLockProductService {
  constructor(
    private readonly lockManager: DistributedLockManager,
    private readonly productSvc: ProductService,
  ) {}

  async purchaseProducts({ productQuantities }: IPurchaseProducts) {
    await this.lockManager.tryAcquireLock('myLock', 5, 1000);
    try {
      return await this.productSvc.purchaseProducts({ productQuantities });
    } finally {
      await this.lockManager.releaseLock('myLock');
    }
  }
}
