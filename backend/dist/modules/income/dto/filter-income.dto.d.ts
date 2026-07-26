export declare class FilterIncomeDto {
    categoryId?: string;
    search?: string;
    source?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
