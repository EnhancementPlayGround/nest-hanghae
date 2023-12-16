import { Injectable } from '@nestjs/common';
import DatabaseClient from '@/database/database.client';
import IAccountRepository, {
  FindAccountOptions,
} from '@/accounts/service/IAccount.repository';
import Account from '@/accounts/domain/account';

@Injectable()
export default class AccountRepository implements IAccountRepository {
  constructor(private readonly client: DatabaseClient) {}

  async findAccount({ userId }: FindAccountOptions) {
    const entity = await this.client.account.findFirst({ where: { userId } });
    return new Account(entity.userId, entity.balance);
  }
}
