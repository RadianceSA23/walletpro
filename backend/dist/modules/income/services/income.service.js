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
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const income_repository_1 = require("../repositories/income.repository");
const categories_service_1 = require("../../categories/services/categories.service");
let IncomeService = class IncomeService {
    constructor(incomeRepository, categoriesService) {
        this.incomeRepository = incomeRepository;
        this.categoriesService = categoriesService;
    }
    async create(userId, createIncomeDto) {
        await this.categoriesService.findOne(createIncomeDto.categoryId);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        return this.incomeRepository.create({
            ...createIncomeDto,
            userId: userObjectId,
            categoryId: new mongoose_1.Types.ObjectId(createIncomeDto.categoryId),
            createdBy: userObjectId,
            updatedBy: userObjectId,
        });
    }
    async findAll(userId, filterDto) {
        return this.incomeRepository.findAll(userId, filterDto);
    }
    async findOne(id, userId) {
        const income = await this.incomeRepository.findById(id, userId);
        if (!income) {
            throw new common_1.NotFoundException(`Income record with ID "${id}" not found`);
        }
        return income;
    }
    async update(id, userId, updateIncomeDto) {
        await this.findOne(id, userId);
        if (updateIncomeDto.categoryId) {
            await this.categoriesService.findOne(updateIncomeDto.categoryId);
        }
        const updated = await this.incomeRepository.update(id, userId, {
            ...updateIncomeDto,
            ...(updateIncomeDto.categoryId && {
                categoryId: new mongoose_1.Types.ObjectId(updateIncomeDto.categoryId),
            }),
            updatedBy: new mongoose_1.Types.ObjectId(userId),
        });
        return updated;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        const softDeleted = await this.incomeRepository.softDelete(id, userId, userId);
        if (!softDeleted) {
            throw new common_1.NotFoundException(`Income record with ID "${id}" could not be deleted`);
        }
        return { message: 'Income record soft deleted successfully' };
    }
};
exports.IncomeService = IncomeService;
exports.IncomeService = IncomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [income_repository_1.IncomeRepository,
        categories_service_1.CategoriesService])
], IncomeService);
//# sourceMappingURL=income.service.js.map