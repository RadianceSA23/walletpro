import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FilterCategoryDto } from '../dto/filter-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create custom category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  create(@Request() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    const userId = req.user?.id || req.user?._id;
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'List all available categories (System + User Custom)',
  })
  @ApiResponse({
    status: 200,
    description: 'Categorized list returned successfully',
  })
  findAll(@Request() req: any, @Query() filterDto: FilterCategoryDto) {
    const userId = req.user?.id || req.user?._id;
    return this.categoriesService.findAll(userId, filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category details returned' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update custom user category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot modify system category' })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const userId = req.user?.id || req.user?._id;
    return this.categoriesService.update(id, userId, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete custom user category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 403, description: 'Cannot delete system category' })
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?._id;
    return this.categoriesService.remove(id, userId);
  }
}
