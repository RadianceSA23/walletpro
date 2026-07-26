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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../../expenses/schemas/expense.schema");
const income_schema_1 = require("../../income/schemas/income.schema");
let DashboardService = class DashboardService {
    constructor(expenseModel, incomeModel) {
        this.expenseModel = expenseModel;
        this.incomeModel = incomeModel;
    }
    async getSummary(userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const [totalIncomeRes, totalExpenseRes, todayIncomeRes, todayExpenseRes, monthIncomeRes, monthExpenseRes, expenseByCategoryRes, incomeByCategoryRes, recentExpenses, recentIncomes,] = await Promise.all([
            this.incomeModel.aggregate([
                { $match: { userId: userObjectId, isDeleted: false } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.expenseModel.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.incomeModel.aggregate([
                { $match: { userId: userObjectId, isDeleted: false, date: { $gte: startOfToday, $lte: endOfToday } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.expenseModel.aggregate([
                { $match: { userId: userObjectId, date: { $gte: startOfToday, $lte: endOfToday } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.incomeModel.aggregate([
                { $match: { userId: userObjectId, isDeleted: false, date: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.expenseModel.aggregate([
                { $match: { userId: userObjectId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.expenseModel.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: '$categoryId', totalAmount: { $sum: '$amount' } } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                { $sort: { totalAmount: -1 } },
            ]),
            this.incomeModel.aggregate([
                { $match: { userId: userObjectId, isDeleted: false } },
                { $group: { _id: '$categoryId', totalAmount: { $sum: '$amount' } } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                { $sort: { totalAmount: -1 } },
            ]),
            this.expenseModel
                .find({ userId: userObjectId })
                .populate('categoryId', 'name color icon')
                .sort({ date: -1 })
                .limit(5)
                .exec(),
            this.incomeModel
                .find({ userId: userObjectId, isDeleted: false })
                .populate('categoryId', 'name color icon')
                .sort({ date: -1 })
                .limit(5)
                .exec(),
        ]);
        const totalIncome = totalIncomeRes[0]?.total || 0;
        const totalExpense = totalExpenseRes[0]?.total || 0;
        const currentBalance = totalIncome - totalExpense;
        const todayExpenses = todayExpenseRes[0]?.total || 0;
        const todayIncome = todayIncomeRes[0]?.total || 0;
        const monthlyExpense = monthExpenseRes[0]?.total || 0;
        const monthlyIncome = monthIncomeRes[0]?.total || 0;
        const expenseByCategory = expenseByCategoryRes.map((item) => ({
            categoryId: item._id.toString(),
            categoryName: item.category.name,
            color: item.category.color,
            icon: item.category.icon,
            totalAmount: item.totalAmount,
            percentage: totalExpense > 0 ? Number(((item.totalAmount / totalExpense) * 100).toFixed(1)) : 0,
        }));
        const incomeByCategory = incomeByCategoryRes.map((item) => ({
            categoryId: item._id.toString(),
            categoryName: item.category.name,
            color: item.category.color,
            icon: item.category.icon,
            totalAmount: item.totalAmount,
            percentage: totalIncome > 0 ? Number(((item.totalAmount / totalIncome) * 100).toFixed(1)) : 0,
        }));
        const combinedRecent = [
            ...recentExpenses.map((exp) => ({
                id: exp._id.toString(),
                type: 'EXPENSE',
                title: exp.title,
                amount: exp.amount,
                categoryName: exp.categoryId?.name || 'Uncategorized',
                categoryColor: exp.categoryId?.color || '#EF4444',
                date: exp.date,
            })),
            ...recentIncomes.map((inc) => ({
                id: inc._id.toString(),
                type: 'INCOME',
                title: inc.title,
                amount: inc.amount,
                categoryName: inc.categoryId?.name || 'Uncategorized',
                categoryColor: inc.categoryId?.color || '#10B981',
                date: inc.date,
            })),
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
        const monthlyTrend = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
            const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
            const [incAggr, expAggr] = await Promise.all([
                this.incomeModel.aggregate([
                    { $match: { userId: userObjectId, isDeleted: false, date: { $gte: mStart, $lte: mEnd } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ]),
                this.expenseModel.aggregate([
                    { $match: { userId: userObjectId, date: { $gte: mStart, $lte: mEnd } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ]),
            ]);
            monthlyTrend.push({
                month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
                income: incAggr[0]?.total || 0,
                expense: expAggr[0]?.total || 0,
            });
        }
        return {
            metrics: {
                currentBalance,
                todayExpenses,
                todayIncome,
                monthlyExpense,
                monthlyIncome,
            },
            recentTransactions: combinedRecent,
            expenseByCategory,
            incomeByCategory,
            monthlyTrend,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __param(1, (0, mongoose_1.InjectModel)(income_schema_1.Income.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map