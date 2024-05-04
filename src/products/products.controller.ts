import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { Auth, GetUserAllOrOneProperty } from '../auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Products')//? de openAPI , agrupar todo lo que hay en el controller en la doc
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @UseGuards(AuthGuard())
  @Post()
  @Auth()//? cualquier user puede crear
  @ApiResponse({ status: 201, description: 'product created', type: Product })//? como mostrar la response en la doc.
  @ApiResponse({ status: 400, description: 'bad request',  })//? como mostrar la response en la doc.
  @ApiResponse({ status: 403, description: 'forbidden', })//? como mostrar la response en la doc.
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUserAllOrOneProperty() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginatioDTO: PaginationDTO) {
    console.log({ paginatioDTO })
    return this.productsService.findAll(paginatioDTO);
  }

  @Get(':termSearch')
  findOne(@Param('termSearch') termSearch: string) {
    return this.productsService.findOnePlain(termSearch);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUserAllOrOneProperty() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
