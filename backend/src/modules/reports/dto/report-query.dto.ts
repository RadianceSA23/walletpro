import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ReportQueryDto {
  @ApiPropertyOptional({ description: 'Filter report by year', example: 2026 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number = new Date().getFullYear();

  @ApiPropertyOptional({ description: 'Filter report by month (1 - 12)', example: 7 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number = new Date().getMonth() + 1;
}
