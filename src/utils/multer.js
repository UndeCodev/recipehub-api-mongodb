import multer from "multer";
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const MIMETYPES = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'];

const storage = multer.diskStorage({
    destination: join(__dirname, '../../uploads'),
    filename: ( _ , file, cb) => {
        const fileExtension = extname(file.originalname);
        cb(null, `${uuidv4()}${fileExtension}`);
    }
});

const fileFilter = ( _ , file, cb) => {
    if(MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb('Solo archivos con la extensión: jpg, jpeg, png, webp.');
}

export const multerUpload = multer({
    storage,
    fileFilter,
    limits: {
        fieldSize: 10000000
    }
});