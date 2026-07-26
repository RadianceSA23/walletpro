import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from '../schemas/expense.schema';
import { FilterExpenseDto } from '../dto/filter-expense.dto';
export interface IExpenseRepository {
    create(expenseData: Partial<Expense>): Promise<ExpenseDocument>;
    findAll(userId: string, filterDto: FilterExpenseDto): Promise<{
        expenses: ExpenseDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string, userId: string): Promise<ExpenseDocument | null>;
    update(id: string, userId: string, updateData: Partial<Expense>): Promise<ExpenseDocument | null>;
    delete(id: string, userId: string): Promise<boolean>;
}
export declare class ExpenseRepository implements IExpenseRepository {
    private readonly expenseModel;
    constructor(expenseModel: Model<ExpenseDocument>);
    create(expenseData: Partial<Expense>): Promise<ExpenseDocument>;
    findAll(userId: string, filterDto: FilterExpenseDto): Promise<{
        expenses: ExpenseDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string, userId: string): Promise<ExpenseDocument | null>;
    update(id: string, userId: string, updateData: Partial<Expense>): Promise<ExpenseDocument | null>;
    delete(id: string, userId: string): Promise<boolean>;
}
