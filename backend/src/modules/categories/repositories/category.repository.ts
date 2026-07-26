import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Category,
  CategoryDocument,
  CategoryType,
} from '../schemas/category.schema';
import { FilterCategoryDto } from '../dto/filter-category.dto';

export interface ICategoryRepository {
  create(categoryData: Partial<Category>): Promise<CategoryDocument>;
  findAll(
    userId: string,
    filterDto: FilterCategoryDto,
  ): Promise<{
    categories: CategoryDocument[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<CategoryDocument | null>;
  update(
    id: string,
    userId: string,
    updateData: Partial<Category>,
  ): Promise<CategoryDocument | null>;
  delete(id: string, userId: string): Promise<boolean>;
  seedSystemDefaults(): Promise<void>;
}

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(categoryData: Partial<Category>): Promise<CategoryDocument> {
    const category = new this.categoryModel(categoryData);
    return category.save();
  }

  async findAll(
    userId: string,
    filterDto: FilterCategoryDto,
  ): Promise<{
    categories: CategoryDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { type, search, page = 1, limit = 20 } = filterDto;

    // Fetch categories belonging to the user OR system categories
    const query: any = {
      $or: [{ userId: new Types.ObjectId(userId) }, { isSystem: true }],
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

  async findById(id: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<Category>,
  ): Promise<CategoryDocument | null> {
    return this.categoryModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId), isSystem: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.categoryModel
      .deleteOne({
        _id: id,
        userId: new Types.ObjectId(userId),
        isSystem: false,
      })
      .exec();
    return result.deletedCount > 0;
  }

  async seedSystemDefaults(): Promise<void> {
    const count = await this.categoryModel
      .countDocuments({ isSystem: true })
      .exec();
    if (count > 0) return;

    const defaultCategories: Partial<Category>[] = [
      // Income Categories
      {
        name: 'Salary',
        type: CategoryType.INCOME,
        color: '#10B981',
        icon: 'wallet',
        isSystem: true,
      },
      {
        name: 'Freelance & Business',
        type: CategoryType.INCOME,
        color: '#3B82F6',
        icon: 'briefcase',
        isSystem: true,
      },
      {
        name: 'Investments',
        type: CategoryType.INCOME,
        color: '#8B5CF6',
        icon: 'trending-up',
        isSystem: true,
      },
      {
        name: 'Other Income',
        type: CategoryType.INCOME,
        color: '#6B7280',
        icon: 'plus-circle',
        isSystem: true,
      },

      // Expense Categories
      {
        name: 'Housing & Rent',
        type: CategoryType.EXPENSE,
        color: '#EF4444',
        icon: 'home',
        isSystem: true,
      },
      {
        name: 'Food & Dining',
        type: CategoryType.EXPENSE,
        color: '#F59E0B',
        icon: 'utensils',
        isSystem: true,
      },
      {
        name: 'Transportation',
        type: CategoryType.EXPENSE,
        color: '#06B6D4',
        icon: 'car',
        isSystem: true,
      },
      {
        name: 'Utilities & Bills',
        type: CategoryType.EXPENSE,
        color: '#EC4899',
        icon: 'zap',
        isSystem: true,
      },
      {
        name: 'Entertainment',
        type: CategoryType.EXPENSE,
        color: '#84CC16',
        icon: 'film',
        isSystem: true,
      },
      {
        name: 'Shopping',
        type: CategoryType.EXPENSE,
        color: '#D946EF',
        icon: 'shopping-bag',
        isSystem: true,
      },
    ];

    await this.categoryModel.insertMany(defaultCategories);
  }
}
