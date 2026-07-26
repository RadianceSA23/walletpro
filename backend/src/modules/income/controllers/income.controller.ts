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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IncomeService } from '../services/income.service';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { FilterIncomeDto } from '../dto/filter-income.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Income')
@ApiBearerAuth('JWT-auth')
@Controller('incomes')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Log a new income transaction' })
  @ApiResponse({ status: 201, description: 'Income record created' })
  create(@Request() req: any, @Body() createIncomeDto: CreateIncomeDto) {
    const userId = req.user?.id || req.user?._id;
    return this.incomeService.create(userId, createIncomeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List user income records with filtering, search, and pagination' })
  @ApiResponse({ status: 200, description: 'Income records list' })
  findAll(@Request() req: any, @Query() filterDto: FilterIncomeDto) {
    const userId = req.user?.id || req.user?._id;
    return this.incomeService.findAll(userId, filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get single income record details' })
  @ApiResponse({ status: 200, description: 'Income record details' })
  @ApiResponse({ status: 404, description: 'Income record not found' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?._id;
    return this.incomeService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update existing income record' })
  @ApiResponse({ status: 200, description: 'Income updated successfully' })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    const userId = req.user?.id || req.user?._id;
    return this.incomeService.update(id, userId, updateIncomeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete income record' })
  @ApiResponse({ status: 200, description: 'Income record soft deleted successfully' })
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?._id;
    return this.incomeService.remove(id, userId);
  }
}
