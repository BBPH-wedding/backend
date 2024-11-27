import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    const user = req.reservation;

    const hasRole = () =>
      requiredRoles.some((role) => user?.roles?.includes(role));

    const checkRole: boolean = user && user.roles && hasRole();

    if (!checkRole)
      throw new ForbiddenException(
        '"Access denied: You do not have the necessary permissions to view this page."',
      );

    return checkRole;
  }
}
