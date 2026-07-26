import { IncomeRepository } from '../repositories/income.repository';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { FilterIncomeDto } from '../dto/filter-income.dto';
import { CategoriesService } from '../../categories/services/categories.service';
export declare class IncomeService {
    private readonly incomeRepository;
    private readonly categoriesService;
    constructor(incomeRepository: IncomeRepository, categoriesService: CategoriesService);
    create(userId: string, createIncomeDto: CreateIncomeDto): Promise<import("../schemas/income.schema").IncomeDocument>;
    findAll(userId: string, filterDto: FilterIncomeDto): Promise<{
        incomes: import("../schemas/income.schema").IncomeDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, userId: string): Promise<import("../schemas/income.schema").IncomeDocument>;
    update(id: string, userId: string, updateIncomeDto: UpdateIncomeDto): Promise<import("../schemas/income.schema").IncomeDocument>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
