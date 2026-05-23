import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JournalEntry } from '../journal-entries/journal-entry.entity';

@Entity('work_types')
export class WorkType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Кладка перегородок' })
  @Column({ length: 255 })
  name!: string;

  @ApiProperty({ example: 'м²' })
  @Column({ length: 32 })
  unit!: string;

  @OneToMany(() => JournalEntry, (entry) => entry.workType)
  entries!: JournalEntry[];
}
