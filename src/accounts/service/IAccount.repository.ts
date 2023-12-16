import Account from '../domain/account';

export interface FindAccountOptions {
  userId: string;
}

export default interface IAccountRepository {
  findAccount(options: FindAccountOptions): Promise<Account>;
}
