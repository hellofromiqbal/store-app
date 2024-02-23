const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name should not be empty.'],
    minlength: [3, 'Category name at least 3 characters length.'],
    maxlength: [20, 'Category name cannot be more than 20 characters.']
  }
});

module.exports = model('Category', categorySchema);