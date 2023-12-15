import { IsInt, Min } from 'class-validator';

export class ProductQueryDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  pageSize: number = 10;
}
