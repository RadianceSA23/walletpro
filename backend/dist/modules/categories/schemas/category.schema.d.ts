import { Document, Types } from 'mongoose';
export type CategoryDocument = Category & Document;
export declare enum CategoryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare class Category {
    userId?: Types.ObjectId;
    name: string;
    type: CategoryType;
    color: string;
    icon: string;
    isSystem: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, Document<unknown, any, Category, any, {}> & Category & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, Document<unknown, {}, import("mongoose").FlatRecord<Category>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Category> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
