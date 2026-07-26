import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../schemas/expense.schema';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Category ID reference',
    example: '65b2d8e0a1234567890abcde',
  })
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Expense transaction amount', example: 120.5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Expense line-item title',
    example: 'Weekly Groceries',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed note or memo',
    example: 'Supermarket purchase',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Date of transaction',
    example: '2026-07-26T10:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiPropertyOptional({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
