import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Expense,
  ExpenseDocument,
} from '../../expenses/schemas/expense.schema';
import { Income, IncomeDocument } from '../../income/schemas/income.schema';
import { DashboardSummaryResponseDto } from '../dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(Income.name)
    private readonly incomeModel: Model<IncomeDocument>,
  ) {}

  async getSummary(userId: string): Promise<DashboardSummaryResponseDto> {
    const userObjectId = new Types.ObjectId(userId);

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Parallel aggregation execution
    const [
      totalIncomeRes,
      totalExpenseRes,
      todayIncomeRes,
      todayExpenseRes,
      monthIncomeRes,
      monthExpenseRes,
      expenseByCategoryRes,
      incomeByCategoryRes,
      recentExpenses,
      recentIncomes,
    ] = await Promise.all([
      // Total Income
      this.incomeModel.aggregate([
        { $match: { userId: userObjectId, isDeleted: false } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Total Expense
      this.expenseModel.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Today Income
      this.incomeModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            isDeleted: false,
            date: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Today Expense
      this.expenseModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Monthly Income
      this.incomeModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            isDeleted: false,
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Monthly Expense
      this.expenseModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Expense By Category Aggregation
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
      // Income By Category Aggregation
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
      // Recent Expenses
      this.expenseModel
        .find({ userId: userObjectId })
        .populate('categoryId', 'name color icon')
        .sort({ date: -1 })
        .limit(5)
        .exec(),
      // Recent Incomes
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

    // Map Category Breakdown Percentages
    const expenseByCategory = expenseByCategoryRes.map((item) => ({
      categoryId: item._id.toString(),
      categoryName: item.category.name,
      color: item.category.color,
      icon: item.category.icon,
      totalAmount: item.totalAmount,
      percentage:
        totalExpense > 0
          ? Number(((item.totalAmount / totalExpense) * 100).toFixed(1))
          : 0,
    }));

    const incomeByCategory = incomeByCategoryRes.map((item) => ({
      categoryId: item._id.toString(),
      categoryName: item.category.name,
      color: item.category.color,
      icon: item.category.icon,
      totalAmount: item.totalAmount,
      percentage:
        totalIncome > 0
          ? Number(((item.totalAmount / totalIncome) * 100).toFixed(1))
          : 0,
    }));

    // Combine and sort recent transactions
    const combinedRecent = [
      ...recentExpenses.map((exp: any) => ({
        id: exp._id.toString(),
        type: 'EXPENSE' as const,
        title: exp.title,
        amount: exp.amount,
        categoryName: exp.categoryId?.name || 'Uncategorized',
        categoryColor: exp.categoryId?.color || '#EF4444',
        date: exp.date,
      })),
      ...recentIncomes.map((inc: any) => ({
        id: inc._id.toString(),
        type: 'INCOME' as const,
        title: inc.title,
        amount: inc.amount,
        categoryName: inc.categoryId?.name || 'Uncategorized',
        categoryColor: inc.categoryId?.color || '#10B981',
        date: inc.date,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Calculate Monthly Trend for last 6 months
    const monthlyTrend = [];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const [incAggr, expAggr] = await Promise.all([
        this.incomeModel.aggregate([
          {
            $match: {
              userId: userObjectId,
              isDeleted: false,
              date: { $gte: mStart, $lte: mEnd },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        this.expenseModel.aggregate([
          {
            $match: {
              userId: userObjectId,
              date: { $gte: mStart, $lte: mEnd },
            },
          },
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
}
