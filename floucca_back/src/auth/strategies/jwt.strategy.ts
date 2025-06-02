// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private prisma: PrismaService,
      private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ Use ONLY this line
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {

    const user = await this.prisma.users.findUnique({
      where: { user_id: payload.user_id },
      include: {
        user_role: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    console.log('JWT Strategy - User found:', user);

    return {
      ...user,
      roles: payload.roles, // Include roles from JWT payload for easier access
    };
  }

  async decodeAndValidateToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = jwt.verify(token, secret);
      return this.validate(payload);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}