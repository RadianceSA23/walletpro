import { PaymentMethod } from '../schemas/expense.schema';
export declare class CreateExpenseDto {
    categoryId: string;
    amount: number;
    title: string;
    description?: string;
    date: Date;
    paymentMethod?: PaymentMethod;
}
