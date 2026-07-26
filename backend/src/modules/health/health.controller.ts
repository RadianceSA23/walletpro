import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Check API and Database Health Status' })
  @ApiResponse({ status: 200, description: 'Health status response' })
  checkHealth() {
    const isDbConnected = this.connection.readyState === 1;

    return {
      status: isDbConnected ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: isDbConnected ? 'connected' : 'disconnected',
          readyState: this.connection.readyState,
        },
      },
    };
  }
}
