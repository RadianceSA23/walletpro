import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryType } from '../schemas/category.schema';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category display name', example: 'Subscriptions' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'Category type (INCOME or EXPENSE)', enum: CategoryType, example: CategoryType.EXPENSE })
  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;

  @ApiPropertyOptional({ description: 'Category visual hex color code', example: '#8B5CF6' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({ description: 'Lucide icon identifier', example: 'tv' })
  @IsOptional()
  @IsString()
  icon?: string;
}
