import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('test-user/:email')
  async testUser(@Param('email') email: string) {
    try {
      const user = await this.authService.testUserCredentials(email);
      return {
        status: 'success',
        userExists: !!user,
        email: user?.email,
        role: user?.role,
        isActive: user?.isActive,
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

  @Post('debug-login')
  async debugLogin(@Body() loginDto: any) {
    try {
      console.log('Debug login attempt:', loginDto);

      // Verificar si el usuario existe
      const user = await this.authService.testUserCredentials(loginDto.email);
      if (!user) {
        return {
          status: 'error',
          step: 'user_not_found',
          email: loginDto.email,
          message: 'Usuario no encontrado',
        };
      }

      // Verificar password
      const bcrypt = require('bcryptjs');
      const validPassword = await bcrypt.compare(loginDto.password, user.password);
      if (!validPassword) {
        return {
          status: 'error',
          step: 'invalid_password',
          message: 'Contraseña incorrecta',
        };
      }

      return {
        status: 'success',
        step: 'credentials_valid',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        step: 'exception',
        message: error.message,
        stack: error.stack,
      };
    }
  }
}
