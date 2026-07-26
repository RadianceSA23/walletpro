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
exports.ExpenseRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../schemas/expense.schema");
let ExpenseRepository = class ExpenseRepository {
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
    }
    async create(expenseData) {
        const expense = new this.expenseModel(expenseData);
        return (await expense.save()).populate('categoryId', 'name color icon type');
    }
    async findAll(userId, filterDto) {
        const { categoryId, search, paymentMethod, startDate, endDate, minAmount, maxAmount, sortBy = 'date', sortOrder = 'desc', page = 1, limit = 10, } = filterDto;
        const query = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (categoryId) {
            query.categoryId = new mongoose_2.Types.ObjectId(categoryId);
        }
        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        if (minAmount !== undefined || maxAmount !== undefined) {
            query.amount = {};
            if (minAmount !== undefined)
                query.amount.$gte = minAmount;
            if (maxAmount !== undefined)
                query.amount.$lte = maxAmount;
        }
        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const [expenses, total] = await Promise.all([
            this.expenseModel
                .find(query)
                .populate('categoryId', 'name color icon type')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.expenseModel.countDocuments(query).exec(),
        ]);
        return { expenses, total, page, limit };
    }
    async findById(id, userId) {
        return this.expenseModel
            .findOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('categoryId', 'name color icon type')
            .exec();
    }
    async update(id, userId, updateData) {
        return this.expenseModel
            .findOneAndUpdate({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) }, { $set: updateData }, { new: true })
            .populate('categoryId', 'name color icon type')
            .exec();
    }
    async delete(id, userId) {
        const result = await this.expenseModel
            .deleteOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        return result.deletedCount > 0;
    }
};
exports.ExpenseRepository = ExpenseRepository;
exports.ExpenseRepository = ExpenseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpenseRepository);
//# sourceMappingURL=expense.repository.js.map