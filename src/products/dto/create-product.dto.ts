import { ApiProperty } from "@nestjs/swagger"
import {
    IsArray, IsIn, IsInt, IsNumber,
    IsOptional, IsPositive, IsString,
    MinLength,
} from "class-validator"


export class CreateProductDto {
    
    @ApiProperty({
        description: 'titulo del producto',
        nullable: false,
        minLength: 1,
        example: 'gino shirt'
    })//* DOCUMENTACION
    @IsString()
    @MinLength(1)
    title: string
    
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string
    
    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number
    
    @ApiProperty()
    @IsString({ each: true })// each: cada elemento del arreglo debe cumplir con la condicion de que deben ser string
    @IsArray()
    sizes: string[]
    
    @ApiProperty()
    @IsIn(['men', 'women', 'kid', 'unisex'])// el gender puede ser uno de estos
    gender: string
    
    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[]
    
    //? imagenes
    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]
}
