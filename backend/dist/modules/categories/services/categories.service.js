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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("../repositories/category.repository");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async onModuleInit() {
        await this.categoryRepository.seedSystemDefaults();
    }
    async create(userId, createCategoryDto) {
        return this.categoryRepository.create({
            ...createCategoryDto,
            userId: userId,
            isSystem: false,
        });
    }
    async findAll(userId, filterDto) {
        return this.categoryRepository.findAll(userId, filterDto);
    }
    async findOne(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }
    async update(id, userId, updateCategoryDto) {
        const category = await this.findOne(id);
        if (category.isSystem) {
            throw new common_1.ForbiddenException('System categories cannot be modified');
        }
        if (category.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to modify this category');
        }
        const updatedCategory = await this.categoryRepository.update(id, userId, updateCategoryDto);
        return updatedCategory;
    }
    async remove(id, userId) {
        const category = await this.findOne(id);
        if (category.isSystem) {
            throw new common_1.ForbiddenException('System categories cannot be deleted');
        }
        if (category.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this category');
        }
        const deleted = await this.categoryRepository.delete(id, userId);
        if (!deleted) {
            throw new common_1.NotFoundException(`Category with ID "${id}" could not be deleted`);
        }
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map