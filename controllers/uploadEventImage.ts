import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const multerStorage = multer.memoryStorage();



const multerFilter = (req: Request, file : Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        return cb(null, false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter : multerFilter
})

export const uploadImageToMemory = upload.single("image");