const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
  name: {
    type: String,
    minlength: [50, 'Panjang nama makanan minimal 50 karakter.'],
    required: [true, 'Name must be filled.']
  },
  price: {
    type: Number,
    required: [true, 'Harga item harus diisi.']
  },
  qty: {
    type: Number,
    required: [true, 'Kuantitas harus diisi.'],
    min: [1, 'Kuantitas minimal 1.']
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
});

module.exports = model('OrderItem', orderItemSchema);