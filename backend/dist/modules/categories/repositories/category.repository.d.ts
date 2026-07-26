import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { FilterCategoryDto } from '../dto/filter-category.dto';
export interface ICategoryRepository {
    create(categoryData: Partial<Category>): Promise<CategoryDocument>;
    findAll(userId: string, filterDto: FilterCategoryDto): Promise<{
        categories: CategoryDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<CategoryDocument | null>;
    update(id: string, userId: string, updateData: Partial<Category>): Promise<CategoryDocument | null>;
    delete(id: string, userId: string): Promise<boolean>;
    seedSystemDefaults(): Promise<void>;
}
export declare class CategoryRepository implements ICategoryRepository {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    create(categoryData: Partial<Category>): Promise<CategoryDocument>;
    findAll(userId: string, filterDto: FilterCategoryDto): Promise<{
        categories: CategoryDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<CategoryDocument | null>;
    update(id: string, userId: string, updateData: Partial<Category>): Promise<CategoryDocument | null>;
    delete(id: string, userId: string): Promise<boolean>;
    seedSystemDefaults(): Promise<void>;
}
