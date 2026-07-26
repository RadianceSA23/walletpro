import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Income, IncomeDocument } from '../schemas/income.schema';
import { FilterIncomeDto } from '../dto/filter-income.dto';

export interface IIncomeRepository {
  create(incomeData: Partial<Income>): Promise<IncomeDocument>;
  findAll(
    userId: string,
    filterDto: FilterIncomeDto,
  ): Promise<{
    incomes: IncomeDocument[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string, userId: string): Promise<IncomeDocument | null>;
  update(
    id: string,
    userId: string,
    updateData: Partial<Income>,
  ): Promise<IncomeDocument | null>;
  softDelete(id: string, userId: string, updatedBy: string): Promise<boolean>;
}

@Injectable()
export class IncomeRepository implements IIncomeRepository {
  constructor(
    @InjectModel(Income.name)
    private readonly incomeModel: Model<IncomeDocument>,
  ) {}

  async create(incomeData: Partial<Income>): Promise<IncomeDocument> {
    const income = new this.incomeModel({ ...incomeData, isDeleted: false });
    return (await income.save()).populate('categoryId', 'name color icon type');
  }

  async findAll(
    userId: string,
    filterDto: FilterIncomeDto,
  ): Promise<{
    incomes: IncomeDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      categoryId,
      search,
      source,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filterDto;

    const query: any = {
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (categoryId) {
      query.categoryId = new Types.ObjectId(categoryId);
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
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
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

  async findById(id: string, userId: string): Promise<IncomeDocument | null> {
    return this.incomeModel
      .findOne({
        _id: id,
        userId: new Types.ObjectId(userId),
        isDeleted: false,
      })
      .populate('categoryId', 'name color icon type')
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<Income>,
  ): Promise<IncomeDocument | null> {
    return this.incomeModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId), isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .populate('categoryId', 'name color icon type')
      .exec();
  }

  async softDelete(
    id: string,
    userId: string,
    updatedBy: string,
  ): Promise<boolean> {
    const result = await this.incomeModel
      .updateOne(
        { _id: id, userId: new Types.ObjectId(userId), isDeleted: false },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: new Types.ObjectId(updatedBy),
          },
        },
      )
      .exec();

    return result.modifiedCount > 0;
  }
}
