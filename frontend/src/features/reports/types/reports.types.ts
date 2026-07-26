export interface TopCategoryReportItem {
  categoryName: string;
  color: string;
  icon: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface MonthlyReportSummary {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  topSpendingCategories: TopCategoryReportItem[];
}

export interface YearlyReportSummary {
  year: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  monthlyBreakdown: Array<{ month: string; income: number; expense: number; savings: number }>;
}
