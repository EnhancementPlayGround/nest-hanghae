import { Global, Module } from '@nestjs/common';
import { DistributedLockManager } from './distributed-lock.manager';
import { DatabaseModule } from '@/database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [DistributedLockManager],
  exports: [DistributedLockManager],
})
export class ShareModule {}
