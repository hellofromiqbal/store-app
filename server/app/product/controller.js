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

const index = async (req, res) => {
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
  } catch (err) {
    return res.json({
      message: err.message
    });
  };
};

const update = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatePayload = req.body;

    if (!productId) {
      return res.status(400).json({ error: 1, message: 'Product ID is required for updating' });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 1, message: 'Product not found' });
    }

    let imagePath = existingProduct.image_url;
    if (req.file) {
      if (existingProduct.image_url) {
        fs.unlink(existingProduct.image_url, (err) => {
          if (err) {
            console.error('Error deleting previous image:', err);
          }
        });
      };
      imagePath = req.file.path;
    };

    if (updatePayload.category) {
      const isCategoryExist = await Category.findOne({ name: { $regex: updatePayload.category, $options: 'i' } });
      if (isCategoryExist) {
        updatePayload.category = isCategoryExist._id;
      } else {
        delete updatePayload.category;
      }
    }

    if (updatePayload.tags && updatePayload.tags.length > 0) {
      const isTagsExist = await Tag.find({ name: { $in: updatePayload.tags } });
      if (isTagsExist.length > 0) {
        updatePayload.tags = isTagsExist.map((tag) => tag._id);
      } else {
        delete updatePayload.tags;
      }
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...updatePayload, image_url: imagePath },
      { new: true }
    );

    return res.json({
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (err) {
    return res.status(500).json({ error: 1, message: err.message });
  };
};

module.exports = {
  store,
  index,
  update
};