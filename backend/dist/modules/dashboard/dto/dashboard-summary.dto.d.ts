export declare class KPIMetricsDto {
    currentBalance: number;
    todayExpenses: number;
    todayIncome: number;
    monthlyExpense: number;
    monthlyIncome: number;
}
export declare class CategoryBreakdownItemDto {
    categoryId: string;
    categoryName: string;
    color: string;
    icon: string;
    totalAmount: number;
    percentage: number;
}
export declare class RecentTransactionDto {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    title: string;
    amount: number;
    categoryName: string;
    categoryColor: string;
    date: Date;
}
export declare class MonthlyTrendItemDto {
    month: string;
    income: number;
    expense: number;
}
export declare class DashboardSummaryResponseDto {
    metrics: KPIMetricsDto;
    recentTransactions: RecentTransactionDto[];
    expenseByCategory: CategoryBreakdownItemDto[];
    incomeByCategory: CategoryBreakdownItemDto[];
    monthlyTrend: MonthlyTrendItemDto[];
}
