import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Category, CategoryDocument, CategoryType } from '../categories/schemas/category.schema';
import { Expense, ExpenseDocument, PaymentMethod } from '../expenses/schemas/expense.schema';
import { Income, IncomeDocument } from '../income/schemas/income.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Expense.name) private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(Income.name) private readonly incomeModel: Model<IncomeDocument>,
  ) {}

  async onModuleInit() {
    await this.seedDemoData();
  }

  async seedDemoData() {
    try {
      this.logger.log('🌱 Checking enterprise demo data & credentials...');

      // 1. Hash default password
      const passwordHash = await bcrypt.hash('Password@123', 10);

      // Upsert Demo & Admin Users
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
      } else {
        // Ensure password is always Password@123
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
      } else {
        adminUser.passwordHash = passwordHash;
        await adminUser.save();
      }

      // 2. Ensure Categories exist
      const categoryMap = new Map<string, Types.ObjectId>();

      const requiredCategories = [
        { name: 'Salary', type: CategoryType.INCOME, color: '#10B981', icon: 'wallet', isSystem: true },
        { name: 'Freelance', type: CategoryType.INCOME, color: '#3B82F6', icon: 'briefcase', isSystem: true },
        { name: 'Investment', type: CategoryType.INCOME, color: '#8B5CF6', icon: 'trending-up', isSystem: true },
        { name: 'Bonus', type: CategoryType.INCOME, color: '#F59E0B', icon: 'gift', isSystem: true },

        { name: 'Housing', type: CategoryType.EXPENSE, color: '#EF4444', icon: 'home', isSystem: true },
        { name: 'Food', type: CategoryType.EXPENSE, color: '#F97316', icon: 'utensils', isSystem: true },
        { name: 'Transport', type: CategoryType.EXPENSE, color: '#06B6D4', icon: 'car', isSystem: true },
        { name: 'Utilities', type: CategoryType.EXPENSE, color: '#EC4899', icon: 'zap', isSystem: true },
        { name: 'Entertainment', type: CategoryType.EXPENSE, color: '#84CC16', icon: 'film', isSystem: true },
        { name: 'Shopping', type: CategoryType.EXPENSE, color: '#D946EF', icon: 'shopping-bag', isSystem: true },
        { name: 'Healthcare', type: CategoryType.EXPENSE, color: '#14B8A6', icon: 'activity', isSystem: true },
      ];

      for (const cat of requiredCategories) {
        let existing = await this.categoryModel.findOne({ name: cat.name, type: cat.type }).exec();
        if (!existing) {
          existing = await this.categoryModel.create(cat);
        }
        categoryMap.set(`${cat.type}_${cat.name}`, existing._id as Types.ObjectId);
      }

      // 3. Seed Income Records if demo user has none
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

      // 4. Seed Expense Records if demo user has none
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
            paymentMethod: PaymentMethod.BANK_TRANSFER,
          });

          expenseDocs.push({
            userId: demoUser._id,
            categoryId: categoryMap.get('EXPENSE_Utilities'),
            amount: 210.50 + (m * 10),
            title: 'Electricity & High-Speed Fiber Internet',
            description: 'Power grid & 1Gbps fiber broadband bill',
            date: new Date(now.getFullYear(), now.getMonth() - m, 5, 11, 30, 0),
            paymentMethod: PaymentMethod.CREDIT_CARD,
          });

          [4, 11, 18, 25].forEach((day) => {
            expenseDocs.push({
              userId: demoUser._id,
              categoryId: categoryMap.get('EXPENSE_Food'),
              amount: Number((135 + Math.random() * 45).toFixed(2)),
              title: 'Weekly Organic Groceries',
              description: 'Fresh produce & kitchen essentials',
              date: new Date(now.getFullYear(), now.getMonth() - m, day, 17, 45, 0),
              paymentMethod: PaymentMethod.CREDIT_CARD,
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
              paymentMethod: PaymentMethod.DEBIT_CARD,
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
              paymentMethod: PaymentMethod.CREDIT_CARD,
            });
          });

          expenseDocs.push({
            userId: demoUser._id,
            categoryId: categoryMap.get('EXPENSE_Shopping'),
            amount: Number((120 + Math.random() * 150).toFixed(2)),
            title: 'Apparel & Tech Accessories',
            description: 'Online store clothing & hardware accessories',
            date: new Date(now.getFullYear(), now.getMonth() - m, 19, 15, 20, 0),
            paymentMethod: PaymentMethod.CREDIT_CARD,
          });

          expenseDocs.push({
            userId: demoUser._id,
            categoryId: categoryMap.get('EXPENSE_Healthcare'),
            amount: Number((60 + Math.random() * 40).toFixed(2)),
            title: 'Health Insurance Copay & Pharmacy',
            description: 'Wellness checkup and vitamins',
            date: new Date(now.getFullYear(), now.getMonth() - m, 24, 14, 0, 0),
            paymentMethod: PaymentMethod.CREDIT_CARD,
          });
        }

        expenseDocs.push({
          userId: demoUser._id,
          categoryId: categoryMap.get('EXPENSE_Food'),
          amount: 42.50,
          title: 'Lunch Meeting with Engineering Team',
          description: 'Team sync lunch',
          date: new Date(),
          paymentMethod: PaymentMethod.CREDIT_CARD,
        });

        await this.expenseModel.insertMany(expenseDocs);
        this.logger.log(`✅ Seeded ${expenseDocs.length} realistic expense records for Demo User.`);
      }

      this.logger.log('🎉 Enterprise Demo Credentials & Dataset ready!');
    } catch (error) {
      this.logger.error('❌ Error during demo data seeding:', error);
    }
  }
}
