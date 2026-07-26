import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from '../../expenses/schemas/expense.schema';
import { Income, IncomeDocument } from '../../income/schemas/income.schema';
import { MonthlyReportSummaryDto, YearlyReportSummaryDto, TopCategoryReportItemDto } from '../dto/report-response.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(Income.name)
    private readonly incomeModel: Model<IncomeDocument>,
  ) {}

  async getMonthlyReport(userId: string, year: number, month: number): Promise<MonthlyReportSummaryDto> {
    const userObjectId = new Types.ObjectId(userId);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [incomeRes, expenseRes, topCategories] = await Promise.all([
      this.incomeModel.aggregate([
        { $match: { userId: userObjectId, isDeleted: false, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.expenseModel.aggregate([
        { $match: { userId: userObjectId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.getTopSpendingCategories(userId, year, month, 5),
    ]);

    const totalIncome = incomeRes[0]?.total || 0;
    const totalExpense = expenseRes[0]?.total || 0;
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0;

    return {
      year,
      month,
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      topSpendingCategories: topCategories,
    };
  }

  async getYearlyReport(userId: string, year: number): Promise<YearlyReportSummaryDto> {
    const userObjectId = new Types.ObjectId(userId);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyBreakdown = [];

    let annualIncome = 0;
    let annualExpense = 0;

    for (let m = 0; m < 12; m++) {
      const mStart = new Date(year, m, 1);
      const mEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);

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

      const inc = incAggr[0]?.total || 0;
      const exp = expAggr[0]?.total || 0;
      const sav = inc - exp;

      annualIncome += inc;
      annualExpense += exp;

      monthlyBreakdown.push({
        month: monthNames[m],
        income: inc,
        expense: exp,
        savings: sav,
      });
    }

    return {
      year,
      totalIncome: annualIncome,
      totalExpense: annualExpense,
      netSavings: annualIncome - annualExpense,
      monthlyBreakdown,
    };
  }

  async getTopSpendingCategories(
    userId: string,
    year: number,
    month?: number,
    limit: number = 5,
  ): Promise<TopCategoryReportItemDto[]> {
    const userObjectId = new Types.ObjectId(userId);
    const matchQuery: any = { userId: userObjectId };

    if (month) {
      matchQuery.date = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0, 23, 59, 59, 999),
      };
    } else {
      matchQuery.date = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59, 999),
      };
    }

    const [totalExpenseAggr, aggr] = await Promise.all([
      this.expenseModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.expenseModel.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$categoryId',
            totalAmount: { $sum: '$amount' },
            transactionCount: { $sum: 1 },
          },
        },
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
        { $limit: limit },
      ]),
    ]);

    const totalSpent = totalExpenseAggr[0]?.total || 0;

    return aggr.map((item) => ({
      categoryName: item.category.name,
      color: item.category.color,
      icon: item.category.icon,
      totalAmount: item.totalAmount,
      transactionCount: item.transactionCount,
      percentage: totalSpent > 0 ? Number(((item.totalAmount / totalSpent) * 100).toFixed(1)) : 0,
    }));
  }

  async generateCSV(userId: string, type: 'expenses' | 'income', year: number, month?: number): Promise<string> {
    const userObjectId = new Types.ObjectId(userId);
    const matchQuery: any = { userId: userObjectId };

    if (month) {
      matchQuery.date = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0, 23, 59, 59, 999),
      };
    }

    if (type === 'expenses') {
      const expenses = await this.expenseModel
        .find(matchQuery)
        .populate('categoryId', 'name')
        .sort({ date: -1 })
        .exec();

      let csv = 'ID,Date,Title,Category,Payment Method,Amount,Description\n';
      expenses.forEach((exp: any) => {
        const catName = exp.categoryId?.name || 'Uncategorized';
        const dateStr = new Date(exp.date).toISOString().split('T')[0];
        const desc = (exp.description || '').replace(/"/g, '""');
        csv += `"${exp._id}","${dateStr}","${exp.title}","${catName}","${exp.paymentMethod}",${exp.amount},"${desc}"\n`;
      });
      return csv;
    } else {
      matchQuery.isDeleted = false;
      const incomes = await this.incomeModel
        .find(matchQuery)
        .populate('categoryId', 'name')
        .sort({ date: -1 })
        .exec();

      let csv = 'ID,Date,Title,Category,Source,Amount,Description\n';
      incomes.forEach((inc: any) => {
        const catName = inc.categoryId?.name || 'Uncategorized';
        const dateStr = new Date(inc.date).toISOString().split('T')[0];
        const desc = (inc.description || '').replace(/"/g, '""');
        csv += `"${inc._id}","${dateStr}","${inc.title}","${catName}","${inc.source}",${inc.amount},"${desc}"\n`;
      });
      return csv;
    }
  }
}
