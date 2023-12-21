import { Injectable } from '@nestjs/common';
import DatabaseClient from '@/database/database.client';
import IAccountRepository, {
  FindAccountOptions,
  SaveProductOptions,
} from '@/accounts/service/IAccount.repository';
import Account from '@/accounts/domain/account';

@Injectable()
export default class AccountRepository implements IAccountRepository {
  constructor(private readonly client: DatabaseClient) {}

  async findAccount({ userId }: FindAccountOptions) {
    const entity = await this.client.account.findFirst({ where: { userId } });
    return new Account(entity.userId, entity.balance);
  }

  async save({ accounts }: SaveProductOptions) {
    if (!Array.isArray(accounts)) {
      accounts = [accounts];
    }

    for (const account of accounts) {
      const { userId, balance } = account;

      await this.client.account.upsert({
        where: { userId },
        update: {
          balance,
        },
        create: {
          id: userId,
          userId,
          balance,
        },
      });
    }

    return accounts;
  }
}
