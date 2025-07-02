import { Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('list-users')
  async listUsers() {
    return this.appService.getAllUsersDebug();
  }

  @Get('db-info')
  getDbInfo() {
    return {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      DB_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      DB_URL_START: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('create-test-users')
  async createTestUsers() {
    try {
      console.log('🔧 Creating test users directly in production database...');
      
      const bcrypt = require('bcryptjs');
      
      // Eliminar usuarios existentes si existen
      await this.appService.deleteUsersByEmail(['test@render.com', 'user@render.com']);
      
      // Crear password hasheado
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      // Crear usuario admin
      const adminUser = await this.appService.createUser({
        email: 'test@render.com',
        password: hashedPassword,
        name: 'Admin Test Render',
        phone: '+34 999 888 777',
        address: 'Calle Test Render 123',
        role: 'ADMIN',
        isActive: true,
      });
      
      // Crear usuario regular
      const regularUser = await this.appService.createUser({
        email: 'user@render.com',
        password: hashedPassword,
        name: 'Usuario Test Render',
        phone: '+34 888 777 666',
        address: 'Calle Usuario Render 456',
        role: 'USER',
        isActive: true,
      });
      
      return {
        status: 'success',
        message: 'Test users created successfully',
        users: [
          {
            email: 'test@render.com',
            password: 'test123',
            role: 'ADMIN',
            id: adminUser.id
          },
          {
            email: 'user@render.com',
            password: 'test123',
            role: 'USER',
            id: regularUser.id
          }
        ],
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
