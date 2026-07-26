import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { IncomeRepository } from '../repositories/income.repository';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { FilterIncomeDto } from '../dto/filter-income.dto';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class IncomeService {
  constructor(
    private readonly incomeRepository: IncomeRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(userId: string, createIncomeDto: CreateIncomeDto) {
    // Validate category existence
    await this.categoriesService.findOne(createIncomeDto.categoryId);

    const userObjectId = new Types.ObjectId(userId);

    return this.incomeRepository.create({
      ...createIncomeDto,
      userId: userObjectId as any,
      categoryId: new Types.ObjectId(createIncomeDto.categoryId) as any,
      createdBy: userObjectId as any,
      updatedBy: userObjectId as any,
    });
  }

  async findAll(userId: string, filterDto: FilterIncomeDto) {
    return this.incomeRepository.findAll(userId, filterDto);
  }

  async findOne(id: string, userId: string) {
    const income = await this.incomeRepository.findById(id, userId);
    if (!income) {
      throw new NotFoundException(`Income record with ID "${id}" not found`);
    }
    return income;
  }

  async update(id: string, userId: string, updateIncomeDto: UpdateIncomeDto) {
    await this.findOne(id, userId);

    if (updateIncomeDto.categoryId) {
      await this.categoriesService.findOne(updateIncomeDto.categoryId);
    }

    const updated = await this.incomeRepository.update(id, userId, {
      ...updateIncomeDto,
      ...(updateIncomeDto.categoryId && {
        categoryId: new Types.ObjectId(updateIncomeDto.categoryId) as any,
      }),
      updatedBy: new Types.ObjectId(userId) as any,
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    const softDeleted = await this.incomeRepository.softDelete(
      id,
      userId,
      userId,
    );
    if (!softDeleted) {
      throw new NotFoundException(
        `Income record with ID "${id}" could not be deleted`,
      );
    }
    return { message: 'Income record soft deleted successfully' };
  }
}
