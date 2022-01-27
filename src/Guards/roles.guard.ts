import { ROLES_KEY } from './../decorator/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role_ENUM } from 'src/roles/roles.enum';
import { Payload } from 'src/core/Payload/payload';
import { IS_PUBLIC_KEY } from 'src/decorator/isPublic';
interface RequestExtend extends ExecutionContext {
    user: Payload;
}
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: RequestExtend): boolean {
        const requiredRoles: Role_ENUM[] = this.reflector.getAllAndOverride<Role_ENUM[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        if (!requiredRoles) {
            return true;
        }
        const request: RequestExtend = context.switchToHttp().getRequest();
        const user: Payload = request.user;

        return requiredRoles.some((role) => user.role.includes(role));
    }
}
