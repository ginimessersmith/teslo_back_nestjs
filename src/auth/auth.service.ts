import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'

import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './entities/user.entity';



@Injectable()
export class AuthService {
  //? inyeccion del repositorio:
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jtwService: JwtService
  ) { }

  async create(createUserDto: CreateUserDTO) {

    try {
      const { password: passwordToEncrypt, ...userDataRest } = createUserDto
      const user = this.userRepository.create({
        ...userDataRest,
        password: bcrypt.hashSync(passwordToEncrypt, 10)//? encriptacion
      })
      await this.userRepository.save(user)
      const { password, isActive, ...userData } = user
      return {
        ...userData,
        token: this.getJwtToken({ id: userData.id })
      }
      //TODO retornar el jwt de acceso
    } catch (error) {
      this.handleError(error)
    }
  }


  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto

    const userLogin = await this.userRepository.findOne({
      where: { email },//? buscar cuando el email coincide
      select: { email: true, password: true, id: true }//? forzar para que retorne solo el password y el email
    })

    if (!userLogin) throw new UnauthorizedException(`not valid credentials (email)`)
    if (!bcrypt.compareSync(password, userLogin.password)) throw new UnauthorizedException(`not valid credentials (password)`)
    //TODO retornar el jtw
    return {
      ...userLogin,
      token: this.getJwtToken({ id: userLogin.id })
    }
  }

  async checkAuthStatus(user:User){
    //? en este punto el token fue validado y se retorna el user con el nuevo token
    return {
      ...user,
      token:this.getJwtToken({id:user.id})
    }
  }

  private handleError(error: any): never {
    const logger = new Logger('Auth-Service Error')

    if (error.code == '23505') throw new BadRequestException(error.detail)


    if (error.response.error == 'Unauthorized') throw new UnauthorizedException(error.response.message)
    logger.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
  // funcion para obtener el token:
  private getJwtToken(payload: JwtPayload) {
    const token = this.jtwService.sign(payload)
    return token
  }
  
  
  //? ------------------------------------------------------funciones por defecto: 
  async findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // async update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  async remove(id: number) {
    return `This action removes a #${id} auth`;
  }

}
