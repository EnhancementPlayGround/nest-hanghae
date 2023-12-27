import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import AccountService from '@/application/accounts/AccountService';
import { AccountBalanceQueryDto } from './dto/account-balance.query';

@Controller('accounts')
export default class AccountController {
  constructor(private readonly accountSvc: AccountService) {}

  @Get()
  async getBalance(@Query() { userId }: AccountBalanceQueryDto) {
    const balance = await this.accountSvc.getBalance({ userId });
    return {
      balance,
    };
  }

  @Post()
  async deposit(@Body() { userId, amount }) {
    const newBalance = await this.accountSvc.deposit({ userId, amount });
    return {
      newBalance,
    };
  }
}
