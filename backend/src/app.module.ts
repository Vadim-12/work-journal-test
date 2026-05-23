import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { WorkTypesModule } from './work-types/work-types.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    WorkTypesModule,
    JournalEntriesModule,
  ],
})
export class AppModule {}
