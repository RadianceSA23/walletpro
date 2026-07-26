import { ExpensesService } from '../services/expenses.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { FilterExpenseDto } from '../dto/filter-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(req: any, createExpenseDto: CreateExpenseDto): Promise<import("../schemas/expense.schema").ExpenseDocument>;
    findAll(req: any, filterDto: FilterExpenseDto): Promise<{
        expenses: import("../schemas/expense.schema").ExpenseDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, req: any): Promise<import("../schemas/expense.schema").ExpenseDocument>;
    update(id: string, req: any, updateExpenseDto: UpdateExpenseDto): Promise<import("../schemas/expense.schema").ExpenseDocument>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
