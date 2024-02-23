const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name should not be empty.'],
    minlength: [3, 'Product name at least 3 characters length.']
  },
  description: {
    type: String,
    maxlength: [1000, 'Product description should not be more than 1000 characters.']
  },
  price: {
    type: Number,
    default: 0
  },
  image_url: {
    type: String,
    default: null
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: {
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }
}, { timestamps: true });

module.exports = model('Product', productSchema);