export const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: Function,
) => {

    if (!file) return callback(new Error('not found file'), false)//? callback que recibe dos argumentos, error y aceptacion(boolean)
    const fileExtension = file.mimetype.split('/')[1]//? obteniendo la extension que esta en la ultima posicion del arry split
    const validationExtension =['jpg','jpeg','png','gif']

    if(validationExtension.includes(fileExtension)) return callback(null,true)
    callback(null,false)//? null significa sin errores y true que el archivo fue

}