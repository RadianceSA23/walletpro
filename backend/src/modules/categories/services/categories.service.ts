import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FilterCategoryDto } from '../dto/filter-category.dto';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async onModuleInit() {
    await this.categoryRepository.seedSystemDefaults();
  }

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create({
      ...createCategoryDto,
      userId: userId as any,
      isSystem: false,
    });
  }

  async findAll(userId: string, filterDto: FilterCategoryDto) {
    return this.categoryRepository.findAll(userId, filterDto);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (category.isSystem) {
      throw new ForbiddenException('System categories cannot be modified');
    }

    if (category.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to modify this category');
    }

    const updatedCategory = await this.categoryRepository.update(id, userId, updateCategoryDto);
    return updatedCategory;
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id);

    if (category.isSystem) {
      throw new ForbiddenException('System categories cannot be deleted');
    }

    if (category.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this category');
    }

    const deleted = await this.categoryRepository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundException(`Category with ID "${id}" could not be deleted`);
    }

    return { message: 'Category deleted successfully' };
  }
}
