const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'Name should not be empty.'],
    minlength: [2, 'Name must be at least 2 characters length.'],
    maxlength: [100, 'Name cannot be longer than 100 characters.'],
  },
  email: {
    type: String,
    required: [true, 'Email should not be empty.'],
    maxlength: [100, 'Email cannot be longer than 100 characters.']
  },
  password: {
    type: String,
    required: [true, 'Password should not be empty.'],
    maxlength: [100, 'Password cannot be longer than 100 characters.']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  customerId: Number,
  token: [String]
}, { timestamps: true });

userSchema.plugin(AutoIncrement, { inc_field: 'customerId' });

module.exports = model('User', userSchema);