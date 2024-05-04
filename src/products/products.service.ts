import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { validate as isValidUUID } from 'uuid'
import { Product, ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  //! manejo de errores:
  private readonly logger = new Logger('Producto Service')
  //? patron repositorio para grabar en la bd:
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImagenRepository: Repository<ProductImage>,
    //? para el query runner:
    private readonly dataSource: DataSource,
  ) { }

  //* funcion para los errores:
  private handleException(error: any) {
    console.log(error)
    if (error.code === '23505' || error.code === '22P02') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
  //!----------------------

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      //?crear un slug no recomendada:
      // if(!createProductDto.slug){
      //   createProductDto.slug=createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // }
      const { images = [], ...productDetails } = createProductDto

      const newProduct = this.productRepository.create({
        ...productDetails,
        //? crear las nuevas imagenes desde un arreglo:
        images: images.map(
          imagenUrl => this.productImagenRepository.create({ url: imagenUrl })
        ),
        user
      })
      await this.productRepository.save(newProduct)
      console.log('CREATE ONE PRODUCT')
      //? retonar el producto y las imagenes como un arreglo y uno un arreglo de json:
      return { ...newProduct, images }
    } catch (error) {
      // console.log(error)
      this.handleException(error)

    }
  }

  //TODO PAGINAR:
  async findAll(paginationDto: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDto
    console.log('GET ALL PRODUCT')
    const allProducts = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        //? para obtener las imagenes:
        images: true
      }
    })
    //? aplanar las imagenes para retornar solo las url
    return allProducts.map((product) => ({
      ...product, images: product.images.map(img => img.url)
    }))
  }

  async findOne(termSearch: string) {
    let product: Product
    if (isValidUUID(termSearch)) {
      product = await this.productRepository.findOneBy({ id: termSearch })
    } else {
      // product = await this.productRepository.findOneBy({ slug:termSearch })
      //? ejemplo con query builder para busqueda mas flexible
      const queryBuilder = this.productRepository.createQueryBuilder('prod')//? especificar un alias al product (prod)
      product = await queryBuilder.where(`title =:title or slug =:slug`, {
        title: termSearch,
        slug: termSearch,
      })
        .leftJoinAndSelect('prod.images', 'prodImagen')//?usar esto cuando se usa el query builder
        .getOne()
    }
    // const product = await this.productRepository.findOneBy({ id })
    if (!product) throw new BadRequestException(`Product with  ${termSearch} not found`)
    console.log('GET ONE PRODUCT')
    return product
  }

  async findOnePlain(term: string) {
    const { images = [], ...restProduct } = await this.findOne(term)
    return {
      ...restProduct,
      images: images.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    ///? uso de transacciones para la actualizacion de las imagenes (actualizacion del producto y borrar las anteriores imagenes)
    const { images, ...restUpdate } = updateProductDto
    const updateProduct = await this.productRepository.preload({
      id,
      ...restUpdate,
    })
    if (!updateProduct) throw new NotFoundException(`Product with id: ${id} not found`)
    //? si hay imagenes, borrarlas e insertar las nuevas con query runner:
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()//? conexion para la transaccion:
    await queryRunner.startTransaction()//? iniciar la transaccion
    try {
      if (images) {
        //? borrar todas las anteriores:
        await queryRunner.manager.delete(ProductImage, {
          product: { id }
        })
        //? crear las nuevas imagenes:
        updateProduct.images = images.map(
          imgUrl => this.productImagenRepository.create({ url: imgUrl })
        )
      }
      // else{
      //   //? otra forma para retornar las imagenes cuando no vengan:
      //   updateProduct.imagen = await this.productImagenRepository.findBy({product:{id}})
      // }
      //! agrear al producto el usuario que esta actualziando:
      updateProduct.user = user
      //? guardar los cambios:
      await queryRunner.manager.save(updateProduct)//? no se guardan los datos aun
      //? si no hay errores aplicar los cambios:
      await queryRunner.commitTransaction()
      await queryRunner.release()//? desconectar el queryrunner
      // await this.productRepository.save(updateProduct) ya no usar
      //return updateProduct si no viene las imagenes en la actualizacion no la muestra, solucion:
      return this.findOnePlain(id)
    } catch (error) {
      await queryRunner.rollbackTransaction()//? hacer un rollback de la transaccion
      this.handleException(error)
    }

  }

  async remove(id: string) {
    const productDelete = await this.findOne(id)
    //? eliminacion en cascada:
    await this.productRepository.remove(productDelete)

    console.log('REMOVE PRODUCT')
    return { messaage: `the product with id: ${id} deleted` }
  }

  async deleteAllProduct() {
    //? procedimiento destructivo, no usar en prod
    const query = this.productRepository.createQueryBuilder('product')
    try {
      return await query
        .delete()
        .where({})//? selecciona todos los productos
        .execute()
    } catch (error) {
      this.handleException(error)
    }
  }
}
