import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { FilterExpenseDto } from '../dto/filter-expense.dto';
import { CategoriesService } from '../../categories/services/categories.service';
export declare class ExpensesService {
    private readonly expenseRepository;
    private readonly categoriesService;
    constructor(expenseRepository: ExpenseRepository, categoriesService: CategoriesService);
    create(userId: string, createExpenseDto: CreateExpenseDto): Promise<import("../schemas/expense.schema").ExpenseDocument>;
    findAll(userId: string, filterDto: FilterExpenseDto): Promise<{
        expenses: import("../schemas/expense.schema").ExpenseDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, userId: string): Promise<import("../schemas/expense.schema").ExpenseDocument>;
    update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto): Promise<import("../schemas/expense.schema").ExpenseDocument>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
