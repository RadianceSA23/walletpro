import { Model } from 'mongoose';
import { ExpenseDocument } from '../../expenses/schemas/expense.schema';
import { IncomeDocument } from '../../income/schemas/income.schema';
import { MonthlyReportSummaryDto, YearlyReportSummaryDto, TopCategoryReportItemDto } from '../dto/report-response.dto';
export declare class ReportsService {
    private readonly expenseModel;
    private readonly incomeModel;
    constructor(expenseModel: Model<ExpenseDocument>, incomeModel: Model<IncomeDocument>);
    getMonthlyReport(userId: string, year: number, month: number): Promise<MonthlyReportSummaryDto>;
    getYearlyReport(userId: string, year: number): Promise<YearlyReportSummaryDto>;
    getTopSpendingCategories(userId: string, year: number, month?: number, limit?: number): Promise<TopCategoryReportItemDto[]>;
    generateCSV(userId: string, type: 'expenses' | 'income', year: number, month?: number): Promise<string>;
}
