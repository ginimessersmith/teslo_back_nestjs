import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileChangeName } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServices:ConfigService
    ) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('archivo', {//? interceptar el body-formdata y buscar key=archivo
      fileFilter: fileFilter,
      limits: {
        // fileSize: 1000//? 1000 bites
      },
      storage: diskStorage({
        //? lugar donde almacer de manera local
        filename: fileChangeName,
        destination: './static/products',
      })
    }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,//? decorador para cuando venga un archivo
  ) {
    //? si no pasa el filter en el interceptor nunca va existir el archivo
    if (!file) throw new BadRequestException('error al subir el archivo')
    // const secureUrl = `${file.filename} http://localhost:3000/api/files/product/59a35e51-005a-4e42-9581-1c1d394de20c.jpeg`
    // const secureUrl = 'http://localhost:3000/api/files/product/59a35e51-005a-4e42-9581-1c1d394de20c.jpeg'
    const secureUrl = `${this.configServices.get('HOST_API')}files/product/${file.filename}`
    return {
      secureUrl
    }
  }

  @Get('product/:image_name')
  findProductImage(
    @Res() res: Response,//? la response de express
    @Param('image_name') image_name: string
  ) {
    // Res es para emitir manualmente la respuesta
    const path = this.filesService.getStaticProductImage(image_name)
    // res.status(403).json({
    //   ok: false,
    //   path
    // })
    res.sendFile(path)
    // return this.filesService.getStaticProductImage(image_name)
  }

}
