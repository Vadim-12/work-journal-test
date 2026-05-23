import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { IsNotFutureDateValidator } from '../../common/validators/is-not-future-date.validator';

export class CreateJournalEntryDto {
  @ApiProperty({ example: '2026-05-20', description: 'Дата выполнения работ' })
  @IsDateString()
  @Validate(IsNotFutureDateValidator)
  performedAt!: string;

  @ApiProperty({ example: 1, description: 'ID вида работ из справочника' })
  @IsInt()
  @Min(1)
  workTypeId!: number;

  @ApiProperty({ example: 24, description: 'Объём выполненных работ' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  volume!: number;

  @ApiProperty({ example: 'Иванов И.И.', description: 'ФИО исполнителя' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  executorName!: string;
}
