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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../users/schemas/user.schema");
const category_schema_1 = require("../categories/schemas/category.schema");
const expense_schema_1 = require("../expenses/schemas/expense.schema");
const income_schema_1 = require("../income/schemas/income.schema");
let SeedService = SeedService_1 = class SeedService {
    constructor(userModel, categoryModel, expenseModel, incomeModel) {
        this.userModel = userModel;
        this.categoryModel = categoryModel;
        this.expenseModel = expenseModel;
        this.incomeModel = incomeModel;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onModuleInit() {
        await this.seedDemoData();
    }
    async seedDemoData() {
        try {
            this.logger.log('🌱 Checking enterprise demo data & credentials...');
            const passwordHash = await bcrypt.hash('Password@123', 10);
            let demoUser = await this.userModel.findOne({ email: 'demo@expensetracker.com' }).exec();
            if (!demoUser) {
                demoUser = await this.userModel.create({
                    email: 'demo@expensetracker.com',
                    passwordHash,
                    firstName: 'Demo',
                    lastName: 'User',
                    currency: 'USD',
                });
                this.logger.log('✅ Created Demo User (demo@expensetracker.com)');
            }
            else {
                demoUser.passwordHash = passwordHash;
                await demoUser.save();
                this.logger.log('✅ Updated password for Demo User (demo@expensetracker.com -> Password@123)');
            }
            let adminUser = await this.userModel.findOne({ email: 'admin@expensetracker.com' }).exec();
            if (!adminUser) {
                await this.userModel.create({
                    email: 'admin@expensetracker.com',
                    passwordHash,
                    firstName: 'System',
                    lastName: 'Admin',
                    currency: 'USD',
                });
                this.logger.log('✅ Created Admin User (admin@expensetracker.com)');
            }
            else {
                adminUser.passwordHash = passwordHash;
                await adminUser.save();
            }
            const categoryMap = new Map();
            const requiredCategories = [
                { name: 'Salary', type: category_schema_1.CategoryType.INCOME, color: '#10B981', icon: 'wallet', isSystem: true },
                { name: 'Freelance', type: category_schema_1.CategoryType.INCOME, color: '#3B82F6', icon: 'briefcase', isSystem: true },
                { name: 'Investment', type: category_schema_1.CategoryType.INCOME, color: '#8B5CF6', icon: 'trending-up', isSystem: true },
                { name: 'Bonus', type: category_schema_1.CategoryType.INCOME, color: '#F59E0B', icon: 'gift', isSystem: true },
                { name: 'Housing', type: category_schema_1.CategoryType.EXPENSE, color: '#EF4444', icon: 'home', isSystem: true },
                { name: 'Food', type: category_schema_1.CategoryType.EXPENSE, color: '#F97316', icon: 'utensils', isSystem: true },
                { name: 'Transport', type: category_schema_1.CategoryType.EXPENSE, color: '#06B6D4', icon: 'car', isSystem: true },
                { name: 'Utilities', type: category_schema_1.CategoryType.EXPENSE, color: '#EC4899', icon: 'zap', isSystem: true },
                { name: 'Entertainment', type: category_schema_1.CategoryType.EXPENSE, color: '#84CC16', icon: 'film', isSystem: true },
                { name: 'Shopping', type: category_schema_1.CategoryType.EXPENSE, color: '#D946EF', icon: 'shopping-bag', isSystem: true },
                { name: 'Healthcare', type: category_schema_1.CategoryType.EXPENSE, color: '#14B8A6', icon: 'activity', isSystem: true },
            ];
            for (const cat of requiredCategories) {
                let existing = await this.categoryModel.findOne({ name: cat.name, type: cat.type }).exec();
                if (!existing) {
                    existing = await this.categoryModel.create(cat);
                }
                categoryMap.set(`${cat.type}_${cat.name}`, existing._id);
            }
            const existingIncomeCount = await this.incomeModel.countDocuments({ userId: demoUser._id }).exec();
            if (existingIncomeCount === 0) {
                const now = new Date();
                const incomeDocs = [];
                for (let m = 5; m >= 0; m--) {
                    const salaryDate = new Date(now.getFullYear(), now.getMonth() - m, 1, 9, 0, 0);
                    incomeDocs.push({
                        userId: demoUser._id,
                        categoryId: categoryMap.get('INCOME_Salary'),
                        amount: 5500.00,
                        title: 'Monthly Base Payroll',
                        description: 'Enterprise Tech Corp monthly salary disbursement',
                        date: salaryDate,
                        source: 'Employer Payroll',
                        isDeleted: false,
                        createdBy: demoUser._id,
                        updatedBy: demoUser._id,
                    });
                    const freelanceDate = new Date(now.getFullYear(), now.getMonth() - m, 15, 14, 30, 0);
                    incomeDocs.push({
                        userId: demoUser._id,
                        categoryId: categoryMap.get('INCOME_Freelance'),
                        amount: 1200 + (m * 150),
                        title: 'Consulting Retainer Fee',
                        description: 'Full-stack software architecture consulting',
                        date: freelanceDate,
                        source: 'Acme SaaS Client',
                        isDeleted: false,
                        createdBy: demoUser._id,
                        updatedBy: demoUser._id,
                    });
                    if (m % 2 === 0) {
                        const invDate = new Date(now.getFullYear(), now.getMonth() - m, 20, 11, 0, 0);
                        incomeDocs.push({
                            userId: demoUser._id,
                            categoryId: categoryMap.get('INCOME_Investment'),
                            amount: 450.75,
                            title: 'Quarterly Stock Dividend',
                            description: 'Index fund distribution payout',
                            date: invDate,
                            source: 'Vanguard Brokerage',
                            isDeleted: false,
                            createdBy: demoUser._id,
                            updatedBy: demoUser._id,
                        });
                    }
                }
                incomeDocs.push({
                    userId: demoUser._id,
                    categoryId: categoryMap.get('INCOME_Bonus'),
                    amount: 2500.00,
                    title: 'Q2 Performance Bonus',
                    description: 'Solution Architect milestone completion reward',
                    date: new Date(now.getFullYear(), now.getMonth() - 1, 28, 16, 0, 0),
                    source: 'Corporate Treasury',
                    isDeleted: false,
                    createdBy: demoUser._id,
                    updatedBy: demoUser._id,
                });
                await this.incomeModel.insertMany(incomeDocs);
                this.logger.log(`✅ Seeded ${incomeDocs.length} realistic income records for Demo User.`);
            }
            const existingExpenseCount = await this.expenseModel.countDocuments({ userId: demoUser._id }).exec();
            if (existingExpenseCount === 0) {
                const now = new Date();
                const expenseDocs = [];
                for (let m = 5; m >= 0; m--) {
                    expenseDocs.push({
                        userId: demoUser._id,
                        categoryId: categoryMap.get('EXPENSE_Housing'),
                        amount: 1850.00,
                        title: 'Apartment Monthly Rent',
                        description: 'Downtown luxury apartment lease payment',
                        date: new Date(now.getFullYear(), now.getMonth() - m, 1, 10, 0, 0),
                        paymentMethod: expense_schema_1.PaymentMethod.BANK_TRANSFER,
                    });
                    expenseDocs.push({
                        userId: demoUser._id,
                        categoryId: categoryMap.get('EXPENSE_Utilities'),
                        amount: 210.50 + (m * 10),
                        title: 'Electricity & High-Speed Fiber Internet',
                        description: 'Power grid & 1Gbps fiber broadband bill',
                        date: new Date(now.getFullYear(), now.getMonth() - m, 5, 11, 30, 0),
                        paymentMethod: expense_schema_1.PaymentMethod.CREDIT_CARD,
                    });
                    [4, 11, 18, 25].forEach((day) => {
                        expenseDocs.push({
                            userId: demoUser._id,
                            categoryId: categoryMap.get('EXPENSE_Food'),
                            amount: Number((135 + Math.random() * 45).toFixed(2)),
                            title: 'Weekly Organic Groceries',
                            description: 'Fresh produce & kitchen essentials',
                            date: new Date(now.getFullYear(), now.getMonth() - m, day, 17, 45, 0),
                            paymentMethod: expense_schema_1.PaymentMethod.CREDIT_CARD,
                        });
                    });
                    [7, 14, 22].forEach((day) => {
                        expenseDocs.push({
                            userId: demoUser._id,
                            categoryId: categoryMap.get('EXPENSE_Transport'),
                            amount: Number((45 + Math.random() * 20).toFixed(2)),
                            title: 'Gas Refill & Transit Pass',
                            description: 'Vehicle fuel tank refill',
                            date: new Date(now.getFullYear(), now.getMonth() - m, day, 8, 15, 0),
                            paymentMethod: expense_schema_1.PaymentMethod.DEBIT_CARD,
                        });
                    });
                    [12, 26].forEach((day) => {
                        expenseDocs.push({
                            userId: demoUser._id,
                            categoryId: categoryMap.get('EXPENSE_Entertainment'),
                            amount: Number((80 + Math.random() * 60).toFixed(2)),
                            title: 'Weekend Dinner & Movies',
                            description: 'Restaurant dinner & cinema ticket',
                            date: new Date(now.getFullYear(), now.getMonth() - m, day, 20, 0, 0),
                            paymentMethod: expense_schema_1.PaymentMethod.CREDIT_CARD,
                        });
                    });
                    expenseDocs.push({
                        userId: demoUser._id,
                        categoryId: categoryMap.get('EXPENSE_Shopping'),
                        amount: Number((120 + Math.random() * 150).toFixed(2)),
                        title: 'Apparel & Tech Accessories',
                        description: 'Online store clothing & hardware accessories',
                        date: new Date(now.getFullYear(), now.getMonth() - m, 19, 15, 20, 0),
                        paymentMethod: expense_schema_1.PaymentMethod.CREDIT_CARD,
                    });
                    expenseDocs.push({
                        userId: demoUser._id,
                        categoryId: categoryMap.get('EXPENSE_Healthcare'),
                        amount: Number((60 + Math.random() * 40).toFixed(2)),
                        title: 'Health Insurance Copay & Pharmacy',
                        description: 'Wellness checkup and vitamins',
                        date: new Date(now.getFullYear(), now.getMonth() - m, 24, 14, 0, 0),
                        paymentMethod: expense_schema_1.PaymentMethod.CREDIT_CARD,
                    });
                }
                expenseDocs.push({
                    userId: demoUser._id,
                    categoryId: categoryMap.get('EXPENSE_Food'),
                    amount: 42.50,
                    title: 'Lunch Meeting with Engineering Team',
                    description: 'Team sync lunch',
                    date: new Date(),
                    paymentMethod: expense_schema_1.PaymentMethod.CREDIT_CARD,
                });
                await this.expenseModel.insertMany(expenseDocs);
                this.logger.log(`✅ Seeded ${expenseDocs.length} realistic expense records for Demo User.`);
            }
            this.logger.log('🎉 Enterprise Demo Credentials & Dataset ready!');
        }
        catch (error) {
            this.logger.error('❌ Error during demo data seeding:', error);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(2, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __param(3, (0, mongoose_1.InjectModel)(income_schema_1.Income.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map