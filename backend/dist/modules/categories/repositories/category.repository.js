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
exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../schemas/category.schema");
let CategoryRepository = class CategoryRepository {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async create(categoryData) {
        const category = new this.categoryModel(categoryData);
        return category.save();
    }
    async findAll(userId, filterDto) {
        const { type, search, page = 1, limit = 20 } = filterDto;
        const query = {
            $or: [
                { userId: new mongoose_2.Types.ObjectId(userId) },
                { isSystem: true },
            ],
        };
        if (type) {
            query.type = type;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const skip = (page - 1) * limit;
        const [categories, total] = await Promise.all([
            this.categoryModel
                .find(query)
                .sort({ isSystem: -1, name: 1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.categoryModel.countDocuments(query).exec(),
        ]);
        return { categories, total, page, limit };
    }
    async findById(id) {
        return this.categoryModel.findById(id).exec();
    }
    async update(id, userId, updateData) {
        return this.categoryModel
            .findOneAndUpdate({ _id: id, userId: new mongoose_2.Types.ObjectId(userId), isSystem: false }, { $set: updateData }, { new: true })
            .exec();
    }
    async delete(id, userId) {
        const result = await this.categoryModel
            .deleteOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId), isSystem: false })
            .exec();
        return result.deletedCount > 0;
    }
    async seedSystemDefaults() {
        const count = await this.categoryModel.countDocuments({ isSystem: true }).exec();
        if (count > 0)
            return;
        const defaultCategories = [
            { name: 'Salary', type: category_schema_1.CategoryType.INCOME, color: '#10B981', icon: 'wallet', isSystem: true },
            { name: 'Freelance & Business', type: category_schema_1.CategoryType.INCOME, color: '#3B82F6', icon: 'briefcase', isSystem: true },
            { name: 'Investments', type: category_schema_1.CategoryType.INCOME, color: '#8B5CF6', icon: 'trending-up', isSystem: true },
            { name: 'Other Income', type: category_schema_1.CategoryType.INCOME, color: '#6B7280', icon: 'plus-circle', isSystem: true },
            { name: 'Housing & Rent', type: category_schema_1.CategoryType.EXPENSE, color: '#EF4444', icon: 'home', isSystem: true },
            { name: 'Food & Dining', type: category_schema_1.CategoryType.EXPENSE, color: '#F59E0B', icon: 'utensils', isSystem: true },
            { name: 'Transportation', type: category_schema_1.CategoryType.EXPENSE, color: '#06B6D4', icon: 'car', isSystem: true },
            { name: 'Utilities & Bills', type: category_schema_1.CategoryType.EXPENSE, color: '#EC4899', icon: 'zap', isSystem: true },
            { name: 'Entertainment', type: category_schema_1.CategoryType.EXPENSE, color: '#84CC16', icon: 'film', isSystem: true },
            { name: 'Shopping', type: category_schema_1.CategoryType.EXPENSE, color: '#D946EF', icon: 'shopping-bag', isSystem: true },
        ];
        await this.categoryModel.insertMany(defaultCategories);
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoryRepository);
//# sourceMappingURL=category.repository.js.map