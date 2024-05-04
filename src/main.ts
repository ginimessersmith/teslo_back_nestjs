import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function main() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('App Main')
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  //? --------------- --------------- inicio documentacion
  const config = new DocumentBuilder()
  .setTitle('Teslo RESTfull Api example')
  .setDescription('The teslo API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //? --------------- --------------- fin documentacion
  await app.listen(+process.env.PORT);
  logger.log(`Server in port : ${+process.env.PORT}`)
  
}
main();
