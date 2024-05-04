// import { PartialType } from '@nestjs/mapped-types'; para usar swagger OpenApi importarlo de swagger
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
