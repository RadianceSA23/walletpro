import { ApiProperty } from '@nestjs/swagger';

export class TopCategoryReportItemDto {
  @ApiProperty({ description: 'Category name' })
  categoryName: string;

  @ApiProperty({ description: 'Category color' })
  color: string;

  @ApiProperty({ description: 'Category icon' })
  icon: string;

  @ApiProperty({ description: 'Total spent amount' })
  totalAmount: number;

  @ApiProperty({ description: 'Number of transactions' })
  transactionCount: number;

  @ApiProperty({ description: 'Percentage of total expenses' })
  percentage: number;
}

export class MonthlyReportSummaryDto {
  @ApiProperty({ description: 'Report year' })
  year: number;

  @ApiProperty({ description: 'Report month' })
  month: number;

  @ApiProperty({ description: 'Total income for month' })
  totalIncome: number;

  @ApiProperty({ description: 'Total expense for month' })
  totalExpense: number;

  @ApiProperty({ description: 'Net savings for month' })
  netSavings: number;

  @ApiProperty({ description: 'Savings rate percentage' })
  savingsRate: number;

  @ApiProperty({ type: [TopCategoryReportItemDto] })
  topSpendingCategories: TopCategoryReportItemDto[];
}

export class YearlyReportSummaryDto {
  @ApiProperty({ description: 'Report year' })
  year: number;

  @ApiProperty({ description: 'Annual income total' })
  totalIncome: number;

  @ApiProperty({ description: 'Annual expense total' })
  totalExpense: number;

  @ApiProperty({ description: 'Annual net savings' })
  netSavings: number;

  @ApiProperty({ description: 'Monthly breakdown timeline' })
  monthlyBreakdown: Array<{
    month: string;
    income: number;
    expense: number;
    savings: number;
  }>;
}
