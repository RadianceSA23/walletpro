import { Document, Types } from 'mongoose';
export type IncomeDocument = Income & Document;
export declare class Income {
    userId: Types.ObjectId;
    categoryId: Types.ObjectId;
    amount: number;
    title: string;
    description?: string;
    date: Date;
    source: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const IncomeSchema: import("mongoose").Schema<Income, import("mongoose").Model<Income, any, any, any, Document<unknown, any, Income, any, {}> & Income & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Income, Document<unknown, {}, import("mongoose").FlatRecord<Income>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Income> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
