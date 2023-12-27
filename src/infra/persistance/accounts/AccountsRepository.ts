import { Injectable } from '@nestjs/common';
import IAccountRepository, {
  FindAccountOptions,
  SaveProductOptions,
} from '@/domain/accounts/IAccountRepository';
import DatabaseClient from '../DatabaseClient';
import { AccountsEntityMapper } from './AccountsEntityMapper';

@Injectable()
export default class AccountRepository implements IAccountRepository {
  constructor(
    private readonly client: DatabaseClient,
    private readonly entityMapper: AccountsEntityMapper,
  ) {}

  async findAccount({ userId }: FindAccountOptions) {
    const entity = await this.client.account.findFirst({ where: { userId } });
    return this.entityMapper.toDomain(entity);
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
        create: this.entityMapper.toEntity(account),
      });
    }

    return accounts;
  }
}
