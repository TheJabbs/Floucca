//check eza l user aando l required role to access l route
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  import { RoleEnum } from '../enums/role.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // hay eza l route is not role restricted
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      const userRoles = user?.user_role?.map((r) => r.roles.role_name) || [];
  
      const hasRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );
  
      if (!hasRole) {
        throw new ForbiddenException('Access denied: insufficient role');
      }
  
      return true;
    }
  }
  