import { v4 as uuid } from 'uuid'

export const fileChangeName = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
) => {

    const fileExtension = file.mimetype.split('/')[1]
    const newName = `${uuid()}.${fileExtension}`
    callback(null, newName)
}