import { Module } from '@nestjs/common';
import AccountService from './service/account.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountsModule {}
