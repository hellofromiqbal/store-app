const router = require('express').Router();
const path = require('path');
const config = require('../config');
const { police_check } = require('../../middlewares');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    const { originalname } = file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalname);
    const newFilename = path.basename(originalname, extension) + '-' + uniqueSuffix + extension;
    cb(null, newFilename);
  }
});
const upload = multer({ storage });

const productController = require('./controller');

router.get(
  '/products',
  productController.index
);
router.post(
  '/products',
  upload.single('image'),
  police_check('create', 'Product'),
  productController.store
);
router.put(
  '/products/:id',
  upload.single('image'),
  police_check('update', 'Product'),
  productController.update
);
router.delete(
  '/products/:id',
  police_check('delete', 'Product'),
  productController.destroy
);

module.exports = router;