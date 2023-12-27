import { AccountId } from "./AccountId";

export class InsufficientFundsError extends Error {}

export default class Account {
  constructor(
    private readonly id: AccountId,
    public readonly userId: string,
    public balance: number,
  ) {}

  static create(param: { id: AccountId; userId: string; balance: number }) {
    const { id, userId, balance } = param;

    return new Account(id, userId, balance);
  }

  public withdraw(amount: number) {
    if (amount > this.balance) throw new InsufficientFundsError();

    this.balance -= amount;
  }

  public deposit(amount: number) {
    this.balance += amount;
  }

  public getBalance() {
    return this.balance;
  }
}
