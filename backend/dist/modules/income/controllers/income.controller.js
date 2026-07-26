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
exports.IncomeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const income_service_1 = require("../services/income.service");
const create_income_dto_1 = require("../dto/create-income.dto");
const update_income_dto_1 = require("../dto/update-income.dto");
const filter_income_dto_1 = require("../dto/filter-income.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let IncomeController = class IncomeController {
    constructor(incomeService) {
        this.incomeService = incomeService;
    }
    create(req, createIncomeDto) {
        const userId = req.user?.id || req.user?._id;
        return this.incomeService.create(userId, createIncomeDto);
    }
    findAll(req, filterDto) {
        const userId = req.user?.id || req.user?._id;
        return this.incomeService.findAll(userId, filterDto);
    }
    findOne(id, req) {
        const userId = req.user?.id || req.user?._id;
        return this.incomeService.findOne(id, userId);
    }
    update(id, req, updateIncomeDto) {
        const userId = req.user?.id || req.user?._id;
        return this.incomeService.update(id, userId, updateIncomeDto);
    }
    remove(id, req) {
        const userId = req.user?.id || req.user?._id;
        return this.incomeService.remove(id, userId);
    }
};
exports.IncomeController = IncomeController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Log a new income transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Income record created' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_income_dto_1.CreateIncomeDto]),
    __metadata("design:returntype", void 0)
], IncomeController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List user income records with filtering, search, and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Income records list' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_income_dto_1.FilterIncomeDto]),
    __metadata("design:returntype", void 0)
], IncomeController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single income record details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Income record details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Income record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncomeController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update existing income record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Income updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_income_dto_1.UpdateIncomeDto]),
    __metadata("design:returntype", void 0)
], IncomeController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete income record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Income record soft deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncomeController.prototype, "remove", null);
exports.IncomeController = IncomeController = __decorate([
    (0, swagger_1.ApiTags)('Income'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('incomes'),
    __metadata("design:paramtypes", [income_service_1.IncomeService])
], IncomeController);
//# sourceMappingURL=income.controller.js.map