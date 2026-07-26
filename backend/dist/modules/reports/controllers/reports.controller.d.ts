import { Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { ReportQueryDto } from '../dto/report-query.dto';
import { MonthlyReportSummaryDto, YearlyReportSummaryDto, TopCategoryReportItemDto } from '../dto/report-response.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getMonthlyReport(req: any, query: ReportQueryDto): Promise<MonthlyReportSummaryDto>;
    getYearlyReport(req: any, query: ReportQueryDto): Promise<YearlyReportSummaryDto>;
    getTopSpending(req: any, query: ReportQueryDto): Promise<TopCategoryReportItemDto[]>;
    exportCSV(req: any, type: 'expenses' | 'income', year: number, month: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
