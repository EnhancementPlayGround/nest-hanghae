import { applyDecorators, SetMetadata } from '@nestjs/common';

export const DISTRIBUTED_LOCK_METADATA = 'DISTRIBUTED_LOCK_METADATA';

export interface DistributedLockOptions {
  lockName: string;
  maxRetries?: number;
  retryDelay?: number;
}

export function DistributedLock(
  options: DistributedLockOptions,
): MethodDecorator {
  const defaultOptions = {
    maxRetries: 5,
    retryDelay: 1000,
    ...options,
  };

  return applyDecorators(
    SetMetadata(DISTRIBUTED_LOCK_METADATA, defaultOptions),
  );
}
