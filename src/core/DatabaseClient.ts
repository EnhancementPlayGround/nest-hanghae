import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import Logger from './logger/Logger';

export default class DatabaseClient
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: Logger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    this.$on('query', (e) =>
      logger.info(
        `Query: ${e.query}, Params: ${e.params}, Duration: ${e.duration}ms`,
      ),
    );
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
