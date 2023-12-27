import DatabaseClient from '@/core/DatabaseClient';
import { TestingModule, Test } from '@nestjs/testing';
import { DistributedLockManager } from '../src/core/DistributedLockManager';
import DistributedLockAccountService from '../src/application/accounts/DistributedLockAccountService';
import AccountService from '../src/application/accounts/AccountService';

describe('잔액 충전 동시성 테스트', () => {
  let accountSvc: DistributedLockAccountService;
  let dbClient: DatabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        DistributedLockAccountService,
        DistributedLockManager,
      ],
    }).compile();

    dbClient = module.get<DatabaseClient>(DatabaseClient);
    accountSvc = module.get<DistributedLockAccountService>(
      DistributedLockAccountService,
    );
  });

  afterEach(async () => {
    await dbClient.account.deleteMany({});
  });

  it('잔액 충전을 10회 동시에 진행한다.', async () => {
    await dbClient.account.create({
      data: {
        id: 'userId',
        userId: 'userId',
        balance: 0,
      },
    });

    const depositPromise = [];
    const depositDetail = { userId: 'userId', amount: 1000 };

    for (let i = 0; i < 10; i++) {
      depositPromise.push(
        accountSvc.deposit({
          ...depositDetail,
        }),
      );
    }

    await Promise.all(depositPromise);

    const after = await dbClient.account.findFirst({
      where: { userId: 'userId' },
    });
    expect(after.balance).toBe(10000);
  });

  it('잔액 감소를 10회 동시에 진행한다.', async () => {
    await dbClient.account.create({
      data: {
        id: 'userId',
        userId: 'userId',
        balance: 10000,
      },
    });

    const depositPromise = [];
    const depositDetail = { userId: 'userId', amount: 1000 };

    for (let i = 0; i < 10; i++) {
      depositPromise.push(
        accountSvc.withdraw({
          ...depositDetail,
        }),
      );
    }

    await Promise.all(depositPromise);

    const after = await dbClient.account.findFirst({
      where: { userId: 'userId' },
    });
    expect(after.balance).toBe(0);
  });
});
