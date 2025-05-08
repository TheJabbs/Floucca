import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { user_id: number }) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: payload.user_id },
      select: {
        user_id: true,
        user_fname: true,
        user_lname: true,
        user_email: true,
        user_role: {
          select: {
            roles: {
              select: {
                role_name: true,
              }
            }
          }
        },
      },
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
  
    return user;
  }
  
}
