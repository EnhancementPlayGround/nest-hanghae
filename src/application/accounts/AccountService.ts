import { Inject, Injectable } from '@nestjs/common';
import IAccountRepository, {
  AccountRepositoryKey,
} from '../../domain/accounts/IAccountRepository';
import { DistributedLock } from '@/core/distributed-lock/DistributedLockDecorator';

export interface IGetBalance {
  userId: string;
}

export interface IDeposit {
  userId: string;
  amount: number;
}

export interface IWithdraw {
  userId: string;
  amount: number;
}

@Injectable()
export default class AccountService {
  constructor(
    @Inject(AccountRepositoryKey)
    private readonly accountRepo: IAccountRepository,
  ) {}

  async getBalance({ userId }: IGetBalance) {
    const account = await this.accountRepo.findAccount({ userId });
    return account.getBalance();
  }

  @DistributedLock({ lockName: 'account' })
  async deposit({ userId, amount }: IDeposit) {
    const account = await this.accountRepo.findAccount({ userId });
    account.deposit(amount);
    await this.accountRepo.save({ accounts: account });
    return account.getBalance();
  }

  @DistributedLock({ lockName: 'account' })
  async withdraw({ userId, amount }: IWithdraw) {
    const account = await this.accountRepo.findAccount({ userId });
    account.withdraw(amount);
    await this.accountRepo.save({ accounts: account });
    return account.getBalance();
  }
}
