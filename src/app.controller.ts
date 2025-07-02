import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): any {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running'
    };
  }

  @Get('db-status')
  async getDatabaseStatus(): Promise<any> {
    return this.appService.checkDatabaseConnection();
  }

  @Get('env-check')
  getEnvCheck() {
    return {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET (' + process.env.JWT_SECRET.length + ' chars)' : 'NOT SET',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      PORT: process.env.PORT || 'NOT SET',
      timestamp: new Date().toISOString(),
    };
  }
}
