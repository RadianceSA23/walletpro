import { PaymentMethod } from '../schemas/expense.schema';
export declare class FilterExpenseDto {
    categoryId?: string;
    search?: string;
    paymentMethod?: PaymentMethod;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
