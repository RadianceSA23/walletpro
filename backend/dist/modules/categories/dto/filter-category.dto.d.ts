import { CategoryType } from '../schemas/category.schema';
export declare class FilterCategoryDto {
    type?: CategoryType;
    search?: string;
    page?: number;
    limit?: number;
}
