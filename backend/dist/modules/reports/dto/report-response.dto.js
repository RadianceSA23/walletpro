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
exports.YearlyReportSummaryDto = exports.MonthlyReportSummaryDto = exports.TopCategoryReportItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TopCategoryReportItemDto {
}
exports.TopCategoryReportItemDto = TopCategoryReportItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name' }),
    __metadata("design:type", String)
], TopCategoryReportItemDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category color' }),
    __metadata("design:type", String)
], TopCategoryReportItemDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category icon' }),
    __metadata("design:type", String)
], TopCategoryReportItemDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total spent amount' }),
    __metadata("design:type", Number)
], TopCategoryReportItemDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of transactions' }),
    __metadata("design:type", Number)
], TopCategoryReportItemDto.prototype, "transactionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage of total expenses' }),
    __metadata("design:type", Number)
], TopCategoryReportItemDto.prototype, "percentage", void 0);
class MonthlyReportSummaryDto {
}
exports.MonthlyReportSummaryDto = MonthlyReportSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report year' }),
    __metadata("design:type", Number)
], MonthlyReportSummaryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report month' }),
    __metadata("design:type", Number)
], MonthlyReportSummaryDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total income for month' }),
    __metadata("design:type", Number)
], MonthlyReportSummaryDto.prototype, "totalIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense for month' }),
    __metadata("design:type", Number)
], MonthlyReportSummaryDto.prototype, "totalExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Net savings for month' }),
    __metadata("design:type", Number)
], MonthlyReportSummaryDto.prototype, "netSavings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Savings rate percentage' }),
    __metadata("design:type", Number)
], MonthlyReportSummaryDto.prototype, "savingsRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TopCategoryReportItemDto] }),
    __metadata("design:type", Array)
], MonthlyReportSummaryDto.prototype, "topSpendingCategories", void 0);
class YearlyReportSummaryDto {
}
exports.YearlyReportSummaryDto = YearlyReportSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report year' }),
    __metadata("design:type", Number)
], YearlyReportSummaryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Annual income total' }),
    __metadata("design:type", Number)
], YearlyReportSummaryDto.prototype, "totalIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Annual expense total' }),
    __metadata("design:type", Number)
], YearlyReportSummaryDto.prototype, "totalExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Annual net savings' }),
    __metadata("design:type", Number)
], YearlyReportSummaryDto.prototype, "netSavings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monthly breakdown timeline' }),
    __metadata("design:type", Array)
], YearlyReportSummaryDto.prototype, "monthlyBreakdown", void 0);
//# sourceMappingURL=report-response.dto.js.map