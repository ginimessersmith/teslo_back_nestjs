import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDTO {

    @ApiProperty({
        default:10,
        description:'limit pagination'
    })//*DOCUMENTACION.
    @IsOptional()
    @Min(0)
    //llega como string, transformar: (en lugar de la transform de validation pipe en el main)
    @Type(() => Number) // == enableImplicitConversions:true
    limit?: number

    @ApiProperty({
        default:5,
        description:'offset pagination'
    })//*DOCUMENTACION.
    @IsOptional()
    @Min(0)
    @Type(() => Number) // == enableImplicitConversions:true
    offset?: number
}