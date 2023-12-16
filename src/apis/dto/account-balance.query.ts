import { IsString } from 'class-validator';

export class AccountBalanceQueryDto {
  @IsString()
  userId: string;
}
