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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const expense_repository_1 = require("../repositories/expense.repository");
const categories_service_1 = require("../../categories/services/categories.service");
let ExpensesService = class ExpensesService {
    constructor(expenseRepository, categoriesService) {
        this.expenseRepository = expenseRepository;
        this.categoriesService = categoriesService;
    }
    async create(userId, createExpenseDto) {
        await this.categoriesService.findOne(createExpenseDto.categoryId);
        return this.expenseRepository.create({
            ...createExpenseDto,
            userId: new mongoose_1.Types.ObjectId(userId),
            categoryId: new mongoose_1.Types.ObjectId(createExpenseDto.categoryId),
        });
    }
    async findAll(userId, filterDto) {
        return this.expenseRepository.findAll(userId, filterDto);
    }
    async findOne(id, userId) {
        const expense = await this.expenseRepository.findById(id, userId);
        if (!expense) {
            throw new common_1.NotFoundException(`Expense with ID "${id}" not found`);
        }
        return expense;
    }
    async update(id, userId, updateExpenseDto) {
        await this.findOne(id, userId);
        if (updateExpenseDto.categoryId) {
            await this.categoriesService.findOne(updateExpenseDto.categoryId);
        }
        const updated = await this.expenseRepository.update(id, userId, {
            ...updateExpenseDto,
            ...(updateExpenseDto.categoryId && {
                categoryId: new mongoose_1.Types.ObjectId(updateExpenseDto.categoryId),
            }),
        });
        return updated;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        const deleted = await this.expenseRepository.delete(id, userId);
        if (!deleted) {
            throw new common_1.NotFoundException(`Expense with ID "${id}" could not be deleted`);
        }
        return { message: 'Expense record deleted successfully' };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [expense_repository_1.ExpenseRepository,
        categories_service_1.CategoriesService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map