import { Injectable } from '@nestjs/common';
import { DistributedLockManager } from '../../core/DistributedLockManager';
import { IPurchaseProducts, ProductService } from './ProductService';

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
