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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("../services/reports.service");
const report_query_dto_1 = require("../dto/report-query.dto");
const report_response_dto_1 = require("../dto/report-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getMonthlyReport(req, query) {
        const userId = req.user?.id || req.user?._id;
        return this.reportsService.getMonthlyReport(userId, query.year, query.month);
    }
    getYearlyReport(req, query) {
        const userId = req.user?.id || req.user?._id;
        return this.reportsService.getYearlyReport(userId, query.year);
    }
    getTopSpending(req, query) {
        const userId = req.user?.id || req.user?._id;
        return this.reportsService.getTopSpendingCategories(userId, query.year, query.month, 5);
    }
    async exportCSV(req, type, year, month, res) {
        const userId = req.user?.id || req.user?._id;
        const csvData = await this.reportsService.generateCSV(userId, type || 'expenses', year || 2026, month);
        res.attachment(`${type || 'expenses'}-report-${year || 2026}${month ? '-' + month : ''}.csv`);
        return res.send(csvData);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('monthly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly financial summary report' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: report_response_dto_1.MonthlyReportSummaryDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_query_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('yearly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get yearly financial breakdown report' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: report_response_dto_1.YearlyReportSummaryDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_query_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getYearlyReport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('top-spending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top spending categories breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [report_response_dto_1.TopCategoryReportItemDto] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_query_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTopSpending", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export financial records as downloadable CSV spreadsheet' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: ['expenses', 'income'], required: true }),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Query)('month')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportCSV", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map