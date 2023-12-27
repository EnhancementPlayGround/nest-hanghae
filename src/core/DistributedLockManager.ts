import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class DistributedLockManager {
  constructor(
    @InjectRedis()
    private readonly client: Redis,
  ) {}

  async tryAcquireLock(lockKey: string, delayMs: number, timeout: number) {
    while (true) {
      if (await this.acquireLock(lockKey, timeout)) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  private async acquireLock(
    lockKey: string,
    timeout: number,
  ): Promise<boolean> {
    const lock = await this.client.set(lockKey, 'locked', 'EX', timeout, 'NX');
    return lock === 'OK';
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.client.del(lockKey);
  }
}
