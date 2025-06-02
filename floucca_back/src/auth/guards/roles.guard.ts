import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from '../enums/role.enum';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
      private reflector: Reflector,
      private jwtStrategy: JwtStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    const user = await this.jwtStrategy.decodeAndValidateToken(token);

    // Extract roles safely from user.user_role or fallback to user.roles (from JWT)
    const userRoles =
        user?.user_role?.map((r) => r.roles?.role_name).filter(Boolean) ??
        user?.roles ??
        [];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    console.log('User roles:', userRoles);

    if (!hasRole) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    // Optional: attach user to request for downstream access
    request.user = user;

    return true;
  }
}
