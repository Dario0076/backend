import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    console.log('🔧 AuthService initialized');
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const payload = { userId: user.id, email: user.email, role: user.role };
    
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    console.log('🔐 Login attempt for:', loginDto.email);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      console.log('❌ Login failed: Invalid credentials for', loginDto.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('✅ User validated successfully:', user.email, 'Role:', user.role);
    const payload = { userId: user.id, email: user.email, role: user.role };
    
    console.log('🎫 Generating JWT token for payload:', payload);
    
    try {
      const token = this.jwtService.sign(payload);
      console.log('✅ JWT token generated successfully, length:', token.length);
      
      const response = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        access_token: token,
      };
      
      console.log('📤 Sending response with user:', response.user.email, 'role:', response.user.role);
      return response;
      
    } catch (jwtError) {
      console.error('❌ JWT Generation Error:', jwtError.message);
      throw new Error('Error generating JWT token');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.isActive && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async testUserCredentials(email: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Error checking user: ${error.message}`);
    }
  }
}
