"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardSummaryResponseDto = exports.MonthlyTrendItemDto = exports.RecentTransactionDto = exports.CategoryBreakdownItemDto = exports.KPIMetricsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class KPIMetricsDto {
}
exports.KPIMetricsDto = KPIMetricsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current net balance (Total Income - Total Expense)', example: 4500.50 }),
    __metadata("design:type", Number)
], KPIMetricsDto.prototype, "currentBalance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Today's expense total", example: 45.00 }),
    __metadata("design:type", Number)
], KPIMetricsDto.prototype, "todayExpenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Today's income total", example: 0.00 }),
    __metadata("design:type", Number)
], KPIMetricsDto.prototype, "todayIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current month total expenses', example: 1250.00 }),
    __metadata("design:type", Number)
], KPIMetricsDto.prototype, "monthlyExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current month total income', example: 5000.00 }),
    __metadata("design:type", Number)
], KPIMetricsDto.prototype, "monthlyIncome", void 0);
class CategoryBreakdownItemDto {
}
exports.CategoryBreakdownItemDto = CategoryBreakdownItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category ID' }),
    __metadata("design:type", String)
], CategoryBreakdownItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name', example: 'Housing & Rent' }),
    __metadata("design:type", String)
], CategoryBreakdownItemDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category hex color', example: '#EF4444' }),
    __metadata("design:type", String)
], CategoryBreakdownItemDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category icon', example: 'home' }),
    __metadata("design:type", String)
], CategoryBreakdownItemDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount', example: 850.00 }),
    __metadata("design:type", Number)
], CategoryBreakdownItemDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage of total', example: 68.0 }),
    __metadata("design:type", Number)
], CategoryBreakdownItemDto.prototype, "percentage", void 0);
class RecentTransactionDto {
}
exports.RecentTransactionDto = RecentTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID' }),
    __metadata("design:type", String)
], RecentTransactionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction type (INCOME or EXPENSE)', example: 'EXPENSE' }),
    __metadata("design:type", String)
], RecentTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction title', example: 'Supermarket' }),
    __metadata("design:type", String)
], RecentTransactionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction amount', example: 75.50 }),
    __metadata("design:type", Number)
], RecentTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name', example: 'Food & Dining' }),
    __metadata("design:type", String)
], RecentTransactionDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category color', example: '#F59E0B' }),
    __metadata("design:type", String)
], RecentTransactionDto.prototype, "categoryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction date', example: '2026-07-26T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RecentTransactionDto.prototype, "date", void 0);
class MonthlyTrendItemDto {
}
exports.MonthlyTrendItemDto = MonthlyTrendItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Month name / code', example: 'Jul 2026' }),
    __metadata("design:type", String)
], MonthlyTrendItemDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total income for the month', example: 5000.00 }),
    __metadata("design:type", Number)
], MonthlyTrendItemDto.prototype, "income", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense for the month', example: 1250.00 }),
    __metadata("design:type", Number)
], MonthlyTrendItemDto.prototype, "expense", void 0);
class DashboardSummaryResponseDto {
}
exports.DashboardSummaryResponseDto = DashboardSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: KPIMetricsDto }),
    __metadata("design:type", KPIMetricsDto)
], DashboardSummaryResponseDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RecentTransactionDto] }),
    __metadata("design:type", Array)
], DashboardSummaryResponseDto.prototype, "recentTransactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryBreakdownItemDto] }),
    __metadata("design:type", Array)
], DashboardSummaryResponseDto.prototype, "expenseByCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryBreakdownItemDto] }),
    __metadata("design:type", Array)
], DashboardSummaryResponseDto.prototype, "incomeByCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MonthlyTrendItemDto] }),
    __metadata("design:type", Array)
], DashboardSummaryResponseDto.prototype, "monthlyTrend", void 0);
//# sourceMappingURL=dashboard-summary.dto.js.map