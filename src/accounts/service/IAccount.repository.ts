import Account from '../domain/account';

export interface FindAccountOptions {
  userId: string;
}

export interface SaveProductOptions {
  accounts: Account | Account[];
}

export default interface IAccountRepository {
  findAccount(options: FindAccountOptions): Promise<Account>;
  save(options: SaveProductOptions): Promise<Account | Account[]>;
}
