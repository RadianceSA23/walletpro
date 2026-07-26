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
import { ExpensesService } from '../services/expenses.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { FilterExpenseDto } from '../dto/filter-expense.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Expenses')
@ApiBearerAuth('JWT-auth')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Log a new expense' })
  @ApiResponse({ status: 201, description: 'Expense record created' })
  create(@Request() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    const userId = req.user?.id || req.user?._id;
    return this.expensesService.create(userId, createExpenseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List user expenses with filtering, search, and pagination' })
  @ApiResponse({ status: 200, description: 'Expense records list' })
  findAll(@Request() req: any, @Query() filterDto: FilterExpenseDto) {
    const userId = req.user?.id || req.user?._id;
    return this.expensesService.findAll(userId, filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get single expense details' })
  @ApiResponse({ status: 200, description: 'Expense record details' })
  @ApiResponse({ status: 404, description: 'Expense record not found' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?._id;
    return this.expensesService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update existing expense record' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const userId = req.user?.id || req.user?._id;
    return this.expensesService.update(id, userId, updateExpenseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense record' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?._id;
    return this.expensesService.remove(id, userId);
  }
}
