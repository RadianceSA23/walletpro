import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FilterCategoryDto } from '../dto/filter-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(req: any, createCategoryDto: CreateCategoryDto): Promise<import("../schemas/category.schema").CategoryDocument>;
    findAll(req: any, filterDto: FilterCategoryDto): Promise<{
        categories: import("../schemas/category.schema").CategoryDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../schemas/category.schema").CategoryDocument>;
    update(id: string, req: any, updateCategoryDto: UpdateCategoryDto): Promise<import("../schemas/category.schema").CategoryDocument>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
