import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { FilterExpenseDto } from '../dto/filter-expense.dto';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    // Validate category existence
    await this.categoriesService.findOne(createExpenseDto.categoryId);

    return this.expenseRepository.create({
      ...createExpenseDto,
      userId: new Types.ObjectId(userId) as any,
      categoryId: new Types.ObjectId(createExpenseDto.categoryId) as any,
    });
  }

  async findAll(userId: string, filterDto: FilterExpenseDto) {
    return this.expenseRepository.findAll(userId, filterDto);
  }

  async findOne(id: string, userId: string) {
    const expense = await this.expenseRepository.findById(id, userId);
    if (!expense) {
      throw new NotFoundException(`Expense with ID "${id}" not found`);
    }
    return expense;
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id, userId);

    if (updateExpenseDto.categoryId) {
      await this.categoriesService.findOne(updateExpenseDto.categoryId);
    }

    const updated = await this.expenseRepository.update(id, userId, {
      ...updateExpenseDto,
      ...(updateExpenseDto.categoryId && {
        categoryId: new Types.ObjectId(updateExpenseDto.categoryId) as any,
      }),
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    const deleted = await this.expenseRepository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundException(`Expense with ID "${id}" could not be deleted`);
    }
    return { message: 'Expense record deleted successfully' };
  }
}
