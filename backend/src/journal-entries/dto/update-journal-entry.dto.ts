import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { IsNotFutureDateValidator } from '../../common/validators/is-not-future-date.validator';

export class UpdateJournalEntryDto {
  @ApiPropertyOptional({ example: '2026-05-20' })
  @IsOptional()
  @IsDateString()
  @Validate(IsNotFutureDateValidator)
  performedAt?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  workTypeId?: number;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  volume?: number;

  @ApiPropertyOptional({ example: 'Иванов И.И.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  executorName?: string;
}
