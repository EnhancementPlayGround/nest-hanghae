import { Module } from '@nestjs/common';
import AccountService from './service/account.service';
import { DatabaseModule } from '@/database/database.module';
import DistributedLockAccountService from './service/distributed-lock-account.service';

@Module({
  imports: [DatabaseModule],
  providers: [AccountService, DistributedLockAccountService],
  exports: [AccountService, DistributedLockAccountService],
})
export class AccountsModule {}
