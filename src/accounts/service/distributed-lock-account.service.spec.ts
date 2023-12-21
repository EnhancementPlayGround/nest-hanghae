import DatabaseClient from "@/database/database.client";
import { DatabaseModule } from "@/database/database.module";
import { TestingModule, Test } from "@nestjs/testing";
import { DistributedLockManager } from "../../share/distributed-lock.manager";
import DistributedLockAccountService from "./distributed-lock-account.service";
import AccountService from "./account.service";

describe('잔액 충전 동시성 테스트', () => {
    let accountSvc: DistributedLockAccountService;
    let dbClient: DatabaseClient;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule],
        providers: [AccountService, DistributedLockAccountService, DistributedLockManager],
      }).compile();
  
      dbClient = module.get<DatabaseClient>(DatabaseClient);
      accountSvc = module.get<DistributedLockAccountService>(DistributedLockAccountService);
    });
  
    afterEach(async () => {
      await dbClient.account.deleteMany({});
    });
  
    it('잔액 충전을 100회 동시에 진행한다.', async () => {
      await dbClient.account.create({
        data: {
          id: 'userId',
          userId: 'userId',
          balance: 0
        },
      });
  
      const depositPromise = [];
      const depositDetail = { userId: 'userId', amount: 1000 };
  
      for (let i = 0; i < 100; i++) {
        depositPromise.push(
            accountSvc.deposit({
                ...depositDetail,
          }),
        );
      }
  
      await Promise.all(depositPromise);
  
      const after = await dbClient.account.findFirst({ where: { userId: 'userId' } });
      expect(after.balance).toBe(100000);
    });

    it('잔액 감소를 100회 동시에 진행한다.', async () => {
      await dbClient.account.create({
        data: {
          id: 'userId',
          userId: 'userId',
          balance: 100000
        },
      });
  
      const depositPromise = [];
      const depositDetail = { userId: 'userId', amount: 1000 };
  
      for (let i = 0; i < 100; i++) {
        depositPromise.push(
            accountSvc.withdraw({
                ...depositDetail,
          }),
        );
      }
  
      await Promise.all(depositPromise);
  
      const after = await dbClient.account.findFirst({ where: { userId: 'userId' } });
      expect(after.balance).toBe(0);
    });
  });
  