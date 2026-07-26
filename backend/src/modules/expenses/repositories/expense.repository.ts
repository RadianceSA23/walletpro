import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from '../schemas/expense.schema';
import { FilterExpenseDto } from '../dto/filter-expense.dto';

export interface IExpenseRepository {
  create(expenseData: Partial<Expense>): Promise<ExpenseDocument>;
  findAll(
    userId: string,
    filterDto: FilterExpenseDto,
  ): Promise<{
    expenses: ExpenseDocument[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string, userId: string): Promise<ExpenseDocument | null>;
  update(
    id: string,
    userId: string,
    updateData: Partial<Expense>,
  ): Promise<ExpenseDocument | null>;
  delete(id: string, userId: string): Promise<boolean>;
}

@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(expenseData: Partial<Expense>): Promise<ExpenseDocument> {
    const expense = new this.expenseModel(expenseData);
    return (await expense.save()).populate(
      'categoryId',
      'name color icon type',
    );
  }

  async findAll(
    userId: string,
    filterDto: FilterExpenseDto,
  ): Promise<{
    expenses: ExpenseDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      categoryId,
      search,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filterDto;

    const query: any = { userId: new Types.ObjectId(userId) };

    if (categoryId) {
      query.categoryId = new Types.ObjectId(categoryId);
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
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) query.amount.$gte = minAmount;
      if (maxAmount !== undefined) query.amount.$lte = maxAmount;
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

  async findById(id: string, userId: string): Promise<ExpenseDocument | null> {
    return this.expenseModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .populate('categoryId', 'name color icon type')
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<Expense>,
  ): Promise<ExpenseDocument | null> {
    return this.expenseModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .populate('categoryId', 'name color icon type')
      .exec();
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.expenseModel
      .deleteOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    return result.deletedCount > 0;
  }
}
