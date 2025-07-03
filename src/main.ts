import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configurar CORS para el frontend
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://10.0.2.2:3000',      // Emulador Android
      'http://127.0.0.1:3000',
      'http://192.168.1.4:3000',   // Dispositivo físico en red local
      /^https:\/\/.*\.render\.com$/, // Cualquier dominio de Render
      '*', // Permitir todos los orígenes para la app móvil
    ],
    credentials: true,
  });

  // Configurar prefijo global para las rutas de la API
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${port}/api - JWT Fixed v2`);
}
bootstrap();
