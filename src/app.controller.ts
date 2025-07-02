import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('user-check/:email')
  async getUserCheck(@Param('email') email: string) {
    try {
      const user = await this.appService.checkUserByEmail(email);
      return {
        status: 'success',
        userExists: !!user,
        userEmail: user?.email,
        userRole: user?.role,
        userActive: user?.isActive,
        hasPassword: !!user?.password,
        passwordLength: user?.password?.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('users-debug')
  async debugUsers() {
    try {
      const users = await this.appService.getAllUsersDebug();
      return {
        status: 'success',
        totalUsers: users.length,
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          role: u.role,
          isActive: u.isActive,
          name: u.name
        })),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
