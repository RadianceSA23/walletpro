import { OnModuleInit } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FilterCategoryDto } from '../dto/filter-category.dto';
export declare class CategoriesService implements OnModuleInit {
    private readonly categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    onModuleInit(): Promise<void>;
    create(userId: string, createCategoryDto: CreateCategoryDto): Promise<import("../schemas/category.schema").CategoryDocument>;
    findAll(userId: string, filterDto: FilterCategoryDto): Promise<{
        categories: import("../schemas/category.schema").CategoryDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../schemas/category.schema").CategoryDocument>;
    update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<import("../schemas/category.schema").CategoryDocument>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
