import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseConnection(): Promise<any> {
    try {
      // Intentar una consulta simple para verificar conexión
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Intentar contar usuarios
      const userCount = await this.prisma.user.count();
      
      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Database connection successful',
        userCount: userCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database connection failed',
        error: error.message,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      };
    }
  }

  async checkUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });
      return user;
    } catch (error) {
      throw new Error(`Error checking user: ${error.message}`);
    }
  }
}
