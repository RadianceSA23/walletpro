import { Document, Types } from 'mongoose';
export type ExpenseDocument = Expense & Document;
export declare enum PaymentMethod {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    OTHER = "OTHER"
}
export declare class Expense {
    userId: Types.ObjectId;
    categoryId: Types.ObjectId;
    amount: number;
    title: string;
    description?: string;
    date: Date;
    paymentMethod: PaymentMethod;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense, any, {}> & Expense & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Expense> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
