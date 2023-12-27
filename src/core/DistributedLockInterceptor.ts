import { Injectable, OnModuleInit } from '@nestjs/common';
import { DistributedLockManager } from './DistributedLockManager';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { DISTRIBUTED_LOCK_METADATA } from './DistributedLockDecorator';

@Injectable()
export class DistributedLockDecorator implements OnModuleInit {
  constructor(
    private readonly discerveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly lockManager: DistributedLockManager,
  ) {}

  onModuleInit() {
    return this.discerveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        this.metadataScanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          async (methodName) => {
            const options = this.reflector.get(
              DISTRIBUTED_LOCK_METADATA,
              instance[methodName],
            );

            if (!options) return;

            const originalMethod = instance[methodName];
            const { lockName, maxRetries, retryDelay } = options;

            instance[methodName] = (...args: any[]) =>
              this.applyDistributedLock(
                originalMethod,
                instance,
                lockName,
                maxRetries,
                retryDelay,
                ...args,
              );
          },
        );
      });
  }

  async applyDistributedLock(
    methodRef: Function,
    context: any,
    lockName: string,
    maxRetries: number,
    retryDelay: number,
    ...args: any[]
  ) {
    const userIdIndex = args.findIndex(arg => arg && typeof arg === 'object' && 'userId' in arg);
    
    if (userIdIndex !== -1) {
      const userId = args[userIdIndex].userId;
      lockName = lockName + `.${userId}`;
    }

    await this.lockManager.tryAcquireLock(lockName, maxRetries, retryDelay);
    try {
      return await methodRef.apply(context, args);
    } finally {
      await this.lockManager.releaseLock(lockName);
    }
  }
}
