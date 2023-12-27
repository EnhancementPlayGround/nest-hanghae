import { Injectable } from '@nestjs/common';
import IAccountRepository, {
  FindAccountOptions,
  SaveProductOptions,
} from '@/domain/accounts/IAccountRepository';
import Account from '@/domain/accounts/Account';
import DatabaseClient from './DatabaseClient';
import { AccountId } from '@/domain/accounts/AccountId';

@Injectable()
export default class AccountRepository implements IAccountRepository {
  constructor(private readonly client: DatabaseClient) {}

  async findAccount({ userId }: FindAccountOptions) {
    const entity = await this.client.account.findFirst({ where: { userId } });
    return Account.create({id: new AccountId(entity.id), userId: entity.userId, balance: entity.balance});
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