import { DashboardService } from '../services/dashboard.service';
import { DashboardSummaryResponseDto } from '../dto/dashboard-summary.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(req: any): Promise<DashboardSummaryResponseDto>;
}
