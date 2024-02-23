const fs = require('fs');
const path = require('path');
const Product = require('../product/model');
const Category = require('../category/model');
const Tag = require('../tag/model');
const config = require('../config');

const store = async (req, res) => {
  try {
    let payload = req.body;
    console.log(req.file);

    if(payload.category) {
      const isCategoryExist = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
      if(isCategoryExist) {
        payload = { ...payload, category: isCategoryExist._id }
      } else {
        delete payload.category;
      };
    };

    if(payload.tags && payload.tags.length > 0) {
      const isTagsExist = await Tag.find({ name: { $in: payload.tags } });
      if(isTagsExist.length > 0) {
        payload = { ...payload, tags: isTagsExist.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      };
    };

    const newProduct = await Product.create({ ...payload, image_url: req.file.path });
    
    return res.json({
      message: 'New product added!',
      data: newProduct
    });

    // if(req.file) {
    //   const tmp_path = req.file.path;
    //   const originalExt = req.file.originalname.split('.').pop();
    //   const filename = req.file.filename + '.' + originalExt;
    //   const target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

    //   const src = fs.createReadStream(tmp_path);
    //   const dest = fs.createWriteStream(target_path);
    //   src.pipe(dest);

    //   src.on('end', async () => {
    //     try {
    //       const newProduct = await Product.create({
    //         ...payload,
    //         image_url: filename
    //       });
    //       return res.json({
    //         message: 'New product added!',
    //         data: newProduct
    //       });
    //     } catch (err) {
    //       fs.unlinkSync(target_path);
    //       if(err && err.name === 'ValidationError') {
    //         return res.json({
    //           error: 1,
    //           message: err.message,
    //           fields: err.errors
    //         });
    //       };
    //     };
    //   });
    // } else {
    //   const newProduct = await Product.create(payload);
    //   return res.json({
    //     message: 'New product added!',
    //     data: newProduct
    //   });
    // };
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
  };
};

const index = async (req, res, next) => {
  try {
    const { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;

    let criteria = {};

    if(q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' }
      };
    };

    if(category.length) {
      const categoryResult = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } });

      if(categoryResult) {
        criteria = { ...criteria, category: categoryResult._id }
      };
    };

    if(tags.length) {
      const tagsResult = await Tag.find({ name: { $in: tags } });

      if(tagsResult.length > 0) {
        criteria = { ...criteria, tags: { $in: tagsResult.map((tag) => tag._id) } }
      };
    };

    const count = await Product.find(criteria).countDocuments();

    const products = await Product
      .find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags');
    
    return res.json({
      count,
      message: 'Products fetched!',
      data: products
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  store,
  index
};