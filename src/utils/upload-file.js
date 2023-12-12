import * as path from 'path';
import multer from 'multer';
import admin from './firebase-admin';

const bucket = admin.storage().bucket();

const uploadFileToFirebase = async (filePath, destination) => {
  await bucket.upload(filePath, {
    destination,
  });

  // Get public URL for the file
  const file = bucket.file(destination);
  const signedUrls = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491',
  });

  const publicUrl = signedUrls[0];
  return publicUrl;
};

const uploadFilePath = path.resolve(__dirname, '../..', 'public/uploads');

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

export { uploadFile, uploadFileToFirebase };
