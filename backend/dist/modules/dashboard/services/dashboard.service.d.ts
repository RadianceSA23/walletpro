import { Model } from 'mongoose';
import { ExpenseDocument } from '../../expenses/schemas/expense.schema';
import { IncomeDocument } from '../../income/schemas/income.schema';
import { DashboardSummaryResponseDto } from '../dto/dashboard-summary.dto';
export declare class DashboardService {
    private readonly expenseModel;
    private readonly incomeModel;
    constructor(expenseModel: Model<ExpenseDocument>, incomeModel: Model<IncomeDocument>);
    getSummary(userId: string): Promise<DashboardSummaryResponseDto>;
}
