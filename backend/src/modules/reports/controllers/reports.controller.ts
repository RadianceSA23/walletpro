import { Controller, Get, Query, UseGuards, Request, Res, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { ReportQueryDto } from '../dto/report-query.dto';
import { MonthlyReportSummaryDto, YearlyReportSummaryDto, TopCategoryReportItemDto } from '../dto/report-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly financial summary report' })
  @ApiResponse({ status: 200, type: MonthlyReportSummaryDto })
  getMonthlyReport(@Request() req: any, @Query() query: ReportQueryDto): Promise<MonthlyReportSummaryDto> {
    const userId = req.user?.id || req.user?._id;
    return this.reportsService.getMonthlyReport(userId, query.year, query.month);
  }

  @UseGuards(JwtAuthGuard)
  @Get('yearly')
  @ApiOperation({ summary: 'Get yearly financial breakdown report' })
  @ApiResponse({ status: 200, type: YearlyReportSummaryDto })
  getYearlyReport(@Request() req: any, @Query() query: ReportQueryDto): Promise<YearlyReportSummaryDto> {
    const userId = req.user?.id || req.user?._id;
    return this.reportsService.getYearlyReport(userId, query.year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-spending')
  @ApiOperation({ summary: 'Get top spending categories breakdown' })
  @ApiResponse({ status: 200, type: [TopCategoryReportItemDto] })
  getTopSpending(@Request() req: any, @Query() query: ReportQueryDto): Promise<TopCategoryReportItemDto[]> {
    const userId = req.user?.id || req.user?._id;
    return this.reportsService.getTopSpendingCategories(userId, query.year, query.month, 5);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export/csv')
  @ApiOperation({ summary: 'Export financial records as downloadable CSV spreadsheet' })
  @ApiQuery({ name: 'type', enum: ['expenses', 'income'], required: true })
  @Header('Content-Type', 'text/csv')
  async exportCSV(
    @Request() req: any,
    @Query('type') type: 'expenses' | 'income',
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: Response,
  ) {
    const userId = req.user?.id || req.user?._id;
    const csvData = await this.reportsService.generateCSV(userId, type || 'expenses', year || 2026, month);

    res.attachment(`${type || 'expenses'}-report-${year || 2026}${month ? '-' + month : ''}.csv`);
    return res.send(csvData);
  }
}
