import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ultra-secret-jwt-key-for-production-render-app-2025',
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.userId, 
      email: payload.email, 
      role: payload.role 
    };
  }
}
