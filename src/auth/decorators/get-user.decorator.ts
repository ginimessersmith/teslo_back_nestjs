import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
//? decorador (obtener un usuario mediante el bearer jwt):
export const GetUser= createParamDecorator(
    (data, context:ExecutionContext)=>{
        console.log({data})//? enviar como arreglo
        console.log({context})
        //! obtener la request:
        const req = context.switchToHttp().getRequest()
        //! obtener el user de la request:
        const user = req.user

        if(!user)throw new InternalServerErrorException('user not found in request')
        console.log({user})
        return user
    }
)