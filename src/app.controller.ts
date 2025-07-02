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

  @Get('jwt-test')
  async jwtTest() {
    try {
      // Verificar variables de entorno
      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
      
      return {
        status: 'success',
        message: 'JWT environment check',
        jwtSecretExists: !!jwtSecret,
        jwtSecretLength: jwtSecret ? jwtSecret.length : 0,
        jwtExpiresIn: jwtExpiresIn || 'not set',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        error: error.stack,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
