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
exports.IncomeRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const income_schema_1 = require("../schemas/income.schema");
let IncomeRepository = class IncomeRepository {
    constructor(incomeModel) {
        this.incomeModel = incomeModel;
    }
    async create(incomeData) {
        const income = new this.incomeModel({ ...incomeData, isDeleted: false });
        return (await income.save()).populate('categoryId', 'name color icon type');
    }
    async findAll(userId, filterDto) {
        const { categoryId, search, source, startDate, endDate, sortBy = 'date', sortOrder = 'desc', page = 1, limit = 10, } = filterDto;
        const query = {
            userId: new mongoose_2.Types.ObjectId(userId),
            isDeleted: false,
        };
        if (categoryId) {
            query.categoryId = new mongoose_2.Types.ObjectId(categoryId);
        }
        if (source) {
            query.source = { $regex: source, $options: 'i' };
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { source: { $regex: search, $options: 'i' } },
            ];
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const [incomes, total] = await Promise.all([
            this.incomeModel
                .find(query)
                .populate('categoryId', 'name color icon type')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.incomeModel.countDocuments(query).exec(),
        ]);
        return { incomes, total, page, limit };
    }
    async findById(id, userId) {
        return this.incomeModel
            .findOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId), isDeleted: false })
            .populate('categoryId', 'name color icon type')
            .exec();
    }
    async update(id, userId, updateData) {
        return this.incomeModel
            .findOneAndUpdate({ _id: id, userId: new mongoose_2.Types.ObjectId(userId), isDeleted: false }, { $set: updateData }, { new: true })
            .populate('categoryId', 'name color icon type')
            .exec();
    }
    async softDelete(id, userId, updatedBy) {
        const result = await this.incomeModel
            .updateOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId), isDeleted: false }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy: new mongoose_2.Types.ObjectId(updatedBy),
            },
        })
            .exec();
        return result.modifiedCount > 0;
    }
};
exports.IncomeRepository = IncomeRepository;
exports.IncomeRepository = IncomeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(income_schema_1.Income.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IncomeRepository);
//# sourceMappingURL=income.repository.js.map