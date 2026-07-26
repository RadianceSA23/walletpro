import { Model } from 'mongoose';
import { Income, IncomeDocument } from '../schemas/income.schema';
import { FilterIncomeDto } from '../dto/filter-income.dto';
export interface IIncomeRepository {
    create(incomeData: Partial<Income>): Promise<IncomeDocument>;
    findAll(userId: string, filterDto: FilterIncomeDto): Promise<{
        incomes: IncomeDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string, userId: string): Promise<IncomeDocument | null>;
    update(id: string, userId: string, updateData: Partial<Income>): Promise<IncomeDocument | null>;
    softDelete(id: string, userId: string, updatedBy: string): Promise<boolean>;
}
export declare class IncomeRepository implements IIncomeRepository {
    private readonly incomeModel;
    constructor(incomeModel: Model<IncomeDocument>);
    create(incomeData: Partial<Income>): Promise<IncomeDocument>;
    findAll(userId: string, filterDto: FilterIncomeDto): Promise<{
        incomes: IncomeDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string, userId: string): Promise<IncomeDocument | null>;
    update(id: string, userId: string, updateData: Partial<Income>): Promise<IncomeDocument | null>;
    softDelete(id: string, userId: string, updatedBy: string): Promise<boolean>;
}
