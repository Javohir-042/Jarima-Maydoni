import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Role } from "../enum/Role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        //     context.getHandler(),
        //     context.getClass(),
        // ]);

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) return false; 

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) return true;

        return requiredRoles.includes(user.role);
    }
}
