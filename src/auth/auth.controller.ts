import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import {
  CreateUserDTO,
  LoginUserDto,
} from './dto';

import { User } from './entities/user.entity';
import { GetUserAllOrOneProperty } from './decorators/get-userAllOrOneProperty.decorator';
import { GetRequestRawHeaders } from './decorators/getRequestRawHeaders.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';
import { ApiTags } from '@nestjs/swagger';




@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')//?revalidacion del token, sin roles
  @Auth()//? validar el token anterior
  checkAuthStatus(
    @GetUserAllOrOneProperty() user:User//? obtener el user del token al que pertenece
  ){
    return this.authService.checkAuthStatus(user)
  }

  //? ruta de pruebas para los guards UseGuards() AuthGuard()
  @Get('private-one')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request:Express.Request
    // @GetUser(['nombre','email']) user:User
    @GetUserAllOrOneProperty() user: User,
    @GetRequestRawHeaders('rawHeaders') rawHeaders: string[]
  ) {

    //console.log({user:request.user})
    //console.log({user})

    return {
      ok: true,
      message: 'hola mundo',
      user,
      rawHeaders
    }
  }

  //? get con validacion de roles , ciertos roles pueden acceder
  // @SetMetadata('roles', ['admin', 'super-user'])//? añadir informacion extra el controlador, ej: los rolres que necesito
  @Get('private-two')
  @RoleProtected(ValidRoles.superUser,ValidRoles.admin,ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateTwo(
    @GetUserAllOrOneProperty() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  //? todos los decoradores (@RoleProtected, @UseGuards) en uno solo:
  @Get('private-three')
  @Auth(ValidRoles.superUser,ValidRoles.admin)
  privateThree(
    @GetUserAllOrOneProperty() user: User
  ){
    return {...user}
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
