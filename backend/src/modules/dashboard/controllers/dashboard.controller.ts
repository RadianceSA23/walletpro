import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from '../services/dashboard.service';
import { DashboardSummaryResponseDto } from '../dto/dashboard-summary.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  @ApiOperation({
    summary: 'Get optimized dashboard metrics, breakdown, and trend analytics',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics returned successfully',
    type: DashboardSummaryResponseDto,
  })
  getSummary(@Request() req: any): Promise<DashboardSummaryResponseDto> {
    const userId = req.user?.id || req.user?._id;
    return this.dashboardService.getSummary(userId);
  }
}
