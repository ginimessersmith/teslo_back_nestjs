import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //? obtener la metada:
  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //? ver lo que hay en los decoradores (setMetada):
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
    if (!validRoles) return true
    //? si el arreglo es vacio significa que cualquiera puede ingresar al controlador
    if (validRoles.length === 0) return true
    console.log({ validRoles })
    //? tomar los roles del user:
    const req = context.switchToHttp().getRequest()
    const user = req.user as User

    if (!user) throw new BadRequestException('user not found guards')
    console.log({ userRoles: user.roles })

    for (const rol of user.roles) {
      //? si el validRoles incluye uno de los roles del usuario return true
      if (validRoles.includes(rol)) {
        return true
      }

    }
    //?? return false;// true deja pasar, false: 403 forbidden
    throw new ForbiddenException(`User ${user.fullname} need a valid role: ${validRoles}`)
  }
}
