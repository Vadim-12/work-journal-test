import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JournalEntry } from '../journal-entries/journal-entry.entity';
import { WorkType } from '../work-types/work-type.entity';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER ?? 'journal',
    password: process.env.DB_PASSWORD ?? 'journal',
    database: process.env.DB_NAME ?? 'work_journal',
    entities: [WorkType, JournalEntry],
    synchronize: process.env.DB_SYNCHRONIZE !== 'false',
  };
}
