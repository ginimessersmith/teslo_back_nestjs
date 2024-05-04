import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Product,//? importar las entity que estan en este modulo
      ProductImage,
    ])
  ],
  exports:[
    ProductsService,//? para usar el servicio en otro modulo
    TypeOrmModule,//? para usar las tablas definidas en otro modulo
  ]
})
export class ProductsModule { }
