import { DistributedLockManager } from "@/share/distributed-lock.manager";
import { Injectable } from "@nestjs/common";
import AccountService, { IDeposit } from "./account.service";

@Injectable()
export default class DistributedLockAccountService {
  constructor(
    private readonly lockManager: DistributedLockManager,
    private readonly accountSvc: AccountService,
  ) {}

  async deposit({ userId, amount }: IDeposit) {
    await this.lockManager.tryAcquireLock('myLock', 5, 1000);
    try {
      return await this.accountSvc.deposit({ userId, amount });
    } finally {
      await this.lockManager.releaseLock('myLock');
    }
  }
}
