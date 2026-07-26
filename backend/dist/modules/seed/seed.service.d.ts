import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { CategoryDocument } from '../categories/schemas/category.schema';
import { ExpenseDocument } from '../expenses/schemas/expense.schema';
import { IncomeDocument } from '../income/schemas/income.schema';
export declare class SeedService implements OnModuleInit {
    private readonly userModel;
    private readonly categoryModel;
    private readonly expenseModel;
    private readonly incomeModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, categoryModel: Model<CategoryDocument>, expenseModel: Model<ExpenseDocument>, incomeModel: Model<IncomeDocument>);
    onModuleInit(): Promise<void>;
    seedDemoData(): Promise<void>;
}
