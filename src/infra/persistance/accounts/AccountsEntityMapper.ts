import { Injectable } from '@nestjs/common';
import { Account as AccountEntity } from '@prisma/client';
import { EntityMapper } from '../EntityMapper';
import Account from '@/domain/accounts/Account';
import { AccountId } from '@/domain/accounts/AccountId';

@Injectable()
export class AccountsEntityMapper extends EntityMapper<
  Account,
  AccountId,
  AccountEntity
> {
  toDomain(entity: AccountEntity): Account {
    const { id, userId, balance } = entity;
    return new Account(new AccountId(id), userId, balance);
  }

  toEntity(domain: Account): AccountEntity {
    const { id, userId, balance } = domain;
    return {
      id: id.key,
      userId,
      balance,
      createdAt: null,
      updatedAt: null,
    };
  }
}
