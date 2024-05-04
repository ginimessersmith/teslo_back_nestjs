import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService,],
  imports: [
    ProductsModule,//? importar el modulo para tener todo lo que el modulo esta exportando
    AuthModule,
  ],
})
export class SeedModule { }