const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.REACT_CLOUDINARY_NAME, 
  api_key: process.env.REACT_CLOUDINARY_API_KEY, 
  api_secret: process.env.REACT_CLOUDINARY_API_SECRET 
});

const HttpError = require('../models/http-error')

const MIME_TYPE_MAP = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'text/plain': 'txt',
  'image/pdf': 'pdf',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'uploads/files', // Customize the folder where uploads will be stored in Cloudinary.
  allowedFormats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'xls', 'ppt', 'txt', 'webp', 'docx'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: Apply transformations to the uploaded image.
});

const fileUpload = multer({
  limits: 500000,
  storage: storage,
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'uploads/files')
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = MIME_TYPE_MAP[file.mimetype]
  //     cb(null, uuidv4() + '.' + ext)
  //   }
  // }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new HttpError('Invalid file type!')
    cb(error, isValid)
  }
});

module.exports = fileUpload;