const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../deliveryAddress/model');
const Order = require('../order/model');
const { Types } = require('mongoose');
const OrderItem = require('../order-item/model');

const store = async (req, res) => {
  try {
    const { delivery_fee, delivery_address } = req.body;
    const items = await CartItem.find({ user: req.user._id }).populate('product');
    if(!items) {
      return res.json({
        error: 1,
        message: `You can't create order because you don't have items in cart.`
      });
    };
    const address = await DeliveryAddress.findById(delivery_address);
    const order = new Order({
      _id: new Types.ObjectId(),
      status: 'waiting_payment',
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id
    });
    const orderItems = await OrderItem.insertMany(items.map((item) => ({
      ...item,
      name:item.product.name,
      qty: parseInt(item.qty),
      price: parseInt(item.product.price),
      order: order._id,
      product: item.product._id
    })));
    orderItems.forEach((item) => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
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
    const { skip = 0, limit = 10 } = req.query;
    const count = await Order.find({ user: req.user._id }).countDocuments();
    const orders = await Order
      .find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('order_items')
      .sort('-createdAt');
    return res.json({
      count,
      message: 'Data fetched!',
      data: orders.map((order) => order.toJSON({ virtuals: true }))
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

module.exports = {
  store,
  index
};