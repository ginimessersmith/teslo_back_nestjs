import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'

import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private productService: ProductsService
  ) { }

  async runSeed() {
    await this.deletedTable()
    const firstUser = await this.insertNewUser()
    await this.insertNewProduct(firstUser)
    return `Seed Execute`;
  }

  //? eliminacion en cierto orden , para avitar el problema de FK Contrains
  private async deletedTable() {
    //? primero eliminar todos los products:
    await this.productService.deleteAllProduct()//Eliminar todos los productos
    //? segundo eliminar todos los users
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})//? sin condicion == elimina todos los user
      .execute()
  }

  private async insertNewUser() {
    const seedUser = initialData.users//? todos los usuarios de la interface
    //? insert into user..... :
    const userList: User[] = []
    //? recorrer los usuarios de la interface:
    seedUser.forEach(user => {
      const { password: passwordToEncrypt, ...userRestData } = user
      userList.push(this.userRepository.create({
        ...userRestData,
        password: bcrypt.hashSync(passwordToEncrypt, 10)//? encriptacion
      }))

      
    })

    await this.userRepository.save(userList)
    return userList[0]
  }

  private async insertNewProduct(firstUser: User) {

    await this.productService.deleteAllProduct()
    //? insercion:
    const seedProducts = initialData.products//? obteniendo la lista de productos
    const insertPromise = []//? lista de promesas
    seedProducts.forEach(product => {
      insertPromise.push(this.productService.create(product, firstUser))
    })
    await Promise.all(insertPromise)//? insercion de manera paralela
    return true
  }

}
