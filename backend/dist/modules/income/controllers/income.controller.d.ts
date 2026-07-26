import { IncomeService } from '../services/income.service';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { FilterIncomeDto } from '../dto/filter-income.dto';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    create(req: any, createIncomeDto: CreateIncomeDto): Promise<import("../schemas/income.schema").IncomeDocument>;
    findAll(req: any, filterDto: FilterIncomeDto): Promise<{
        incomes: import("../schemas/income.schema").IncomeDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, req: any): Promise<import("../schemas/income.schema").IncomeDocument>;
    update(id: string, req: any, updateIncomeDto: UpdateIncomeDto): Promise<import("../schemas/income.schema").IncomeDocument>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
