export interface KPIMetrics {
  currentBalance: number;
  todayExpenses: number;
  todayIncome: number;
  monthlyExpense: number;
  monthlyIncome: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  totalAmount: number;
  percentage: number;
}

export interface RecentTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  title: string;
  amount: number;
  categoryName: string;
  categoryColor: string;
  date: string;
}

export interface MonthlyTrendItem {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardSummaryResponse {
  metrics: KPIMetrics;
  recentTransactions: RecentTransaction[];
  expenseByCategory: CategoryBreakdownItem[];
  incomeByCategory: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
}
