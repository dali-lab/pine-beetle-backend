import * as path from 'path';
import multer from 'multer';

const uploadFilePath = path.resolve(__dirname, '../..', 'public/uploads');

const getFilePath = (originalPath) => {
  if (originalPath) {
    const newPath = originalPath.split('/public')[1];
    return newPath || originalPath;
  }
  return null;
};

const storageFile = multer.diskStorage({
  destination: uploadFilePath,
  filename: (_req, file, fn) => {
    return fn(
      null,
      `${new Date().getTime().toString()}-${file.fieldname}${path.extname(
        file.originalname,
      )}`,
    );
  },
});

const uploadFile = multer({
  storage: storageFile,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const validExtensions = ['.png', '.jpg', '.jpeg'];
    const validMimeTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/pjpeg',
    ];

    const extension = validExtensions.includes(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = validMimeTypes.includes(file.mimetype);

    if (extension && mimeType) {
      return callback(null, true);
    }

    return callback(
      new Error(
        'Invalid file type. Only PNG, JPG, and JPEG files are allowed!',
      ),
    );
  },
}).single('image');

export { uploadFile, getFilePath };
