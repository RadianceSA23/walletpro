import { ApiProperty } from '@nestjs/swagger';

export class KPIMetricsDto {
  @ApiProperty({ description: 'Current net balance (Total Income - Total Expense)', example: 4500.50 })
  currentBalance: number;

  @ApiProperty({ description: "Today's expense total", example: 45.00 })
  todayExpenses: number;

  @ApiProperty({ description: "Today's income total", example: 0.00 })
  todayIncome: number;

  @ApiProperty({ description: 'Current month total expenses', example: 1250.00 })
  monthlyExpense: number;

  @ApiProperty({ description: 'Current month total income', example: 5000.00 })
  monthlyIncome: number;
}

export class CategoryBreakdownItemDto {
  @ApiProperty({ description: 'Category ID' })
  categoryId: string;

  @ApiProperty({ description: 'Category name', example: 'Housing & Rent' })
  categoryName: string;

  @ApiProperty({ description: 'Category hex color', example: '#EF4444' })
  color: string;

  @ApiProperty({ description: 'Category icon', example: 'home' })
  icon: string;

  @ApiProperty({ description: 'Total amount', example: 850.00 })
  totalAmount: number;

  @ApiProperty({ description: 'Percentage of total', example: 68.0 })
  percentage: number;
}

export class RecentTransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'Transaction type (INCOME or EXPENSE)', example: 'EXPENSE' })
  type: 'INCOME' | 'EXPENSE';

  @ApiProperty({ description: 'Transaction title', example: 'Supermarket' })
  title: string;

  @ApiProperty({ description: 'Transaction amount', example: 75.50 })
  amount: number;

  @ApiProperty({ description: 'Category name', example: 'Food & Dining' })
  categoryName: string;

  @ApiProperty({ description: 'Category color', example: '#F59E0B' })
  categoryColor: string;

  @ApiProperty({ description: 'Transaction date', example: '2026-07-26T10:00:00.000Z' })
  date: Date;
}

export class MonthlyTrendItemDto {
  @ApiProperty({ description: 'Month name / code', example: 'Jul 2026' })
  month: string;

  @ApiProperty({ description: 'Total income for the month', example: 5000.00 })
  income: number;

  @ApiProperty({ description: 'Total expense for the month', example: 1250.00 })
  expense: number;
}

export class DashboardSummaryResponseDto {
  @ApiProperty({ type: KPIMetricsDto })
  metrics: KPIMetricsDto;

  @ApiProperty({ type: [RecentTransactionDto] })
  recentTransactions: RecentTransactionDto[];

  @ApiProperty({ type: [CategoryBreakdownItemDto] })
  expenseByCategory: CategoryBreakdownItemDto[];

  @ApiProperty({ type: [CategoryBreakdownItemDto] })
  incomeByCategory: CategoryBreakdownItemDto[];

  @ApiProperty({ type: [MonthlyTrendItemDto] })
  monthlyTrend: MonthlyTrendItemDto[];
}
