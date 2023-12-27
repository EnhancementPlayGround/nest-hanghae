import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import DatabaseClient from '@/core/DatabaseClient';

export class E2ETestUtils {
  private app: INestApplication;
  private dbClient: DatabaseClient;

  async setupModule(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    this.dbClient = moduleFixture.get<DatabaseClient>(DatabaseClient);
  }

  async tearDown(): Promise<void> {
    const tables = await this.dbClient.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public';
    `;

    for (const table of tables) {
      await this.dbClient.$executeRawUnsafe(
        `TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE;`,
      );
    }

    await this.app.close();
  }

  getTestResources() {
    return { app: this.app, dbClient: this.dbClient };
  }
}
