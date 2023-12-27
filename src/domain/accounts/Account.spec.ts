import * as faker from 'faker';
import Account, { InsufficientFundsError } from './Account';
import { AccountId } from './AccountId';

describe('잔액 차감 테스트', () => {
  it('유저 잔액이 지불 금액보다 크면 주문을 할 수 없다.', () => {
    const account = createAccount(1000);
    const amount = 20000;

    expect(() => account.withdraw(amount)).toThrow(
      new InsufficientFundsError(),
    );
  });

  it('유저 잔액이 금액만큼 차감된다.', () => {
    const account = createAccount(1000);
    const amount = 500;

    account.withdraw(amount);
    const newBalance = account.getBalance();

    expect(newBalance).toEqual(500);
  });

  function createAccount(amount: number) {
    return Account.create({
      id: new AccountId(faker.datatype.uuid()),
      userId: faker.datatype.uuid(),
      balance: amount
    });
  }
});
