import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkType } from '../work-types/work-type.entity';

@Entity('journal_entries')
export class JournalEntry {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: '2026-05-20' })
  @Column({ type: 'date', name: 'performed_at' })
  performedAt!: string;

  @ApiProperty({ example: '24.000' })
  @Column({ type: 'decimal', precision: 12, scale: 3 })
  volume!: string;

  @ApiProperty({ example: 'Иванов И.И.' })
  @Column({ length: 255, name: 'executor_name' })
  executorName!: string;

  @ApiProperty()
  @Column({ name: 'work_type_id' })
  workTypeId!: number;

  @ApiProperty({ type: () => WorkType })
  @ManyToOne(() => WorkType, (workType) => workType.entries, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'work_type_id' })
  workType!: WorkType;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
