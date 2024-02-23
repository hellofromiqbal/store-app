const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Tag name should not be empty.'],
    minlength: [3, 'Tag name at least 3 characters length.'],
    maxlength: [20, 'Tag name cannot be more than 20 characters.']
  }
});

module.exports = model('Tag', tagSchema);