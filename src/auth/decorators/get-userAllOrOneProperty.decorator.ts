import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUserAllOrOneProperty = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest()
        const user = req.user

        if (!user) throw new InternalServerErrorException('user not found (request - decorator GetUserEmail)')
        // si viene la data retornar la propiedad del usuario igual a la data, sino retornar todo
        return (!data) ? user : user[data]
    }
)