import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetRequestRawHeaders = createParamDecorator(
    (data,context:ExecutionContext)=>{
        const req = context.switchToHttp().getRequest()
        const rawHeader = req.rawHeaders

        return (data && data =='rawHeaders')? rawHeader:[]
    }
)