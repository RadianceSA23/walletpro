export declare class TopCategoryReportItemDto {
    categoryName: string;
    color: string;
    icon: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
}
export declare class MonthlyReportSummaryDto {
    year: number;
    month: number;
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: number;
    topSpendingCategories: TopCategoryReportItemDto[];
}
export declare class YearlyReportSummaryDto {
    year: number;
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    monthlyBreakdown: Array<{
        month: string;
        income: number;
        expense: number;
        savings: number;
    }>;
}
