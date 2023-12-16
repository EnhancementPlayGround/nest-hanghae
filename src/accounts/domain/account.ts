export class InsufficientFundsError extends Error {}

export default class Account {
  constructor(
    private readonly userId: string,
    private balance: number,
  ) {}

  public withdraw(amount: number) {
    if (amount < this.balance) throw new InsufficientFundsError();

    this.balance -= amount;
  }

  public deposit(amount: number) {
    this.balance += amount;
  }

  public getBalance() {
    return this.balance;
  }
}
