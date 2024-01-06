import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import Logger from './logger/Logger';

export default class DatabaseClient
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    private readonly is_production = process.env.NODE_ENV === 'production',
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    if (this.is_production) {
      this.$on('query', (e) =>
        this.logger.info(
          `Query: ${e.query}, Params: ${e.params}, Duration: ${e.duration}ms`,
        ),
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
