import { Inject, Injectable } from '@nestjs/common';
import IAccountRepository from './IAccount.repository';

export interface IGetBalance {
  userId: string;
}

export interface IDeposit {
  userId: string;
  amount: number;
}

@Injectable()
export default class AccountService {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepo: IAccountRepository,
  ) {}

  async getBalance({ userId }: IGetBalance) {
    const account = await this.accountRepo.findAccount({ userId });
    return account.getBalance();
  }

  async deposit({ userId, amount }: IDeposit) {
    const account = await this.accountRepo.findAccount({ userId });
    account.deposit(amount);
    return account.getBalance();
  }
}
