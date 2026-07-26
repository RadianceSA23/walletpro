import { CategoryType } from '../schemas/category.schema';
export declare class CreateCategoryDto {
    name: string;
    type: CategoryType;
    color?: string;
    icon?: string;
}
