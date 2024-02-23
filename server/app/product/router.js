const router = require('express').Router();
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalname);
    const newFilename = path.basename(originalname, extension) + '-' + uniqueSuffix + extension;
    cb(null, newFilename);
  }
});
const upload = multer({ storage });

const productController = require('./controller');

router.post('/products', upload.single('image'), productController.store);

module.exports = router;