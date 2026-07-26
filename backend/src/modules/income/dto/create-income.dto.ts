import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ description: 'Category ID reference', example: '65b2d8e0a1234567890abcde' })
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Income transaction amount', example: 5000.00 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Income title', example: 'Monthly Salary' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed note or memo', example: 'Primary payroll transfer' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Income source/client', example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ description: 'Date of transaction', example: '2026-07-26T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
