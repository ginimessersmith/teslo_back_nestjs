import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';


@Injectable()
export class FilesService {

    getStaticProductImage(image_name:string){
        const path = join(__dirname,'../../static/products',image_name)
        console.log(path)
        if(!existsSync(path)) throw new BadRequestException('not product found image name')
        return path
    }
}
